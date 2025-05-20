import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db, auth } from './firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth";
import { Snackbar, Typography, Grid, Switch, Box, Card } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const SmartHomeStatus = () => {
  const [curtainStatus, setCurtainStatus] = useState(false);
  const [windowStatus, setWindowStatus] = useState(false);
  const [light, setLight] = useState(null);
  const [rainStatus, setRainStatus] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [localTemperature, setLocalTemperature] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Menyimpan status autentikasi pengguna
  const [mode, setMode] = useState(true); // true: auto, false: manual

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

    // Listen mode from Firebase
    const modeRef = ref(db, 'sensor/mode');
    onValue(modeRef, (snapshot) => {
      const data = snapshot.val();
      if (typeof data === 'boolean') setMode(data);
    });
  }, [isAuthenticated]); // Efek berjalan hanya jika status autentikasi berubah

  // Ambil suhu lokal device via Meteo API dengan lokasi device
  useEffect(() => {
    let intervalId;
    function fetchLocalTemperatureByLocation(lat, lon) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(data => {
          if (data.current_weather && typeof data.current_weather.temperature === 'number') {
            setLocalTemperature(data.current_weather.temperature);
          } else {
            setLocalTemperature(null);
          }
        })
        .catch(() => setLocalTemperature(null));
    }
    function getLocationAndFetch() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchLocalTemperatureByLocation(lat, lon);
          },
          () => {
            // Jika gagal, fallback ke Jakarta
            fetchLocalTemperatureByLocation(-6.200000, 106.816666);
          },
          { timeout: 5000 }
        );
      } else {
        // Jika tidak support, fallback ke Jakarta
        fetchLocalTemperatureByLocation(-6.200000, 106.816666);
      }
    }
    getLocationAndFetch();
    intervalId = setInterval(getLocationAndFetch, 10000);
    return () => clearInterval(intervalId);
  }, []);

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

  // Fungsi untuk toggle mode
  const toggleMode = () => {
    const newMode = !mode;
    setMode(newMode);
    const modeRef = ref(db, 'sensor/mode');
    set(modeRef, newMode);
    setOpenSnackbar(true);
  };

  // Fungsi untuk menutup Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      mt: 2,
      borderRadius: 6,
      boxShadow: 10,
      bgcolor: 'rgba(255,255,255,0.85)',
      maxWidth: 900,
      mx: 'auto',
      backdropFilter: 'blur(8px)',
      border: '1.5px solid #e3f2fd',
    }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        letterSpacing={1}
        sx={{ mb: 3, color: 'primary.main', fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}
      >
        Status Perangkat Rumah Pintar
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Card sx={{ px: 4, py: 2, borderRadius: 4, boxShadow: 4, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.97)' }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', mr: 2 }}>
            Mode:
          </Typography>
          <Switch
            checked={mode}
            onChange={toggleMode}
            color="primary"
            inputProps={{ 'aria-label': 'toggle mode' }}
          />
          <Typography variant="body1" fontWeight={700} color={mode ? 'success.main' : 'warning.main'} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
            {mode ? 'Auto (IOT)' : 'Manual (User)'}
          </Typography>
        </Card>
      </Box>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {/* Suhu dari Firebase */}
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 2,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 12 },
            width: '100%',
            maxWidth: 250,
          }}>
            <SensorsIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Suhu</Typography>
            <Typography variant="h4" color="primary" fontWeight={700}>
              {temperature !== null ? `${temperature}°C` : '-'}
            </Typography>
          </Card>
        </Grid>
        {/* Suhu dari Device Lokal */}
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 2,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 12 },
            width: '100%',
            maxWidth: 250,
          }}>
            <SensorsIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Suhu Local</Typography>
            <Typography variant="h4" color="secondary" fontWeight={700}>
              {localTemperature !== null ? `${localTemperature}°C` : '-'}
            </Typography>
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 2,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 12 },
            width: '100%',
            maxWidth: 250,
          }}>
            <WbSunnyIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Cahaya</Typography>
            <Typography variant="h4" color="warning.main" fontWeight={700}>
              {light !== null ? `${light} lux` : '-'}
            </Typography>
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 3' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: 'rgba(255,255,255,0.95)',
            p: 2,
            minHeight: 180,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-4px) scale(1.03)', boxShadow: 12 },
            width: '100%',
            maxWidth: 250,
          }}>
            <SensorsIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Status Hujan</Typography>
            <Typography variant="h4" color={rainStatus === 'Hujan' ? 'error.main' : 'success.main'} fontWeight={700}>
              {rainStatus || '-'}
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mt: 2 }}>
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 8,
            bgcolor: 'rgba(255,255,255,0.98)',
            p: 3,
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px) scale(1.01)', boxShadow: 12 },
            width: '100%',
            maxWidth: 350,
          }}>
            <Box display="flex" alignItems="center">
              <SettingsRemoteIcon color="primary" sx={{ fontSize: 38, mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Tirai</Typography>
                <Typography variant="body1" color={curtainStatus ? 'success.main' : 'text.secondary'} fontWeight={600}>
                  {curtainStatus ? 'Tertutup' : 'Terbuka'}
                </Typography>
              </Box>
            </Box>
            <Switch checked={curtainStatus} onChange={toggleCurtain} color="primary" disabled={mode} />
          </Card>
        </Grid>
        <Grid sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{
            borderRadius: 4,
            boxShadow: 8,
            bgcolor: 'rgba(255,255,255,0.98)',
            p: 3,
            minHeight: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { transform: 'translateY(-2px) scale(1.01)', boxShadow: 12 },
            width: '100%',
            maxWidth: 350,
          }}>
            <Box display="flex" alignItems="center">
              <SettingsRemoteIcon color="secondary" sx={{ fontSize: 38, mr: 2 }} />
              <Box>
                <Typography variant="h6" fontWeight={600} sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>Jendela</Typography>
                <Typography variant="body1" color={windowStatus ? 'success.main' : 'text.secondary'} fontWeight={600}>
                  {windowStatus ? 'Tertutup' : 'Terbuka'}
                </Typography>
              </Box>
            </Box>
            <Switch checked={windowStatus} onChange={toggleWindow} color="secondary" disabled={mode} />
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        message="Data berhasil diperbarui!"
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{ sx: { fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 600 } }}
      />
    </Box>
  );
};

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
      <Box component="main" sx={{ width: '100%', maxWidth: 1200, p: { xs: 2, md: 4 }, pt: { xs: 2, md: 4 } }}>
        <Box sx={{ mt: 5 }}>
          <SmartHomeStatus />
        </Box>
      </Box>
    </Box>
  );
}
