import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TemperatureChart = ({ temperatureData }) => {
  const data = {
    labels: temperatureData.map(item => item.timestamp), // Timestamps as labels
    datasets: [
      {
        label: 'Suhu (°C)',
        data: temperatureData.map(item => item.value), // Suhu values
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Grafik Suhu
      </Typography>
      <Line data={data} />
    </Box>
  );
};

export default TemperatureChart;
