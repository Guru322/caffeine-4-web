import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import WebsiteForm from './components/WebsiteForm';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import WebsiteDetails from './components/WebsiteDetails';
import NotificationSettings from './components/NotificationSettings';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route path="/login" component={LandingPage} />
              
              <Route path={["/dashboard", "/add-website", "/website/:websiteId", "/settings/notifications"]}>
                <Navbar />
                <ProtectedRoute path="/dashboard" component={Dashboard} />
                <ProtectedRoute path="/add-website" component={WebsiteForm} />
                <ProtectedRoute path="/website/:websiteId" component={WebsiteDetails} />
                <ProtectedRoute path="/settings/notifications" component={NotificationSettings} />
              </Route>
            </Switch>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;