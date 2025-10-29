const axios = require('axios');
const xml2js = require('xml2js');
const db = require('../models/database');

class DataService {
  async fetchAndStoreData() {
    try {
      const response = await axios.get(process.env.API_URL, {
        params: {
          'api-key': process.env.API_KEY,
          format: 'xml',
          'filters[state_name]': 'TAMIL NADU',
          'filters[fin_year]': '2025-2026'
        }
      });

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.data);
      
      const records = result.root.record || [];
      
      for (const record of records) {
        await db.upsertMGNREGAData({
          district: record.district_name?.[0] || '',
          jobsProvided: parseInt(record.total_jobs_provided?.[0]) || 0,
          avgDaysEmployment: parseFloat(record.avg_days_employment?.[0]) || 0,
          fundsDisburse: parseFloat(record.funds_disbursed?.[0]) || 0,
          activeBeneficiaries: parseInt(record.active_beneficiaries?.[0]) || 0,
          month: record.month?.[0] || '',
          year: record.year?.[0] || '',
          finYear: '2025-2026'
        });
      }

      console.log(`Updated ${records.length} records`);
    } catch (error) {
      console.error('Data fetch error:', error);
      throw error;
    }
  }

  async getDistrictData(district) {
    return await db.getDistrictData(district);
  }

  async getStateAverage() {
    return await db.getStateAverage();
  }

  async getAllDistricts() {
    return await db.getAllDistricts();
  }
}

module.exports = new DataService();