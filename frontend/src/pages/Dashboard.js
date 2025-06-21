import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import '../styles/selfcare.css';
import { useNavigate } from 'react-router-dom';
import PersonalizedQuest from '../components/PersonalizedQuest';

function Dashboard() {
  const [quest, setQuest] = useState(null);
  const [reflection, setReflection] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [sparkPoints, setSparkPoints] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [mood, setMood] = useState('');
  const [emotionalNeeds, setEmotionalNeeds] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [q, r, p, rwds] = await Promise.all([
        API.get('/quests/personalized?frequency=daily'),
        API.get('/reflections/me'),
        API.get('/points/me'),
        API.get('/rewards')
      ]);
      setQuest(q.data);
      setReflections(r.data);
      setSparkPoints(p.data.total_points);
      setRewards(rwds.data);
    } catch (err) {
      console.error('Error loading dashboard data', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quest || !quest.id) {
      alert('Please wait for a quest to load before submitting.');
      return;
    }

    let photoUrl = null;
    let audioUrl = null;

    try {
      if (photoFile) {
        const formData = new FormData();
        formData.append('file', photoFile);
        const res = await API.post('/upload/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = res.data.url;
      }

      if (audioFile) {
        const formData = new FormData();
        formData.append('file', audioFile);
        const res = await API.post('/upload/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        audioUrl = res.data.url;
      }

      await API.post('/reflections/submit', {
        quest_id: quest.id,
        reflection_text: reflection,
        photo_url: photoUrl,
        audio_url: audioUrl,
        mood,
        emotional_needs: emotionalNeeds
      });

      alert('Reflection submitted!');
      setReflection('');
      setPhotoFile(null);
      setAudioFile(null);
      setEmotionalNeeds([]);
      setMood('');
      fetchData();
    } catch (err) {
      alert('Submission failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reflection?')) return;
    try {
      await API.delete(`/reflections/${id}`);
      setReflections(reflections.filter((r) => r.id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleClaim = async (rewardId, title, cost) => {
    try {
      await API.post('/rewards/claim', { reward_id: rewardId });
      setSparkPoints(prev => prev + cost); // You can subtract if needed
      alert(`You claimed: ${title} (+${cost} pts)`);
    } catch (err) {
      alert('Claim failed: ' + (err.response?.data?.error || err.message));
    }
  };
console.log('🧠 quest:', quest);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🌟 Spark Points: {sparkPoints}</h2>
        <button
          onClick={handleLogout}
          className="button"
          style={{
            backgroundColor: '#ccc',
            color: '#444',
            padding: '0.4rem 1rem',
            borderRadius: '10px',
            fontWeight: 'normal',
            fontSize: '0.95rem'
          }}
        >
          Logout
        </button>
      </div>

      <PersonalizedQuest onQuestFetched={(q) => setQuest(q)} />

      <div className="section">
        <h3>📝 Submit Reflection</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            required
            rows={4}
            placeholder="Write your reflection..."
          />
          <label>Upload Photo:</label>
          <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} />
          <label>Upload Audio:</label>
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />

          <div style={{ margin: '1rem 0' }}>
            <label><strong>Your Mood:</strong></label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
              style={{ display: 'block', marginTop: '0.5rem', padding: '0.4rem', borderRadius: '8px', width: '100%' }}
            >
              <option value="">-- Select Mood --</option>
              <option value="Happy">Happy</option>
              <option value="Grateful">Grateful</option>
              <option value="Stressed">Stressed</option>
              <option value="Lonely">Lonely</option>
              <option value="Anxious">Anxious</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label><strong>Emotional Needs:</strong></label>
            <div style={{ marginTop: '0.5rem' }}>
              {['Connection', 'Support', 'Peace', 'Purpose', 'Validation'].map((need) => (
                <label key={need} style={{ marginRight: '1rem', display: 'inline-block' }}>
                  <input
                    type="checkbox"
                    value={need}
                    checked={emotionalNeeds.includes(need)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setEmotionalNeeds((prev) =>
                        checked ? [...prev, need] : prev.filter((n) => n !== need)
                      );
                    }}
                  />
                  {` ${need}`}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="button" disabled={!quest || !quest.id} >
            Submit
          </button>
        </form>
      </div>

      <div className="section">
        <h3>📚 Past Reflections</h3>
        {reflections.length === 0 ? (
          <p>No reflections yet.</p>
        ) : (
          reflections.map((r) => (
            <div key={r.id} className="card">
              <h4>{r.title}</h4>
              <p>{r.reflection_text}</p>
              {r.photo_url && <img src={r.photo_url} alt="Uploaded" style={{ maxWidth: '100%' }} />}
              {r.audio_url && <audio controls src={r.audio_url} style={{ width: '100%' }} />}
              <p><small>{new Date(r.completed_at).toLocaleString()}</small></p>
              <button
                className="button"
                style={{ background: 'crimson', marginTop: '0.5rem' }}
                onClick={() => handleDelete(r.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>🎁 Rewards</h3>
        {rewards.length === 0 ? (
          <p>No rewards available.</p>
        ) : (
          rewards.map((reward) => (
            <div key={reward.id} className="card">
              <h4>{reward.title} — {reward.cost} pts</h4>
              <p>{reward.description}</p>
              <button className="button" onClick={() => handleClaim(reward.id, reward.title, reward.cost)}>Claim</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
