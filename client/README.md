# Caffeine-4-Web Client

## Overview
This is the client application for the Caffeine-4-Web project. It provides a user interface for monitoring websites and keeping them "awake" by sending periodic requests.

## Features
- Website monitoring dashboard
- Add/remove websites to monitor
- View monitoring statistics and status
- Configure monitoring intervals

## Installation

### Prerequisites
- Node.js and npm

### Setup
1. Clone the repository
```bash
git clone https://github.com/username/caffeine-4-web.git
cd caffeine-4-web/client
```

2. Install dependencies
```bash
npm install
```

### Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Register your app in the Firebase project
3. Copy the Firebase configuration object
4. Go to src/firebase.js and replace the firebase config with yours


## Building for Production
```bash
npm run build
```

## Technology Stack
- React.js
- CSS for styling
- Axios for API requests

## Project Structure
- `/src` - Source code
- `/public` - Static assets
- `/build` - Production build

## License
MIT
