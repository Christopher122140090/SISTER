import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import ThermometerIcon from '../../components/icons/ThermometerIcon';
import HumidityIcon from '../../components/icons/HumidityIcon';
import LightIntensityIcon from '../../components/icons/LightIntensityIcon';
import RainIcon from '../../components/icons/RainIcon';

const SensorStatus = () => {
  const [sensorData, setSensorData] = useState({});
  const [deviceTemp, setDeviceTemp] = useState(null);

  useEffect(() => {
    const sensorRef = ref(db, 'sensor');
    onValue(sensorRef, snapshot => setSensorData(snapshot.val()));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Fetch current temperature from Open-Meteo API
          const response = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current_weather=true"
          );
          const data = await response.json();
          if (data && data.current_weather && typeof data.current_weather.temperature === 'number') {
            setDeviceTemp(Math.round(data.current_weather.temperature));
          } else {
            setDeviceTemp(null);
          }
        } catch (error) {
          console.error('Error fetching Open-Meteo data:', error);
          setDeviceTemp(null);
        }
      });
    }
  }, []);

  return (
    <div className="sensor-dashboard">
      <div className="sensor-card">
        <div className="sensor-header">
          <ThermometerIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Indoor temperature</p>
            <p className="sensor-value">{sensorData.temperature ?? '--'}°C</p>
          </div>
        </div>
      </div>
      <div className="sensor-card">
        <div className="sensor-header">
          <ThermometerIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Device temperature</p>
            <p className="sensor-value">{deviceTemp !== null ? deviceTemp + '°C' : '--'}</p>
          </div>
        </div>
      </div>
      <div className="sensor-card">
        <div className="sensor-header">
          <HumidityIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Humidity</p>
            <p className="sensor-value">{sensorData.humidity ?? '--'}%</p>
          </div>
        </div>
      </div>
      <div className="sensor-card">
        <div className="sensor-header">
          <LightIntensityIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Light Intensity</p>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorData.light ?? 0}
              readOnly
              className="light-slider"
            />
            <p className="sensor-value">{sensorData.light ?? '--'}%</p>
          </div>
        </div>
      </div>
      <div className="sensor-card">
        <div className="sensor-header">
          <RainIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Rain Status</p>
            <p className="sensor-value">{sensorData.rain_digital === 1 ? 'Hujan' : 'Tidak Hujan'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorStatus;
