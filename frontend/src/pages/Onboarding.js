import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../styles/selfcare.css';

function Onboarding() {
  const [step, setStep] = useState(1);
  const [traits, setTraits] = useState([]);
  const [moods, setMoods] = useState([]);
  const [needs, setNeeds] = useState([]);
  const navigate = useNavigate();

  const traitOptions = ['Introverted', 'Optimistic', 'Creative', 'Empathetic', 'Reflective', 'Logical'];
  const moodOptions = ['Calm', 'Anxious', 'Grateful', 'Lonely', 'Energetic', 'Neutral'];
  const needOptions = ['Peace', 'Support', 'Validation', 'Purpose', 'Connection', 'Growth'];

  const toggle = (value, list, setter) => {
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };

  const handleSubmit = async () => {
    try {
      await API.patch('/users/me/profile', {
        personality_traits: traits,
        default_moods: moods,
        preferred_needs: needs
      });
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save profile: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '3rem' }}>
      <h2 style={{ textAlign: 'center' }}>🧭 Welcome to Solo Sparks</h2>
      <p style={{ textAlign: 'center' }}>Let us understand you better through a few quick steps.</p>

      {step === 1 && (
        <>
          <h3>Step 1: Your Personality Traits</h3>
          <p>Select up to 3 traits:</p>
          <div className="multi-select">
            {traitOptions.map(trait => (
              <button
                key={trait}
                className={traits.includes(trait) ? 'selected' : ''}
                onClick={() => toggle(trait, traits, setTraits)}
              >
                {trait}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Step 2: Common Mood States</h3>
          <p>Which moods describe your usual states?</p>
          <div className="multi-select">
            {moodOptions.map(mood => (
              <button
                key={mood}
                className={moods.includes(mood) ? 'selected' : ''}
                onClick={() => toggle(mood, moods, setMoods)}
              >
                {mood}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Step 3: Preferred Emotional Needs</h3>
          <p>What do you value most emotionally?</p>
          <div className="multi-select">
            {needOptions.map(need => (
              <button
                key={need}
                className={needs.includes(need) ? 'selected' : ''}
                onClick={() => toggle(need, needs, setNeeds)}
              >
                {need}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        {step > 1 && <button className="button" onClick={() => setStep(step - 1)}>← Back</button>}
        {step < 3 && <button className="button" onClick={() => setStep(step + 1)}>Next →</button>}
        {step === 3 && <button className="button" onClick={handleSubmit}>Finish 🎉</button>}
      </div>
    </div>
  );
}

export default Onboarding;
