import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Statement from './components/Statement';
import Profile from './components/Profile';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import OrderList from './components/Orders/OrderList';
import CreateOrder from './components/Orders/CreateOrder';

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