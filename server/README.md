# Caffeine-4-Web Server

## Overview
This is the server component of the Caffeine-4-Web application, designed to monitor websites by periodically sending requests to ensure they remain "awake" and responsive. The server handles website monitoring, notifications, and data management.

## Features
- **Automated Website Monitoring**: Pings websites every 30 seconds to check availability
- **Status Tracking**: Records response times and status codes for each monitored site
- **Notification System**: Sends email alerts when websites go down or come back online
- **RESTful API**: Provides endpoints for website management and monitoring
- **Data Management**: Automatically cleans up old ping results
- **Firebase Integration**: Stores all monitoring data securely in Firestore

## Technology Stack
- Node.js
- Express.js
- Firebase Admin SDK
- Axios for HTTP requests
- Nodemailer for email notifications
- dotenv for environment variable management

## Installation

### Prerequisites
- Node.js (v14 or later)
- Firebase account with Firestore database
- Gmail account for sending notifications

### Setup
1. Clone the repository
```bash
git clone https://github.com/username/caffeine-4-web.git
cd caffeine-4-web/server
```

2. Install dependencies
```bash
npm install
```

3. Create a Firebase project and generate a service account key
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or select existing one)
   - Navigate to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `src/serviceAccountKey.json`

4. Configure environment variables
   - Create a `.env` file in the server directory
```
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-app-password
```

## Running the Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## API Endpoints

### Website Management
- `POST /api/websites` - Add a new website to monitor
- `GET /api/websites` - Get all monitored websites (optional userId query parameter)
- `DELETE /api/websites/:id` - Delete a website

### Monitoring
- `POST /api/websites/:id/ping` - Manually trigger a ping for a website
- `GET /api/websites/:id/ping-results` - Get ping history for a website

## Directory Structure
```
server/
├── src/
│   ├── app.js                    # Main application entry point
│   ├── serviceAccountKey.json    # Firebase service account credentials
│   ├── config/
│   │   └── firebase.js           # Firebase configuration
│   ├── controllers/
│   │   ├── pingController.js     # Ping-related API handlers
│   │   └── websiteController.js  # Website management API handlers
│   ├── routes/
│   │   └── api.js                # API route definitions
│   └── services/
│       ├── cleanupService.js     # Data cleanup functionality
│       ├── monitoringService.js  # Website monitoring functionality
│       └── notificationService.js # Email notification system
├── .env                          # Environment variables
├── package.json                  # Project dependencies and scripts
└── README.md                     # Project documentation
```

## Email Notifications
The application sends email notifications when:
- A monitored website goes down
- A previously down website comes back online

To enable email notifications:
1. Ensure your Gmail account has "Less secure app access" enabled or use an App Password
2. Update the EMAIL_USER and EMAIL_APP_PASSWORD in your .env file

## Data Management
Old ping results are automatically cleaned up daily to prevent database bloat. By default, ping results older than 30 days are removed.

## License
MIT
