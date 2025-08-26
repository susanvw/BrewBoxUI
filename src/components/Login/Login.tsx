import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../services/api';
import Layout from '../Layout';
import { login } from './auth.service';
import type { LoginRequest } from './auth.type';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
      });
    }
  }, [error]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Password length validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const request: LoginRequest = { email, password };
      console.log('Login request:', request); // Debug payload
      const response = await login(request);

      if (!response.success || !response.result) {
        setError(response.errors?.join(', ') ?? 'Could not authenticate user.');
        setLoading(false);
        return;
      }

      if (isAuthenticated()) {
        toast.success('Login successful!', {
          position: 'top-right',
          theme: 'dark'
        });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className='login-container'>
        <h4>Login to Your Account</h4>
        {error && <div className='error'>{error}</div>}
        <form onSubmit={handleLoginSubmit}>
          <div className='form-field'>
            <div className='input-wrapper'>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                required
              />
              <label htmlFor='email'>Email</label>
            </div>
          </div>
          <div className='form-field'>
            <div className='input-wrapper'>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
              />
              <label htmlFor='password'>Password</label>
            </div>
          </div>
          <div className='form-field'>
            <button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <span className='spinner' /> Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
        <div className='link-container'>
          <p>
            Don't have an account?{' '}
            <a href='/register' className='login-link'>
              Register
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
