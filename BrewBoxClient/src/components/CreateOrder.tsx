import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import type { CreateOrderRequest } from '../services/service.types';

interface CreateOrderProps {
  token: string | null;
}

const CreateOrder: React.FC<CreateOrderProps> = ({ token }) => {
  const [pickupTime, setPickupTime] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [drinks, setDrinks] = useState<{ type: string; size: string; price: string }[]>([
    { type: '', size: 'Small', price: '' },
  ]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddDrink = () => {
    setDrinks([...drinks, { type: '', size: 'Small', price: '' }]);
  };

  const handleDrinkChange = (index: number, field: keyof typeof drinks[0], value: string) => {
    const newDrinks = [...drinks];
    newDrinks[index][field] = value;
    setDrinks(newDrinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const request: CreateOrderRequest = {
        pickupTime: new Date(pickupTime).toISOString(),
        tip: tip ? parseFloat(tip) : undefined,
        drinks: drinks.map(drink => ({
          type: drink.type,
          size: drink.size,
          price: parseFloat(drink.price),
        })),
      };
      await createOrder(request, token);
      navigate('/orders');
    } catch (err) {
      setError((err as Error).message);
      if ((err as Error).message.includes('401')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="create-order">
      <h2>Create Order</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pickup Time:</label>
          <input
            type="datetime-local"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tip ($):</label>
          <input
            type="number"
            step="0.01"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
          />
        </div>
        <h3>Drinks</h3>
        {drinks.map((drink, index) => (
          <div key={index} className="drink-entry">
            <label>Type:</label>
            <input
              type="text"
              value={drink.type}
              onChange={(e) => handleDrinkChange(index, 'type', e.target.value)}
              required
            />
            <label>Size:</label>
            <select
              value={drink.size}
              onChange={(e) => handleDrinkChange(index, 'size', e.target.value)}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
            <label>Price ($):</label>
            <input
              type="number"
              step="0.01"
              value={drink.price}
              onChange={(e) => handleDrinkChange(index, 'price', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddDrink}>Add Drink</button>
        <button type="submit">Create Order</button>
      </form>
      <p>
        <a href="/orders">View Orders</a> | <a href="/">Back to Home</a>
      </p>
    </div>
  );
};

export default CreateOrder;