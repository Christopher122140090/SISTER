import React from 'react';
import './App.css';
import SmartHomeControl from './components/debug/SmartHomeControl';
import SensorStatus from './components/debug/SensorStatus';

function App() {
  return (
    <div className="App">
      <h1>Kontrol Rumah Pintar</h1>
      <SmartHomeControl />
      <SensorStatus />
    </div>
  );
}

export default App;
