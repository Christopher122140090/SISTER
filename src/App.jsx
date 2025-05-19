import React, { useState } from 'react';
import { Container, Box, CssBaseline, Typography, Button, Divider, Stack, Grid, Paper } from '@mui/material';
import SmartHomeStatus from './components/sensors/SmartHomeStatus';
import CustomModal from './components/common/Modal';
import HomeIcon from '@mui/icons-material/Home';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import SensorStatus from './components/sensors/SensorStatus';
import SmartHomeControl from './components/sensors/SmartHomeControl';
import SensorsIcon from '@mui/icons-material/Sensors';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';

function App() {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          color: 'text.primary',
          py: 4,
          px: 0,
        }}
      >
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
            <HomeIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h3" align="center" gutterBottom fontWeight={700} color="primary.main">
              Dashboard Rumah Pintar
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }}>
            <WbSunnyIcon color="warning" />
          </Divider>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 3, boxShadow: 3, borderRadius: 2, fontWeight: 600 }}
            onClick={handleOpenModal}
            startIcon={<DeviceHubIcon />}
          >
            Buka Modal Contoh
          </Button>
          <CustomModal
            open={openModal}
            onClose={handleCloseModal}
            title="Contoh Modal di Halaman Utama"
            actions={[
              { label: 'Tutup', onClick: handleCloseModal, color: 'secondary', variant: 'outlined' },
              { label: 'OK', onClick: handleCloseModal, color: 'primary', variant: 'contained' },
            ]}
          >
            Ini adalah modal berbasis Material UI (MUI) yang muncul di halaman utama.
          </CustomModal>
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(120deg, #e3ffe6 0%, #e3f2fd 100%)' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <SensorsIcon color="success" />
                  <Typography variant="h5" fontWeight={600} color="success.main">Status Sensor</Typography>
                </Stack>
                <SensorStatus />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(120deg, #fffde7 0%, #e3f2fd 100%)' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <SettingsRemoteIcon color="warning" />
                  <Typography variant="h5" fontWeight={600} color="warning.main">Kontrol Rumah</Typography>
                </Stack>
                <SmartHomeControl />
              </Paper>
            </Grid>
          </Grid>
          <SmartHomeStatus /> {/* Optional: bisa dihapus jika sudah tidak diperlukan */}
        </Container>
      </Box>
    </>
  );
}

export default App;

// Perindah tampilan SensorStatus dan SmartHomeControl dengan efek hover, shadow, dan ikon pada setiap status/kontrol
// Tidak perlu mengubah App.jsx lagi, cukup update komponen di bawah ini
