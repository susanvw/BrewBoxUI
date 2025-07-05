import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getActiveOrders } from '../services/api';
import type { Order } from '../services/service.types';

interface OrderListProps {
  token: string | null;
}

const OrderList: React.FC<OrderListProps> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const [allOrders, active] = await Promise.all([
          getOrders(token),
          getActiveOrders(token),
        ]);
        setOrders(allOrders);
        setActiveOrders(active);
      } catch (err) {
        setError((err as Error).message);
        if ((err as Error).message.includes('401')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchOrders();
  }, [token, navigate]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="order-list">
      <h2>Your Orders</h2>
      <h3>Active Orders</h3>
      {activeOrders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        <ul>
          {activeOrders.map(order => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong> - Status: {order.status} - Total: ${order.totalPrice.toFixed(2)}
              <ul>
                {order.drinks.map(drink => (
                  <li key={drink.id}>{drink.type} ({drink.size}) - ${drink.price.toFixed(2)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <h3>All Orders</h3>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <strong>Order #{order.id}</strong> - Status: {order.status} - Total: ${order.totalPrice.toFixed(2)}
              <ul>
                {order.drinks.map(drink => (
                  <li key={drink.id}>{drink.type} ({drink.size}) - ${drink.price.toFixed(2)}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
      <p>
        <a href="/create-order">Create New Order</a> | <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default OrderList;