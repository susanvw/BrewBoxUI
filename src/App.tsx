import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CreateOrder from './components/CreateOrder';
import OrderList from './components/OrderList';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Statement from './components/Statement';
import Profile from './components/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout><OrderList /></Layout>} />
          <Route path="/orders" element={<Layout><OrderList /></Layout>} />
          <Route path="/create-order" element={<Layout><CreateOrder /></Layout>} />
          <Route path="/statement" element={<Layout><Statement /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;