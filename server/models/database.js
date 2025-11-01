const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/mgnrega_tn',
});

// Initialize database tables
const initDB = async () => {
  const client = await pool.connect();
  try {
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
    console.log('Database initialized');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    client.release();
  }
};

const upsertMGNREGAData = async (data) => {
  const client = await pool.connect();
  try {
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
    `, [data.finYear, data.month, data.stateCode, data.stateName, data.districtCode, data.districtName, data.avgDaysEmployment, data.totalHouseholdsWorked, data.totalIndividualsWorked, data.totalActiveWorkers, data.totalExp, data.wages, data.womenPersondays]);
  } finally {
    client.release();
  }
};

const getDistrictData = async (district) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM mgnrega_data 
      WHERE district_name = $1 
      ORDER BY fin_year DESC, month DESC 
      LIMIT 12
    `, [district]);
    return result.rows;
  } finally {
    client.release();
  }
};

const getStateAverage = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        AVG(total_households_worked) as avg_households,
        AVG(avg_days_employment) as avg_days,
        AVG(total_exp) as avg_funds,
        AVG(total_active_workers) as avg_workers
      FROM mgnrega_data 
      WHERE state_name = 'TAMIL NADU'
    `);
    return result.rows[0];
  } finally {
    client.release();
  }
};

const getAllDistricts = async () => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT DISTINCT district_name 
      FROM mgnrega_data 
      WHERE state_name = 'TAMIL NADU'
      ORDER BY district_name
    `);
    return result.rows.map(row => row.district_name);
  } finally {
    client.release();
  }
};

// Initialize on module load
initDB();

module.exports = {
  upsertMGNREGAData,
  getDistrictData,
  getStateAverage,
  getAllDistricts
};