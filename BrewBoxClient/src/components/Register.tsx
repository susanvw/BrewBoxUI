import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  onRegister: (email: string, password: string, mfaType: 'google' | 'apple' | null, mfaToken: string) => Promise<void>;
  error: string | null;
}

const Register: React.FC<RegisterProps> = ({ onRegister, error }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [mfaType, setMfaType] = useState<'google' | 'apple' | null>(null);
  const [mfaToken, setMfaToken] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onRegister(email, password, mfaType, mfaToken);
      navigate('/login');
    } catch (err) {
      // Error handled via prop
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div className="error">{error}</div>}
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
          <label>MFA Provider:</label>
          <select
            value={mfaType || ''}
            onChange={(e) => setMfaType(e.target.value as 'google' | 'apple' | null)}
          >
            <option value="">None</option>
            <option value="google">Google</option>
            <option value="apple">Apple</option>
          </select>
        </div>
        {mfaType && (
          <div>
            <label>MFA Token:</label>
            <input
              type="text"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              placeholder={mfaType === 'apple' ? 'Enter mock_apple_<email>' : 'Enter Google token'}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Log in</a>
      </p>
      <p><a href="/">Back to Home</a></p>
    </div>
  );
};

export default Register;