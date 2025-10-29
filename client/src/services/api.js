import axios from 'axios';

const API_BASE = '/api';

export const api = {
  getDistricts: () => axios.get(`${API_BASE}/districts`),
  getDistrictData: (district) => axios.get(`${API_BASE}/district/${district}`),
  getStateAverage: () => axios.get(`${API_BASE}/state-average`),
  refreshData: () => axios.post(`${API_BASE}/refresh-data`)
};

export const detectLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Tamil Nadu coordinates check
          if (latitude < 8.0 || latitude > 13.5 || longitude < 76.0 || longitude > 80.5) {
            reject(new Error('Location outside Tamil Nadu'));
            return;
          }
          
          const districts = await api.getDistricts();
          
          // Simple coordinate-based district mapping for major cities
          const districtMap = {
            'CHENNAI': { lat: 13.0827, lng: 80.2707, radius: 0.5 },
            'COIMBATORE': { lat: 11.0168, lng: 76.9558, radius: 0.3 },
            'MADURAI': { lat: 9.9252, lng: 78.1198, radius: 0.3 },
            'TIRUCHIRAPPALLI': { lat: 10.7905, lng: 78.7047, radius: 0.3 },
            'SALEM': { lat: 11.664, lng: 78.146, radius: 0.3 },
            'TIRUNELVELI': { lat: 8.7139, lng: 77.7567, radius: 0.3 },
            'VELLORE': { lat: 12.9165, lng: 79.1325, radius: 0.3 }
          };
          
          let detectedDistrict = null;
          
          // Find closest district
          for (const [district, coords] of Object.entries(districtMap)) {
            const distance = Math.sqrt(
              Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2)
            );
            
            if (distance <= coords.radius && districts.data.includes(district)) {
              detectedDistrict = district;
              break;
            }
          }
          
          // Fallback to first available district if in Tamil Nadu
          if (!detectedDistrict && districts.data.length > 0) {
            detectedDistrict = districts.data[0];
          }
          
          resolve(detectedDistrict);
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        if (error.code === 1) {
          reject(new Error('Location access denied'));
        } else if (error.code === 2) {
          reject(new Error('Location unavailable'));
        } else {
          reject(new Error('Location timeout'));
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  });
};