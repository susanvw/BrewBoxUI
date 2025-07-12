import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isAuthenticated,
  login,
  verifyAppleMfa,
  verifyGoogleMfa
} from '../services/api';
import type { LoginRequest, MfaRequest } from '../services/auth.type';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaType, setMfaType] = useState<'None' | 'Google' | 'Apple'>('None');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.info(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      });
    }
  }, [error]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const request: LoginRequest = { email, password };
      const response = await login(request);

      if (!response.success || !response.result) {
        setError(response.errors?.join(', ') ?? 'Could not authenticate user.');
      }

      if (isAuthenticated()) {
        navigate('/');
      } else if (response.result?.requiresMfa) {
        setShowMfa(true);
      }
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!mfaToken) {
      setError('Please enter an MFA token');
      setLoading(false);
      return;
    }

    try {
      const request: MfaRequest = { token: mfaToken };
      if (mfaType === 'Google') {
        await verifyGoogleMfa(request);
      } else if (mfaType === 'Apple') {
        await verifyAppleMfa(request);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message ?? 'MFA verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <h2>Login</h2>
      {error && <div className='error'>{error}</div>}
      {!showMfa ? (
        <form onSubmit={handleLoginSubmit}>
          <div className='form-field'>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='form-field'>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
            />
          </div>
          <div className='form-field'>
            <select
              id='mfaType'
              value={mfaType}
              onChange={(e) =>
                setMfaType(e.target.value as 'None' | 'Google' | 'Apple')
              }
            >
              <option value='None'>None</option>
              <option value='Google'>Google</option>
              <option value='Apple'>Apple</option>
            </select>
          </div>
          <div className='form-field'>
            <button type='submit' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit}>
          <div className='form-field'>
            <input
              id='mfaToken'
              type='text'
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              placeholder={`Enter ${mfaType} token`}
              required
            />
          </div>
          <div className='form-field'>
            <button type='submit' disabled={loading}>
              {loading ? 'Verifying...' : 'Verify MFA'}
            </button>
          </div>
        </form>
      )}
      <div className='link-container'>
        <p>
          Don't have an account? <a href='/register'>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;