# Website Monitor Server

This is the server-side component of the Website Monitor application. It is built using Node.js and Express, and it connects to a MongoDB database to store and manage website monitoring data.

## Project Structure

- **src/**: Contains the source code for the server.
  - **controllers/**: Contains the logic for handling requests related to websites and ping results.
    - `websiteController.js`: Handles requests for adding and retrieving website data.
    - `pingController.js`: Handles ping requests and processes the results.
  - **models/**: Defines the MongoDB schemas for the application.
    - `Website.js`: Schema for the website model, including URL and status.
    - `PingResult.js`: Schema for the ping result model, including website ID, timestamp, and response time.
  - **services/**: Contains background services for the application.
    - `monitoringService.js`: Implements the logic for pinging websites at regular intervals and storing results.
  - **routes/**: Sets up the API routes for the application.
    - `api.js`: Connects the controllers to the API endpoints.
  - **config/**: Contains configuration files.
    - `db.js`: Configuration for connecting to the MongoDB database.
  - `app.js`: Entry point for the Node.js/Express backend, setting up middleware and routes.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Guru322/caffeine-4-web
   ```
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Server

1. Start the MongoDB service.
2. Run the server:
   ```
   npm start
   ```

The server will start and listen for incoming requests.

### API Endpoints

- `POST /api/websites`: Add a new website to monitor.
- `GET /api/websites`: Retrieve a list of monitored websites.
- `GET /api/ping-results`: Retrieve ping results for monitored websites.

## License

This project is licensed under the MIT License. See the LICENSE file for details.