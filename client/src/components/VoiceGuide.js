import React, { useState } from 'react';
import { useLanguage } from '../utils/LanguageContext';

const VoiceGuide = () => {
  const [isListening, setIsListening] = useState(false);
  const { language, speak, t } = useLanguage();

  const startVoiceGuide = () => {
    const welcomeText = language === 'ta' 
      ? 'வணக்கம். இது மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதித் திட்டத்தின் வலைதளம். உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்க கீழே உள்ள பட்டியலைப் பயன்படுத்தவும்.'
      : 'Welcome to MGNREGA Tamil Nadu Dashboard. Use the dropdown below to select your district.';
    
    speak(welcomeText);
  };

  const explainMGNREGA = () => {
    const explanation = language === 'ta'
      ? 'மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதித் திட்டம் கிராமப்புற குடும்பங்களுக்கு ஆண்டுக்கு நூறு நாட்கள் வேலை வாய்ப்பு அளிக்கும் திட்டம். இது உங்கள் மாவட்டத்தின் செயல்திறனைக் காட்டுகிறது.'
      : 'MGNREGA provides 100 days of guaranteed employment to rural households every year. This shows your district performance.';
    
    speak(explanation);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: '#27ae60',
      padding: '15px',
      borderRadius: '50px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <button 
        onClick={startVoiceGuide}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          marginRight: '10px'
        }}
        title={language === 'ta' ? 'வழிகாட்டுதல்' : 'Voice Guide'}
      >
        🎤
      </button>
      
      <button 
        onClick={explainMGNREGA}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer'
        }}
        title={language === 'ta' ? 'திட்ட விளக்கம்' : 'Explain MGNREGA'}
      >
        ℹ️
      </button>
    </div>
  );
};

export default VoiceGuide;