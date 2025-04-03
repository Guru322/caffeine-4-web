import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, ToggleButtonGroup, ToggleButton } from '@mui/material';
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
import { fetchResponseTimeData } from '../../services/api';

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

const ResponseTimeChart = ({ websiteId }) => {
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const getResponseTimeData = async () => {
      try {
        setLoading(true);
        const hours = timeRange === '24h' ? 24 : timeRange === '12h' ? 12 : 6;
        const data = await fetchResponseTimeData(websiteId, hours);
        setResponseTimeData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching response time data:', err);
        setError('Failed to load response time data');
        setLoading(false);
      }
    };

    getResponseTimeData();
  }, [websiteId, timeRange]);

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

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
    labels: responseTimeData?.labels || [],
    datasets: [
      {
        label: 'Response Time (ms)',
        data: responseTimeData?.values || [],
        fill: true,
        backgroundColor: 'rgba(187, 134, 252, 0.2)',
        borderColor: '#bb86fc',
        tension: 0.4,
        pointBackgroundColor: '#bb86fc',
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
        beginAtZero: true,
        title: {
          display: true,
          text: 'Response Time (ms)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Response Time History</Typography>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          size="small"
          aria-label="time range"
        >
          <ToggleButton value="6h" aria-label="6 hours">
            6h
          </ToggleButton>
          <ToggleButton value="12h" aria-label="12 hours">
            12h
          </ToggleButton>
          <ToggleButton value="24h" aria-label="24 hours">
            24h
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: 300, mt: 2 }}>
        <Line data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default ResponseTimeChart;