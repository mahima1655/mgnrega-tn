import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    title: 'MGNREGA Tamil Nadu Dashboard',
    selectDistrict: 'Select Your District',
    go: 'View Dashboard',
    jobsProvided: 'Jobs Provided',
    avgDays: 'Avg Days Employment',
    fundsDisburse: 'Funds Disbursed (₹)',
    beneficiaries: 'Active Beneficiaries',
    comparison: 'Comparison with State Average',
    performance: 'Performance Trend',
    loading: 'Loading...',
    autoDetect: 'Auto-detect my location',
    footer: 'Government of Tamil Nadu - Rural Development Department',
    copyright: '© 2025 Government of Tamil Nadu. All rights reserved.',
    // Audio texts in English
    audioTexts: {
      jobsProvided: 'Number of jobs provided is',
      avgDays: 'Average days of employment is',
      fundsDisburse: 'Total funds disbursed is rupees',
      beneficiaries: 'Number of active beneficiaries is'
    }
  },
  ta: {
    title: 'மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதித் திட்டம்',
    selectDistrict: 'உங்கள் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
    go: 'டாஷ்போர்டைப் பார்க்கவும்',
    jobsProvided: 'வழங்கப்பட்ட வேலைகள்',
    avgDays: 'சராசரி நாட்கள் வேலை',
    fundsDisburse: 'விநியோகிக்கப்பட்ட நிதி (₹)',
    beneficiaries: 'செயலில் உள்ள பயனாளிகள்',
    comparison: 'மாநில சராசரியுடன் ஒப்பீடு',
    performance: 'செயல்திறன் போக்கு',
    loading: 'ஏற்றுகிறது...',
    autoDetect: 'எனது இருப்பிடத்தை தானாக கண்டறியவும்',
    footer: 'தமிழ்நாடு அரசு - கிராமப்புற வளர்ச்சித் துறை',
    copyright: '© 2025 தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    // Audio texts in Tamil
    audioTexts: {
      jobsProvided: 'வழங்கப்பட்ட வேலைகளின் எண்ணிக்கை',
      avgDays: 'சராசரி நாட்கள் வேலை வாய்ப்பு',
      fundsDisburse: 'விநியோகிக்கப்பட்ட நிதியின் அளவு ரூபாய்',
      beneficiaries: 'செயலில் உள்ள பயனாளிகளின் எண்ணிக்கை'
    }
  }
};

const districtNames = {
  'ARIYALUR': 'அரியலூர்',
  'CHENGALPATTU': 'செங்கல்பட்டு',
  'CHENNAI': 'சென்னை',
  'COIMBATORE': 'கோயம்புத்தூர்',
  'CUDDALORE': 'கடலூர்',
  'DHARMAPURI': 'தர்மபுரி',
  'DINDIGUL': 'திண்டுக்கல்',
  'ERODE': 'ஈரோடு',
  'KALLAKURICHI': 'கள்ளக்குறிச்சி',
  'KANCHIPURAM': 'காஞ்சிபுரம்',
  'KANYAKUMARI': 'கன்னியாகுமரி',
  'KARUR': 'கரூர்',
  'KRISHNAGIRI': 'கிருஷ்ணகிரி',
  'MADURAI': 'மதுரை',
  'MAYILADUTHURAI': 'மயிலாடுதுறை',
  'NAGAPATTINAM': 'நாகப்பட்டினம்',
  'NAMAKKAL': 'நாமக்கல்',
  'NILGIRIS': 'நீலகிரி',
  'PERAMBALUR': 'பெரம்பலூர்',
  'PUDUKKOTTAI': 'புதுக்கோட்டை',
  'RAMANATHAPURAM': 'இராமநாதபுரம்',
  'RANIPET': 'ராணிப்பேட்டை',
  'SALEM': 'சேலம்',
  'SIVAGANGA': 'சிவகங்கை',
  'TENKASI': 'தென்காசி',
  'THANJAVUR': 'தஞ்சாவூர்',
  'THENI': 'தேனி',
  'THOOTHUKUDI': 'தூத்துக்குடி',
  'TIRUCHIRAPPALLI': 'திருச்சிராப்பள்ளி',
  'TIRUNELVELI': 'திருநெல்வேலி',
  'TIRUPATHUR': 'திருப்பத்தூர்',
  'TIRUPPUR': 'திருப்பூர்',
  'TIRUVALLUR': 'திருவள்ளூர்',
  'TIRUVANNAMALAI': 'திருவண்ணாமலை',
  'TIRUVARUR': 'திருவாரூர்',
  'VELLORE': 'வேலூர்',
  'VILUPPURAM': 'விழுப்புரம்',
  'VIRUDHUNAGAR': 'விருதுநகர்'
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ta' : 'en');
  };

  const convertToTamilNumbers = (value) => {
    const tamilNumbers = {
      '0': 'சுழியம்', '1': 'ஒன்று', '2': 'இரண்டு', '3': 'மூன்று', '4': 'நான்கு',
      '5': 'ஐந்து', '6': 'ஆறு', '7': 'ஏழு', '8': 'எட்டு', '9': 'ஒன்பது'
    };
    
    return value.toString().split('').map(digit => tamilNumbers[digit] || digit).join(' ');
  };

  const speak = (text, isMetric = false, value = '') => {
    let speechText = text;
    
    if (isMetric && value && language === 'ta') {
      const cleanValue = value.toString().replace(/[^0-9]/g, '');
      const tamilValue = convertToTamilNumbers(cleanValue);
      speechText = `${text} ${tamilValue}`;
    } else if (isMetric && value) {
      speechText = `${text} ${value}`;
    }
    
    // Simple browser TTS that works
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(speechText);
      
      if (language === 'ta') {
        utterance.lang = 'hi-IN'; // Hindi works better for Tamil text
        utterance.rate = 0.6;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
      }
      
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.speak(utterance);
    }
  };

  const getDistrictName = (district) => {
    return language === 'ta' ? (districtNames[district] || district) : district;
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage, speak, getDistrictName }}>
      {children}
    </LanguageContext.Provider>
  );
};