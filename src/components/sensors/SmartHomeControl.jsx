import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Grid, Switch, Box } from '@mui/material';
import CurtainsIcon from '@mui/icons-material/Window';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import { ref, set } from "firebase/database";
import { db } from '../../firebase/firebase'; // Mengimpor db dari firebase.js

// Komponen kontrol untuk perangkat rumah pintar (misalnya, kontrol tirai)
const SmartHomeControl = ({ title, onToggle, status, icon }) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '2px solid #1976d2',
        boxShadow: 4,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.04)',
          boxShadow: 8,
        },
        mb: 2,
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Switch checked={status} onChange={onToggle} color="primary" />
      </CardContent>
    </Card>
  );
};

// Kontrol rumah pintar
const SmartHome = () => {
  const [curtainStatus, setCurtainStatus] = useState(false);
  const [windowStatus, setWindowStatus] = useState(true);

  const handleCurtainToggle = () => {
    // Mengupdate status tirai di Realtime Database
    setCurtainStatus(!curtainStatus);
    const curtainRef = ref(db, 'devices/curtainStatus'); // Menentukan referensi data
    set(curtainRef, { status: !curtainStatus }); // Menyimpan status ke Firebase
  };

  const handleWindowToggle = () => {
    // Mengupdate status jendela di Realtime Database
    setWindowStatus(!windowStatus);
    const windowRef = ref(db, 'devices/windowStatus'); // Menentukan referensi data
    set(windowRef, { status: !windowStatus }); // Menyimpan status ke Firebase
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Kontrol Rumah Pintar
      </Typography>
      <Grid container spacing={3}>
        <SmartHomeControl
          title="Curtain Control"
          status={curtainStatus}
          onToggle={handleCurtainToggle}
          icon={<CurtainsIcon color={curtainStatus ? 'primary' : 'disabled'} sx={{ fontSize: 32 }} />}
        />
        <SmartHomeControl
          title="Window Control"
          status={windowStatus}
          onToggle={handleWindowToggle}
          icon={<OpenInBrowserIcon color={windowStatus ? 'primary' : 'disabled'} sx={{ fontSize: 32 }} />}
        />
      </Grid>
    </div>
  );
};

export default SmartHome;
