import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import type { CreateOrderRequest } from '../services/order.type';
import  type { ERole } from '../services/account.type';
import { EDrinkType } from '../services/drink.type';

const CreateOrder = () => {
  const [pickupTime, setPickupTime] = useState('');
  const [tip, setTip] = useState('');
  const [drinks, setDrinks] = useState<
    { type: string; size: string; price: string }[]
  >([{ type: '', size: 'Small', price: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is a customer
  useEffect(() => {
    const userRoles = localStorage.getItem('userRoles')?.split(',') ?? [];
    const isCustomer = userRoles.includes('Customer');
    if (!isCustomer) {
      setError('Only customers can create orders.');
      setTimeout(() => navigate('/orders'), 2000);
    }
  }, [navigate]);

  const handleAddDrink = () => {
    setDrinks([...drinks, { type: '', size: 'Small', price: '' }]);
  };

  const handleDrinkChange = (
    index: number,
    field: keyof (typeof drinks)[0],
    value: string
  ) => {
    const newDrinks = [...drinks];
    newDrinks[index][field] = value;
    setDrinks(newDrinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate pickup time
    const pickupDate = new Date(pickupTime);
    if (pickupDate <= new Date()) {
      setError('Pickup time must be in the future.');
      setLoading(false);
      return;
    }

    // Validate drinks
    for (const drink of drinks) {
      if (!EDrinkType.includes(drink.type)) {
        setError(`Invalid drink type. Choose from: ${EDrinkType.join(', ')}.`);
        setLoading(false);
        return;
      }
      if (!EDrinkSize.includes(drink.size)) {
        setError('Invalid drink size.');
        setLoading(false);
        return;
      }
      const price = parseFloat(drink.price);
      if (isNaN(price) || price <= 0) {
        setError('Drink price must be a positive number.');
        setLoading(false);
        return;
      }
    }

    // Validate tip
    const tipValue = tip ? parseFloat(tip) : undefined;
    if (tip && (isNaN(tipValue!) || tipValue! < 0)) {
      setError('Tip must be a non-negative number.');
      setLoading(false);
      return;
    }

    try {
      const request: CreateOrderRequest = {
        pickupTime: pickupDate.toISOString(),
        tip: tipValue,
        drinks: drinks.map((drink) => ({
          type: drink.type,
          size: drink.size,
          price: parseFloat(drink.price)
        }))
      };
      await createOrder(request);
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to create order.');
      if (err.message?.includes('401')) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-container'>
      <h2>Create Order</h2>
      {error && <div className='error'>{error}</div>}
      <form onSubmit={handleSubmit} className='create-order'>
        <div>
          <label htmlFor='pickupTime'>Pickup Time</label>
          <input
            id='pickupTime'
            type='datetime-local'
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor='tip'>Tip ($)</label>
          <input
            id='tip'
            type='number'
            step='0.01'
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            placeholder='Optional'
          />
        </div>
        <h3>Drinks</h3>
        {drinks.map((drink, index) => (
          <div key={index} className='drink-entry'>
            <div>
              <label htmlFor={`drink-type-${index}`}>Type</label>
              <select
                id={`drink-type-${index}`}
                value={drink.type}
                onChange={(e) =>
                  handleDrinkChange(index, 'type', e.target.value)
                }
                required
              >
                <option value=''>Select Type</option>
                {EDrinkType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`drink-size-${index}`}>Size</label>
              <select
                id={`drink-size-${index}`}
                value={drink.size}
                onChange={(e) =>
                  handleDrinkChange(index, 'size', e.target.value)
                }
              >
                {EDrinkSize.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`drink-price-${index}`}>Price ($)</label>
              <input
                id={`drink-price-${index}`}
                type='number'
                step='0.01'
                value={drink.price}
                onChange={(e) =>
                  handleDrinkChange(index, 'price', e.target.value)
                }
                required
              />
            </div>
          </div>
        ))}
        <button type='button' onClick={handleAddDrink} disabled={loading}>
          Add Drink
        </button>
        <button type='submit' disabled={loading}>
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>
      </form>
      <div className='link-container'>
        <p>
          <a href='/orders'>View Orders</a> | <a href='/'>Back to Home</a>
        </p>
      </div>
    </div>
  );
};

export default CreateOrder;
