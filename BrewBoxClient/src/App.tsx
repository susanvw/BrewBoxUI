import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CreateOrder from './components/CreateOrder';
import ProtectedRoute from './ProtectedRoute';
import Orders from './components/OrderList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register onRegister={function (email: string, password: string, mfaType: 'google' | 'apple' | null, mfaToken: string): Promise<void> {
          throw new Error('Function not implemented.');
        } } error={null} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Orders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/create-order" element={<CreateOrder token={null} />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;