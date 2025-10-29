import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { api } from '../services/api';
import MetricCard from './MetricCard';
import PerformanceChart from './PerformanceChart';

const Dashboard = () => {
  const { district } = useParams();
  const [data, setData] = useState([]);
  const [stateAvg, setStateAvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, language, toggleLanguage, getDistrictName } = useLanguage();

  useEffect(() => {
    loadData();
  }, [district]);

  const loadData = async () => {
    try {
      const [districtResponse, stateResponse] = await Promise.all([
        api.getDistrictData(district),
        api.getStateAverage()
      ]);
      
      setData(districtResponse.data);
      setStateAvg(stateResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (value, avgValue) => {
    if (!avgValue) return 'average';
    const ratio = value / avgValue;
    if (ratio >= 1.1) return 'good';
    if (ratio <= 0.9) return 'poor';
    return 'average';
  };

  if (loading) {
    return (
      <>
        <div className="dashboard-header">
          <div className="district-info">
            <h1>{district} மாவட்டம்</h1>
          </div>
        </div>
        <div className="container">
          <div className="loading">{t('loading')}</div>
        </div>
      </>
    );
  }

  const currentData = data[0] || {};

  return (
    <>
      <div className="dashboard-header">
        <div>
          <Link to="/" className="breadcrumb">
            ← Back to Home
          </Link>
          <div className="district-info">
            <h1>{getDistrictName(district)} {language === 'ta' ? 'மாவட்டம்' : 'District'}</h1>
            <p>{new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN')}</p>
          </div>
        </div>
        <button className="language-toggle" onClick={toggleLanguage}>
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>
      
      <div className="container">
        <div className="main-content">
          <div className="metric-cards">
            <MetricCard
              icon="🏠"
              value={currentData.total_households_worked || 0}
              label={t('jobsProvided')}
              level={getPerformanceLevel(currentData.total_households_worked, stateAvg?.avg_households)}
              metricType="jobsProvided"
            />
            
            <MetricCard
              icon="📅"
              value={parseFloat(currentData.avg_days_employment || 0).toFixed(1)}
              label={t('avgDays')}
              level={getPerformanceLevel(currentData.avg_days_employment, stateAvg?.avg_days)}
              metricType="avgDays"
            />
            
            <MetricCard
              icon="💰"
              value={`₹${(currentData.total_exp || 0).toLocaleString('en-IN')}`}
              label={t('fundsDisburse')}
              level={getPerformanceLevel(currentData.total_exp, stateAvg?.avg_funds)}
              metricType="fundsDisburse"
            />
            
            <MetricCard
              icon="👥"
              value={currentData.total_active_workers || 0}
              label={t('beneficiaries')}
              level={getPerformanceLevel(currentData.total_active_workers, stateAvg?.avg_workers)}
              metricType="beneficiaries"
            />
          </div>
        </div>
        
        <PerformanceChart data={data} />
      </div>
      
      <footer className="gov-footer">
        <div className="container">
          <div className="footer-content">
            <p>{t('footer')}</p>
            <p>{t('copyright')}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Dashboard;