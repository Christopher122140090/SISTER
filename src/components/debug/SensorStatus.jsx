import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/firebase'; // Impor db dari firebase.js

const SensorStatus = () => {
  const [sensorData, setSensorData] = useState({});

  useEffect(() => {
    const sensorRef = ref(db, 'sensor');
    onValue(sensorRef, snapshot => setSensorData(snapshot.val()));
  }, []);

  return (
    <div>
      <h2>Status Sensor</h2>
      <p>Suhu: {sensorData.temperature} °C</p>
      <p>Kelembaban: {sensorData.humidity} %</p>
      <p>Cahaya: {sensorData.light} Lux</p>
      <p>Rain Status: {sensorData.rain_digital === 1 ? 'Hujan' : 'Tidak Hujan'}</p>
    </div>
  );
};

export default SensorStatus;
