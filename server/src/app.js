const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const monitoringService = require('./services/monitoringService');
const { cleanupOldPingResults } = require('./services/cleanupService');
const { configureMailTransport } = require('./services/notificationService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

const clientBuildPath = path.join(__dirname, '../../client/build');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  configureMailTransport();
  
  monitoringService.startMonitoring();
  
  const runDailyCleanup = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); 
    
    const delay = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      cleanupOldPingResults(30); 
      runDailyCleanup(); 
    }, delay);
  };
  
  runDailyCleanup();
});