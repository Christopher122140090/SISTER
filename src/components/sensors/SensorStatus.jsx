import React from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import GrainIcon from '@mui/icons-material/Grain';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';

const iconMap = {
  'Indoor Temperature': <ThermostatIcon color="error" sx={{ fontSize: 32, mr: 1 }} />,
  'Humidity': <OpacityIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />,
  'Rain Status': <GrainIcon color="success" sx={{ fontSize: 32, mr: 1 }} />,
  'Device Temperature': <DeviceThermostatIcon color="warning" sx={{ fontSize: 32, mr: 1 }} />,
};

const SensorStatus = ({ title, value, unit, color }) => {
  return (
    <Card
      sx={{
        border: `2px solid ${color || 'gray'}`,
        borderRadius: '16px',
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
          {iconMap[title]}
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" color="primary">
          {value ? `${value} ${unit}` : <CircularProgress />}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Rumah Pintar
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SensorStatus title="Indoor Temperature" value="27" unit="°C" color="red" />
        </Grid>
        <Grid item xs={12} md={4}>
          <SensorStatus title="Humidity" value="60" unit="%" color="blue" />
        </Grid>
        <Grid item xs={12} md={4}>
          <SensorStatus title="Rain Status" value="Tidak Hujan" unit="" color="green" />
        </Grid>
        <Grid item xs={12} md={4}>
          <SensorStatus title="Device Temperature" value="29" unit="°C" color="orange" />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
