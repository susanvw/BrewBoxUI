import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, logout } from '../services/api';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
        logout();
        navigate('/login');
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div>
      <h2>Orders</h2>
      <button onClick={() => navigate('/create-order')}>Create Order</button>
      <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.id} - {order.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;