import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../../firebase/firebase'; // Impor db dari firebase.js

const SmartHomeControl = () => {
  const [curtainStatus, setCurtainStatus] = useState(null);
  const [windowStatus, setWindowStatus] = useState(null);

  useEffect(() => {
    const curtainRef = ref(db, 'commands/curtain');
    const windowRef = ref(db, 'commands/window');
    onValue(curtainRef, snapshot => setCurtainStatus(snapshot.val()));
    onValue(windowRef, snapshot => setWindowStatus(snapshot.val()));
  }, []);

  const toggleCurtain = () => {
    const newStatus = curtainStatus === 'Terbuka' ? 'Tertutup' : 'Terbuka';
    set(ref(db, 'commands/curtain'), newStatus); // Perbarui status gorden di Firebase
  };

  const toggleWindow = () => {
    const newStatus = windowStatus === 'Terbuka' ? 'Tertutup' : 'Terbuka';
    set(ref(db, 'commands/window'), newStatus); // Perbarui status jendela di Firebase
  };

  return (
    <div>
      <h2>Kontrol Perangkat</h2>
      <button onClick={toggleCurtain}>
        Gorden: {curtainStatus === 'Terbuka' ? 'Terbuka' : 'Tertutup'}
      </button>
      <button onClick={toggleWindow}>
        Jendela: {windowStatus === 'Terbuka' ? 'Terbuka' : 'Tertutup'}
      </button>
    </div>
  );
};

export default SmartHomeControl;
