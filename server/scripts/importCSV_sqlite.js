const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();

const importCSVData = async (csvFilePath) => {
  const db = new sqlite3.Database('./mgnrega.db');
  
  // Create table
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
  `);

  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        console.log(`Processing ${results.length} records...`);
        
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO mgnrega_data 
          (fin_year, month, state_code, state_name, district_code, district_name, avg_days_employment, total_households_worked, total_individuals_worked, total_active_workers, total_exp, wages, women_persondays)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        results.forEach(row => {
          if (row.district_name && row.district_name.trim() && row.state_name === 'TAMIL NADU') {
            stmt.run([
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
        });
        
        stmt.finalize();
        db.close();
        
        console.log('SQLite import completed successfully');
        resolve(results.length);
      });
  });
};

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