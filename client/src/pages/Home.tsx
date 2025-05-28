import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <nav className="nav-tabs">
        <Link to="/" className="nav-tab">Onboarding</Link>
      </nav>
      <div className="content">
        <h1>Welcome to Home Page</h1>
        <p>This is your main application page.</p>
      </div>
    </div>
  );
};

export default Home;
