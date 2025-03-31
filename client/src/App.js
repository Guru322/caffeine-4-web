import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WebsiteForm from './components/WebsiteForm';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/add-website" component={WebsiteForm} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;