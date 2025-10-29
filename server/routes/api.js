const express = require('express');
const dataService = require('../services/dataService');

const router = express.Router();

// Get all districts
router.get('/districts', async (req, res) => {
  try {
    const districts = await dataService.getAllDistricts();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get district performance data
router.get('/district/:name', async (req, res) => {
  try {
    const data = await dataService.getDistrictData(req.params.name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get state average for comparison
router.get('/state-average', async (req, res) => {
  try {
    const average = await dataService.getStateAverage();
    res.json(average);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual data refresh
router.post('/refresh-data', async (req, res) => {
  try {
    await dataService.fetchAndStoreData();
    res.json({ message: 'Data refreshed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;