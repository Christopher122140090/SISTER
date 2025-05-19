import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db, auth } from '../../firebase/firebase.js'; // Mengimpor db dan auth dari firebase.js
import { onAuthStateChanged } from "firebase/auth"; // Mengimpor fungsi autentikasi
import { Snackbar, Typography, Grid, Switch, Box, Card, CardContent, CardActions, Button } from '@mui/material'; // Menggunakan Material UI components

const SmartHomeStatus = () => {
  const [curtainStatus, setCurtainStatus] = useState(false);
  const [windowStatus, setWindowStatus] = useState(false);
  const [humidity, setHumidity] = useState(null);
  const [light, setLight] = useState(null);
  const [rainStatus, setRainStatus] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Menyimpan status autentikasi pengguna

  // Menggunakan useEffect untuk mendengarkan perubahan status autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // Pengguna terautentikasi
      } else {
        setIsAuthenticated(false); // Pengguna tidak terautentikasi
      }
    });
    return () => unsubscribe(); // Bersihkan listener saat komponen dibersihkan
  }, []);

  // Mengambil data dari Firebase jika pengguna terautentikasi
  useEffect(() => {
    if (!isAuthenticated) return; // Jangan lanjutkan jika pengguna tidak terautentikasi

    // Mengambil status tirai dari Firebase
    const curtainRef = ref(db, 'sensor/curtain_status');
    onValue(curtainRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setCurtainStatus(data); // Menyimpan status tirai ke state
      }
    });

    // Mengambil status jendela dari Firebase
    const windowRef = ref(db, 'sensor/window_status');
    onValue(windowRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setWindowStatus(data); // Menyimpan status jendela ke state
      }
    });

    // Mengambil kelembaban dari Firebase
    const humidityRef = ref(db, 'sensor/humidity');
    onValue(humidityRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setHumidity(data); // Menyimpan kelembaban ke state
      }
    });

    // Mengambil intensitas cahaya dari Firebase
    const lightRef = ref(db, 'sensor/light');
    onValue(lightRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setLight(data); // Menyimpan cahaya ke state
      }
    });

    // Mengambil status hujan dari Firebase
    const rainRef = ref(db, 'sensor/rain_digital');
    onValue(rainRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setRainStatus(data === 1 ? 'Hujan' : 'Tidak Hujan'); // Menyimpan status hujan ke state
      }
    });

    // Mengambil suhu dari Firebase
    const temperatureRef = ref(db, 'sensor/temperature');
    onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setTemperature(data); // Menyimpan suhu ke state
      }
    });
  }, [isAuthenticated]); // Efek berjalan hanya jika status autentikasi berubah

  // Fungsi untuk mengubah status tirai dan menyimpannya di Firebase
  const toggleCurtain = () => {
    const newCurtainStatus = !curtainStatus;
    setCurtainStatus(newCurtainStatus); // Mengupdate state tirai
    const curtainRef = ref(db, 'sensor/curtain_status');
    set(curtainRef, newCurtainStatus); // Mengupdate status tirai di Firebase
    setOpenSnackbar(true); // Menampilkan Snackbar
  };

  // Fungsi untuk mengubah status jendela dan menyimpannya di Firebase
  const toggleWindow = () => {
    const newWindowStatus = !windowStatus;
    setWindowStatus(newWindowStatus); // Mengupdate state jendela
    const windowRef = ref(db, 'sensor/window_status');
    set(windowRef, newWindowStatus); // Mengupdate status jendela di Firebase
    setOpenSnackbar(true); // Menampilkan Snackbar
  };

  // Fungsi untuk menutup Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Status Perangkat Rumah Pintar
      </Typography>
      <Grid container spacing={3}>
        {/* Card for Temperature, Humidity, Light, Rain Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Suhu: {temperature}°C</Typography>
              <Typography variant="body2">Kelembaban: {humidity}%</Typography>
              <Typography variant="body2">Cahaya: {light} lux</Typography>
              <Typography variant="body2">Status Hujan: {rainStatus}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card for Curtain and Window control */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tirai: {curtainStatus ? 'Tertutup' : 'Terbuka'}</Typography>
              <Switch checked={curtainStatus} onChange={toggleCurtain} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Jendela: {windowStatus ? 'Tertutup' : 'Terbuka'}</Typography>
              <Switch checked={windowStatus} onChange={toggleWindow} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message="Data berhasil diperbarui!"
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default SmartHomeStatus;
