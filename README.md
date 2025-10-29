# MGNREGA Tamil Nadu Dashboard

A web application for rural citizens of Tamil Nadu to understand their district's MGNREGA performance with minimal technical literacy.

## Features

- **District Selection**: Dropdown and auto-location detection
- **Performance Metrics**: Jobs, employment days, funds, beneficiaries
- **Visual Indicators**: Color-coded performance (Green/Yellow/Red)
- **Multilingual**: Tamil and English with audio support
- **Responsive Design**: Mobile-first for low-spec phones
- **Offline Support**: Cached data for reliability

## Tech Stack

- **Frontend**: React.js, Chart.js, Web Speech API
- **Backend**: Node.js, Express, PostgreSQL
- **Deployment**: Railway
- **Data Source**: data.gov.in MGNREGA API

## Setup Instructions

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Database Setup
- Create PostgreSQL database
- Update DATABASE_URL in server/.env

### 3. Import Your CSV Data
```bash
cd server
npm run import-csv path/to/your/csv/file.csv
```

### 4. Development
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```

## Environment Variables

Create `server/.env`:
```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/mgnrega_tn
API_KEY=579b464db66ec23bdd000001a58bd96e288649437367e8b6c365fea3
API_URL=https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722
```

## CSV Data Format

Your CSV should have columns:
- district_name or District
- jobs_provided or Jobs
- avg_days or AvgDays
- funds_disbursed or Funds
- beneficiaries or Beneficiaries
- month (optional)
- year (optional)

## Deployment

1. Connect to Railway
2. Set environment variables
3. Deploy automatically on push

## API Endpoints

- `GET /api/districts` - Get all districts
- `GET /api/district/:name` - Get district data
- `GET /api/state-average` - Get state averages
- `POST /api/refresh-data` - Manual data refresh

## Accessibility Features

- Large buttons and text
- Audio explanations (Tamil/English)
- Color-coded indicators
- Simple navigation
- Mobile-optimized