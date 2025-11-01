import React from 'react';
import { useLanguage } from '../utils/LanguageContext';

const IconBasedNavigation = ({ onDistrictSelect, districts }) => {
  const { language, speak, getDistrictName } = useLanguage();

  const majorDistricts = [
    { name: 'CHENNAI', icon: '🏙️', color: '#e74c3c' },
    { name: 'COIMBATORE', icon: '🏭', color: '#3498db' },
    { name: 'MADURAI', icon: '🏛️', color: '#9b59b6' },
    { name: 'SALEM', icon: '🌾', color: '#27ae60' },
    { name: 'VELLORE', icon: '🏰', color: '#f39c12' },
    { name: 'TIRUCHIRAPPALLI', icon: '⛩️', color: '#e67e22' }
  ];

  const handleDistrictClick = (district) => {
    const announcement = language === 'ta'
      ? `${getDistrictName(district)} மாவட்டம் தேர்ந்தெடுக்கப்பட்டது`
      : `${district} district selected`;
    
    speak(announcement);
    onDistrictSelect(district);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        fontSize: '1.5rem',
        color: '#2c3e50'
      }}>
        {language === 'ta' ? 'முக்கிய மாவட்டங்கள்' : 'Major Districts'}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        padding: '20px'
      }}>
        {majorDistricts.map(district => (
          <button
            key={district.name}
            onClick={() => handleDistrictClick(district.name)}
            style={{
              background: district.color,
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'center',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
              {district.icon}
            </div>
            <div style={{ fontSize: '0.9rem' }}>
              {getDistrictName(district.name)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconBasedNavigation;