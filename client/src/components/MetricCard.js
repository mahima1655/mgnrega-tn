import React from 'react';
import { useLanguage } from '../utils/LanguageContext';

const MetricCard = ({ icon, value, label, level, metricType }) => {
  const { speak, language, t } = useLanguage();

  const handleAudioClick = () => {
    const audioText = language === 'ta' ? 
      t('audioTexts')[metricType] || label : 
      t('audioTexts')[metricType] || `${label} is`;
    
    speak(audioText, true, value);
  };

  return (
    <div className={`metric-card ${level}`}>
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <button className="audio-button" onClick={handleAudioClick}>
          🔊
        </button>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
};

export default MetricCard;