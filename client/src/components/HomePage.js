import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../utils/LanguageContext';
import { api, detectLocation } from '../services/api';
import VoiceGuide from './VoiceGuide';
import IconBasedNavigation from './IconBasedNavigation';


const HomePage = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, language, toggleLanguage, getDistrictName } = useLanguage();

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await api.getDistricts();
      setDistricts(response.data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = async () => {
    try {
      setLoading(true);
      const district = await detectLocation();
      if (district) {
        setSelectedDistrict(district);
      } else {
        alert('Could not detect your district automatically. Please select from the dropdown.');
      }
    } catch (error) {
      console.error('Location error:', error);
      if (error.message.includes('denied')) {
        alert('Location access denied. Please enable location services and try again.');
      } else if (error.message.includes('unavailable')) {
        alert('Location service unavailable. Please select your district manually.');
      } else {
        alert('Location detection failed. Please select your district from the dropdown.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (selectedDistrict) {
      navigate(`/dashboard/${selectedDistrict}`);
    }
  };

  if (loading && districts.length === 0) {
    return (
      <>
        <div className="gov-header">
          <div className="container">
            <div className="gov-logo">
              <div className="emblem">🇮🇳</div>
            </div>
            <div className="gov-title">
              <h1>{t('title')}</h1>
              <p>Government of Tamil Nadu</p>
            </div>
            
            <IconBasedNavigation 
              onDistrictSelect={setSelectedDistrict}
              districts={districts}
            />
          </div>
        </div>
        
        <VoiceGuide />
        <div className="container">
          <div className="loading">{t('loading')}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="gov-header">
        <div className="container">
          <div className="gov-logo">
            <div className="emblem">🇮🇳</div>
          </div>
          <div className="gov-title">
            <h1>{t('title')}</h1>
            <p>Government of Tamil Nadu</p>
          </div>
          <button className="language-toggle" onClick={toggleLanguage}>
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>
      </div>
      
      <div className="container">
        <div className="main-content">
          <div className="section-header">
            <h2>{t('selectDistrict')}</h2>
          </div>
          
          <div className="district-selector">
            <div className="form-group">
              <label className="form-label">{t('selectDistrict')}</label>
              <select 
                className="district-dropdown"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">-- {t('selectDistrict')} --</option>
                {districts.map(district => (
                  <option key={district} value={district}>{getDistrictName(district)}</option>
                ))}
              </select>
            </div>

            <div className="button-group">
              <button 
                className="btn btn-secondary"
                onClick={handleAutoDetect}
                disabled={loading}
              >
                📍 {t('autoDetect')}
              </button>

              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!selectedDistrict || loading}
              >
                {loading ? t('loading') : t('go')}
              </button>
            </div>
            

          </div>
        </div>

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

export default HomePage;