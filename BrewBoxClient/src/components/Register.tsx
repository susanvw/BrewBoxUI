import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { ERole, type IRegisterRequest } from '../services/account.type';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ERole>(ERole.Customer);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      const request: IRegisterRequest = { email, password, role: role };
      const response = await register(request);

      if (response.success) {
        navigate('/login');
      } else {
        setError(response.errors?.join(',') ?? 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-container'>
      <h2>Register for BrewBox</h2>
      {error && <div className='error'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />
        </div>
        <div>
          <label htmlFor='role'>Role</label>
          <select
            id='role'
            value={role}
            onChange={(e) => setRole(e.target.value as ERole)}
          >
            <option value='Customer'>Customer</option>
            <option value='Barista'>Barista</option>
          </select>
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className='link-container'>
        <p>
          Already have an account? <a href='/login'>Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
