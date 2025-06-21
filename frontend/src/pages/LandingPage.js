import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/selfcare.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 style={{ color: '#6b4e71' }}>🌸 Welcome to Solo Sparks</h1>
      <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>
        Your personal growth quest system — reflect daily, earn Spark Points, and celebrate your progress with self-care rewards.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/login')}
          className="button"
          style={{ marginRight: '1rem', backgroundColor: '#b290d4' }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="button"
          style={{ backgroundColor: '#90d4c6' }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
