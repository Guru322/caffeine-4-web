import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import WebsiteForm from './components/WebsiteForm';
import Navbar from './components/Navbar';
import theme from './theme';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/add-website" component={WebsiteForm} />
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;