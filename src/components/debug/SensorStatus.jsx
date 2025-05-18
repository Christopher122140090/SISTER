import React, { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase';
import ThermometerIcon from '../../components/icons/ThermometerIcon';
import HumidityIcon from '../../components/icons/HumidityIcon';
import LightIntensityIcon from '../../components/icons/LightIntensityIcon';
import RainIcon from '../../components/icons/RainIcon';
import CurtainIcon from '../../components/icons/CurtainIcon';
import WindowIcon from '../../components/icons/WindowIcon';

const SensorStatus = () => {
  const [sensorData, setSensorData] = useState({});
  const [deviceTemp, setDeviceTemp] = useState(null);
  const [curtainStatus, setCurtainStatus] = useState(null);
  const [windowStatus, setWindowStatus] = useState(null);

  // For animation and sparkline data history
  const [tempHistory, setTempHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [lightHistory, setLightHistory] = useState([]);
  const [rainHistory, setRainHistory] = useState([]);

  const prevDeviceTempRef = useRef(null);
  const prevIndoorTempRef = useRef(null);

  useEffect(() => {
    const sensorRef = ref(db, 'sensor');
    onValue(sensorRef, snapshot => {
      const data = snapshot.val() || {};
      setSensorData(data);

      // Update history arrays for sparklines
      setTempHistory(prev => [...prev.slice(-19), data.temperature ?? 0]);
      setHumidityHistory(prev => [...prev.slice(-19), data.humidity ?? 0]);
      setLightHistory(prev => [...prev.slice(-19), data.light ?? 0]);
      setRainHistory(prev => [...prev.slice(-19), data.rain_digital ?? 0]);

      // Update curtain and window status from boolean sensor data
      if (data.curtain_status !== undefined) {
        setCurtainStatus(data.curtain_status ? 'Terbuka' : 'Tertutup');
        console.log('Curtain status from Firebase (sensor):', data.curtain_status);
      }
      if (data.window_status !== undefined) {
        setWindowStatus(data.window_status ? 'Terbuka' : 'Tertutup');
        console.log('Window status from Firebase (sensor):', data.window_status);
      }
    });

    // Remove old listeners on commands/curtain and commands/window
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
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

  // Helper to create sparkline SVG path from data array
  const createSparklinePath = (data, width = 100, height = 20) => {
    if (!data.length) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const len = data.length;
    const step = width / (len - 1);
    const scaleY = max === min ? 1 : height / (max - min);
    let path = 'M0 ' + (height - (data[0] - min) * scaleY);
    for (let i = 1; i < len; i++) {
      const x = i * step;
      const y = height - (data[i] - min) * scaleY;
      path += ' L' + x + ' ' + y;
    }
    return path;
  };

  // Determine status color for rain (green if no rain, red if rain)
  const rainStatusColor = sensorData.rain_digital === 1 ? '#ff4d6d' : '#4caf50';

  // Convert light intensity percentage to lux (assuming 0-100% maps to 0-1000 lux)
  const lightLux = sensorData.light !== undefined ? Math.round((sensorData.light / 100) * 1000) : '--';

  return (
    <div className="sensor-dashboard">
      <h1 className="heading1">Dashboard Sensor</h1>
      <h2 className="heading2">Status Lingkungan dan Perangkat</h2>

      {/* Indoor Temperature */}
      <div className="sensor-card bg-temp">
        <div className="sensor-header">
          <ThermometerIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Indoor temperature</p>
            <p className={'sensor-value ' + (prevIndoorTempRef.current !== sensorData.temperature ? 'animate-change' : '')}>
              {sensorData.temperature ?? '--'}°C
            </p>
            <svg className="sparkline" width="100" height="20" aria-hidden="true">
              <path d={createSparklinePath(tempHistory)} stroke="#ff4d6d" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Device Temperature */}
      <div className="sensor-card bg-device-temp">
        <div className="sensor-header">
          <ThermometerIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Device temperature</p>
            <p className={'sensor-value ' + (prevDeviceTempRef.current !== deviceTemp ? 'animate-change' : '')}>
              {deviceTemp !== null ? deviceTemp + '°C' : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Humidity */}
      <div className="sensor-card bg-humidity">
        <div className="sensor-header">
          <HumidityIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Humidity</p>
            <p className="sensor-value">{sensorData.humidity ?? '--'}%</p>
            <svg className="sparkline" width="100" height="20" aria-hidden="true">
              <path d={createSparklinePath(humidityHistory)} stroke="#2196f3" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Light Intensity */}
      <div className="sensor-card bg-light">
        <div className="sensor-header">
          <LightIntensityIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Light Intensity (Lux)</p>
            <input
              type="range"
              min="0"
              max="100"
              value={sensorData.light ?? 0}
              readOnly
              className="light-slider"
            />
            <p className="sensor-value">{lightLux !== '--' ? lightLux + ' lux' : '--'}</p>
            <svg className="sparkline" width="100" height="20" aria-hidden="true">
              <path d={createSparklinePath(lightHistory)} stroke="#ff9800" fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Rain Status */}
      <div className="sensor-card bg-rain" style={{ borderColor: rainStatusColor }}>
        <div className="sensor-header">
          <RainIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Rain Status</p>
            <p className="sensor-value" style={{ color: rainStatusColor }}>
              {sensorData.rain_digital === 1 ? 'Hujan' : 'Tidak Hujan'}
            </p>
            <svg className="sparkline" width="100" height="20" aria-hidden="true">
              <path d={createSparklinePath(rainHistory)} stroke={rainStatusColor} fill="none" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Curtain Status */}
      <div className="sensor-card bg-curtain">
        <div className="sensor-header">
          <CurtainIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Curtain Status</p>
            <p className="sensor-value">
              {curtainStatus === null || curtainStatus === undefined
                ? '--'
                : curtainStatus === 1 || curtainStatus === 'open'
                ? 'Terbuka'
                : curtainStatus === 0 || curtainStatus === 'closed'
                ? 'Tertutup'
                : curtainStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Window Status */}
      <div className="sensor-card bg-window">
        <div className="sensor-header">
          <WindowIcon className="sensor-icon" />
          <div>
            <p className="sensor-label">Window Status</p>
            <p className="sensor-value">
              {windowStatus === null || windowStatus === undefined
                ? '--'
                : windowStatus === 1 || windowStatus === 'open'
                ? 'Terbuka'
                : windowStatus === 0 || windowStatus === 'closed'
                ? 'Tertutup'
                : windowStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorStatus;
