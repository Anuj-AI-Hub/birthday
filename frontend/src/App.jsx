import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [page, setPage] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  async function loginAdmin(event) {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      setPage('home');
      setMessage('Admin login successful.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function submitPrediction(event) {
    event.preventDefault();
    setMessage('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Prediction failed');
      setResult(data);
      setMessage('Prediction complete.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadSubmissions() {
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/admin/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to load submissions');
      setSubmissions(data);
      setMessage('Loaded admin submission history.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    setToken('');
    setPage('login');
    setResult(null);
    setSubmissions([]);
    setMessage('Logged out successfully.');
  }

  if (page === 'login') {
    return (
      <div className="page-container">
        <div className="card">
          <h1>Email Spam Prediction</h1>
          <p>Admin login to view submission history, or use the prediction form directly.</p>
          <form onSubmit={loginAdmin}>
            <label>Admin username</label>
            <input value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} />
            <label>Admin password</label>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            <button type="submit">Login as Admin</button>
          </form>
          <button className="link-button" onClick={() => setPage('home')}>Continue without admin</button>
          {message && <div className="message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card wide-card">
        <header className="header-row">
          <h1>Email Spam Prediction</h1>
          <div>
            {token ? <button onClick={() => { setPage('admin'); loadSubmissions(); }}>Admin panel</button> : null}
            <button onClick={logout}>{token ? 'Logout' : 'Return to login'}</button>
          </div>
        </header>

        {page === 'home' && (
          <>
            <form onSubmit={submitPrediction}>
              <label>Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" />
              <label>Message body</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter email body" rows="6" />
              <button type="submit">Predict Spam</button>
            </form>

            {result && (
              <div className="result-card">
                <h2>Prediction result</h2>
                <p><strong>Status:</strong> {result.prediction.toUpperCase()}</p>
                <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%</p>
              </div>
            )}
          </>
        )}

        {page === 'admin' && (
          <>
            <div className="admin-panel">
              <h2>Admin submission history</h2>
              <button onClick={loadSubmissions}>Refresh history</button>
              <div className="submissions-list">
                {submissions.length === 0 ? (
                  <p>No submission history yet.</p>
                ) : (
                  submissions.map((item) => (
                    <div key={item.id} className="submission-item">
                      <div>
                        <strong>{item.prediction.toUpperCase()}</strong> · {item.confidence * 100}% · {new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div><strong>Subject:</strong> {item.subject || '(no subject)'}</div>
                      <div><strong>Body:</strong> {item.body || '(no body)'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default App;
