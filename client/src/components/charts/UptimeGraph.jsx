import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { fetchUptimeData } from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UptimeGraph = ({ websiteId }) => {
  const [uptimeData, setUptimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUptimeData = async () => {
      try {
        setLoading(true);
        const data = await fetchUptimeData(websiteId, 7); // Last 7 days
        setUptimeData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching uptime data:', err);
        setError('Failed to load uptime data');
        setLoading(false);
      }
    };

    getUptimeData();
  }, [websiteId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const chartData = {
    labels: uptimeData?.labels || [],
    datasets: [
      {
        label: 'Uptime (%)',
        data: uptimeData?.values || [],
        fill: true,
        backgroundColor: 'rgba(3, 218, 198, 0.2)',
        borderColor: '#03dac6',
        tension: 0.4,
        pointBackgroundColor: '#03dac6',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: Math.max(0, Math.min(...uptimeData?.values) - 5),
        max: 100,
        title: {
          display: true,
          text: 'Uptime Percentage'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 2, 
        backgroundColor: 'background.card',
        mb: 4
      }}
    >
      <Typography variant="h6" gutterBottom>
        7-Day Uptime History
      </Typography>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default UptimeGraph;