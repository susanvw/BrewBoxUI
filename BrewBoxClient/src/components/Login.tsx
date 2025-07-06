import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaType, setMfaType] = useState<'None' | 'Google' | 'Apple'>('None');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password, mfaType, mfaToken });
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials or MFA token.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>MFA Type:</label>
          <select
            value={mfaType}
            onChange={(e) => setMfaType(e.target.value as 'None' | 'Google' | 'Apple')}
          >
            <option value="None">None</option>
            <option value="Google">Google</option>
            <option value="Apple">Apple</option>
          </select>
        </div>
        {mfaType !== 'None' && (
          <div>
            <label>MFA Token:</label>
            <input
              type="text"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;