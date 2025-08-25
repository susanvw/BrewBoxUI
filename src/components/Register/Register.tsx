import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../Layout';
import { ERole, type IRegisterRequest } from './account.type';
import './Register.css';
import { register } from './register.service';

const Register = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Confirm password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Display name validation
    if (!displayName.trim()) {
      setError('Display name is required');
      setLoading(false);
      return;
    }

    try {
      const request: IRegisterRequest = {
        email,
        password,
        role: ERole.Customer,
        displayName
      };
      const response = await register(request);

      if (response.success) {
        toast.success('Registration successful! Please log in.', {
          position: 'top-right',
          theme: 'dark'
        });
        navigate('/login');
      } else {
        setError(response.errors?.join(', ') ?? 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className='register-container'>
        <h4>Create Your Account</h4>
        {error && <div className='error'>{error}</div>}
        <form onSubmit={handleSubmit}>
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
                id='displayName'
                type='text'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Display Name'
                required
              />
              <label htmlFor='displayName'>Display Name</label>
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
            <div className='input-wrapper'>
              <input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm Password'
                required
              />
              <label htmlFor='confirmPassword'>Confirm Password</label>
            </div>
          </div>
          <div className='form-field'>
            <button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <span className='spinner' /> Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
        <div className='link-container'>
          <p>
            Already have an account?{' '}
            <a href='/login' className='login-link'>
              Log in
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
