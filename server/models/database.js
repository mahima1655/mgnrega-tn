const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../mgnrega.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDB = async () => {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS mgnrega_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fin_year TEXT,
        month TEXT,
        state_code TEXT,
        state_name TEXT,
        district_code TEXT,
        district_name TEXT NOT NULL,
        avg_days_employment REAL DEFAULT 0,
        total_households_worked INTEGER DEFAULT 0,
        total_individuals_worked INTEGER DEFAULT 0,
        total_active_workers INTEGER DEFAULT 0,
        total_exp REAL DEFAULT 0,
        wages REAL DEFAULT 0,
        women_persondays INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(district_name, month, fin_year)
      )
    `, (err) => {
      if (err) {
        console.error('Database initialization error:', err);
        reject(err);
      } else {
        console.log('Database initialized');
        resolve();
      }
    });
  });
};

const upsertMGNREGAData = async (data) => {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT OR REPLACE INTO mgnrega_data 
      (fin_year, month, state_code, state_name, district_code, district_name, avg_days_employment, total_households_worked, total_individuals_worked, total_active_workers, total_exp, wages, women_persondays)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [data.finYear, data.month, data.stateCode, data.stateName, data.districtCode, data.districtName, data.avgDaysEmployment, data.totalHouseholdsWorked, data.totalIndividualsWorked, data.totalActiveWorkers, data.totalExp, data.wages, data.womenPersondays], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const getDistrictData = async (district) => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM mgnrega_data 
      WHERE district_name = ? 
      ORDER BY fin_year DESC, month DESC 
      LIMIT 12
    `, [district], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const getStateAverage = async () => {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT 
        AVG(total_households_worked) as avg_households,
        AVG(avg_days_employment) as avg_days,
        AVG(total_exp) as avg_funds,
        AVG(total_active_workers) as avg_workers
      FROM mgnrega_data 
      WHERE state_name = 'TAMIL NADU'
    `, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getAllDistricts = async () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT DISTINCT district_name 
      FROM mgnrega_data 
      WHERE state_name = 'TAMIL NADU'
      ORDER BY district_name
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows.map(row => row.district_name));
    });
  });
};

// Initialize on module load
initDB();

module.exports = {
  upsertMGNREGAData,
  getDistrictData,
  getStateAverage,
  getAllDistricts
};