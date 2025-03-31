const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const monitoringService = require('./services/monitoringService');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

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
  
  monitoringService.startMonitoring();
});