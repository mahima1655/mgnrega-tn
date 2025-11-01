const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const importCSVData = async (csvFilePath) => {
  const client = await pool.connect();
  
  try {
    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mgnrega_data (
        id SERIAL PRIMARY KEY,
        fin_year VARCHAR(20),
        month VARCHAR(20),
        state_code VARCHAR(10),
        state_name VARCHAR(100),
        district_code VARCHAR(10),
        district_name VARCHAR(100) NOT NULL,
        avg_days_employment DECIMAL(10,2) DEFAULT 0,
        total_households_worked INTEGER DEFAULT 0,
        total_individuals_worked INTEGER DEFAULT 0,
        total_active_workers INTEGER DEFAULT 0,
        total_exp DECIMAL(15,2) DEFAULT 0,
        wages DECIMAL(15,2) DEFAULT 0,
        women_persondays INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(district_name, month, fin_year)
      )
    `);
    
    return new Promise((resolve, reject) => {
      const results = [];
      
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          if (data.district_name && data.state_name === 'TAMIL NADU') {
            results.push(data);
          }
        })
        .on('end', async () => {
          try {
            console.log(`Processing ${results.length} Tamil Nadu records...`);
            
            for (const row of results) {
              await client.query(`
                INSERT INTO mgnrega_data 
                (fin_year, month, state_code, state_name, district_code, district_name, avg_days_employment, total_households_worked, total_individuals_worked, total_active_workers, total_exp, wages, women_persondays)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (district_name, month, fin_year)
                DO UPDATE SET
                  avg_days_employment = EXCLUDED.avg_days_employment,
                  total_households_worked = EXCLUDED.total_households_worked,
                  total_individuals_worked = EXCLUDED.total_individuals_worked,
                  total_active_workers = EXCLUDED.total_active_workers,
                  total_exp = EXCLUDED.total_exp,
                  wages = EXCLUDED.wages,
                  women_persondays = EXCLUDED.women_persondays,
                  updated_at = CURRENT_TIMESTAMP
              `, [
                row.fin_year || '2025-2026',
                row.month || '',
                row.state_code || '',
                row.state_name || '',
                row.district_code || '',
                row.district_name.trim(),
                parseFloat(row.Average_days_of_employment_provided_per_Household || 0),
                parseInt(row.Total_No_of_Active_Job_Cards || 0),
                parseInt(row.Total_Individuals_Worked || 0),
                parseInt(row.Total_No_of_Active_Workers || 0),
                parseFloat(row.Total_Exp || 0),
                parseFloat(row.Wages || 0),
                parseInt(row.Women_Persondays || 0)
              ]);
            }
            
            console.log('PostgreSQL import completed successfully');
            resolve(results.length);
          } catch (error) {
            reject(error);
          }
        });
    });
  } finally {
    client.release();
  }
};

// Usage: node importCSV_postgres.js path/to/csv
if (require.main === module) {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('Please provide CSV file path');
    process.exit(1);
  }
  
  importCSVData(csvPath)
    .then(count => {
      console.log(`Imported ${count} records`);
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

module.exports = importCSVData;