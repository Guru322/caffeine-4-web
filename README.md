# Caffeine 4 Web

<p align="center">
  <img src="https://github.com/user-attachments/assets/ac8af78e-31d6-458e-8c42-49cbb8e6846e" alt="Caffeine 4 Web" width="300"/>
</p>

## 📝 Overview

Caffeine 4 Web is a comprehensive website monitoring solution that keeps your websites "awake" by sending periodic requests. It's perfect for preventing free-tier hosted applications from going to sleep due to inactivity.

The application consists of a React frontend and Node.js backend, both working together to provide a seamless monitoring experience with real-time status updates and notifications.

## ✨ Features

### Core Features
- **Automated Website Monitoring**: Pings websites every 30 seconds to check availability
- **Real-time Dashboard**: Monitor all your websites in a single interface
- **Status Tracking**: Records response times and status codes for monitored sites
- **User Authentication**: Secure access with Firebase authentication
- **Responsive Design**: Works seamlessly on both desktop and mobile devices

### Advanced Features
- **Email Notifications**: Get alerts when websites go down or come back online
- **Custom Monitoring Intervals**: Configure how often each website is checked
- **Data Visualization**: View performance metrics and uptime statistics
- **Automatic Cleanup**: Old monitoring data is automatically removed to prevent database bloat

## 🛠️ Technology Stack

### Client
- React.js
- Material UI
- Firebase Authentication
- Axios for API requests

### Server
- Node.js
- Express.js
- Firebase Admin SDK
- Axios for HTTP requests
- Nodemailer for email notifications

## 📋 Prerequisites

- Node.js (v14 or later)
- npm
- Firebase account
- Gmail account (for notifications)

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/username/caffeine-4-web.git
cd caffeine-4-web
```

### 2. Set up the server

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create Firebase service account key
# Download from Firebase Console > Project Settings > Service Accounts
# Save as src/serviceAccountKey.json

# Create .env file
echo "PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password" > .env
```

### 3. Set up the client

```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install


## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Start the server (from server directory)
npm run dev

# In a new terminal, start the client (from client directory)
npm start
```

### Production Mode

```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```


## 📡 API Endpoints

### Website Management
- `POST /api/websites` - Add a new website to monitor
- `GET /api/websites` - Get all monitored websites
- `DELETE /api/websites/:id` - Delete a website

### Monitoring
- `POST /api/websites/:id/ping` - Manually trigger a ping
- `GET /api/websites/:id/ping-results` - Get ping history

## 📧 Email Notifications

The system can send email notifications when:
- A monitored website goes down
- A previously down website comes back online

To enable email notifications:
1. Ensure your Gmail account has "Less secure app access" enabled or use an App Password
2. Update the EMAIL_USER and EMAIL_APP_PASSWORD in your server's .env file

## 📈 Data Management

Old ping results are automatically cleaned up daily to prevent database bloat. By default, ping results older than 30 days are removed.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
