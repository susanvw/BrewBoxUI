import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { login } from './services/api';
import OrderList from './components/OrderList';
import CreateOrder from './components/CreateOrder';
import './App.css';

interface HomeProps {
  token: string | null;
}

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = async (email: string, password: string) => {
    try {
      const newToken = await login({ email, password });
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Login failed:', (error as Error).message);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <h1>BrewBox Coffee</h1>
        <Routes>
          <Route path="/" element={<Home token={token} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/orders" element={<OrderList token={token} />} />
          <Route path="/create-order" element={<CreateOrder token={token} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const Home: React.FC<HomeProps> = ({ token }) => {
  return (
    <div>
      <h2>Welcome to BrewBox</h2>
      {token ? (
        <p>
          Logged in! <a href="/orders">View Orders</a> | <a href="/create-order">Create Order</a>
        </p>
      ) : (
        <p><a href="/login">Log in</a></p>
      )}
    </div>
  );
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
        <button type="submit">Login</button>
      </form>
      <p><a href="/">Back to Home</a></p>
    </div>
  );
};

export default App;