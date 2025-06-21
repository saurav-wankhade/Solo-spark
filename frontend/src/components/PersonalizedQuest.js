import React, { useEffect, useState } from 'react';
import API from '../api/axios';

function PersonalizedQuest({ onQuestFetched }) {
  const [quest, setQuest] = useState(null);
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchQuest = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.get(`/quests/personalized?frequency=${frequency}`);
      const fetchedQuest = res.data;

      // ✅ Abort if no quest or invalid response
      if (!fetchedQuest || typeof fetchedQuest.id === 'undefined') {
        console.warn('⚠️ No valid quest returned. Skipping assignment.');
        setQuest(null);
        setError('No matching quest found');
        setLoading(false);
        return;
      }

      setQuest(fetchedQuest);
      onQuestFetched(fetchedQuest);

      console.log('✅ Assigning quest:', fetchedQuest);

      await API.post('/user/assign-quest', {
        quest_id: fetchedQuest.id,
        frequency
      });
    } catch (err) {
      console.error('Fetch quest error:', err?.response?.data || err.message || err);
      setError(err?.response?.data?.error || 'Could not fetch quest');
      setQuest(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuest();
  }, [frequency]);

  return (
    <div className="section">
      <h3>🎯 Your Personalized {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Quest</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Select Frequency:</strong>{' '}</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '6px' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {loading && <p>Loading quest...</p>}
      {error && (
        <p style={{ color: 'red' }}>
          {error === 'No matching quest found'
            ? "You're all caught up today — no new quests match your profile!"
            : error}
        </p>
      )}
      {quest && (
        <div className="card">
          <h4>{quest.title}</h4>
          <p>{quest.description}</p>
          <p><strong>Tags:</strong> {quest.tags?.join(', ')}</p>
          <p><strong>Frequency:</strong> {quest.frequency}</p>
        </div>
      )}
    </div>
  );
}

export default PersonalizedQuest;
