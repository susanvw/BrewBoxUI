import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import { type CreateOrderRequest } from '../services/order.type';
import { EDrinkType, EDrinkSize } from '../services/drink.type';
import { toast } from 'react-toastify';

const CreateOrder = () => {
  const [pickupTime, setPickupTime] = useState('');
  const [tip, setTip] = useState('');
  const [drinks, setDrinks] = useState<
    { type: string; size: string; price: string }[]
  >([{ type: '', size: 'Small', price: '' }]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const navigate = useNavigate();

  // Convert enums to arrays
  const drinkTypes = Object.values(EDrinkType);
  const drinkSizes = Object.values(EDrinkSize);

  // Check if user is a customer
  useEffect(() => {
    const userRoles = localStorage.getItem('userRoles')?.split(',') ?? [];
    const isCustomer = userRoles.includes('Customer');
    if (!isCustomer) {
      setError('Only customers can create orders.');
      toast.error('Only customers can create orders.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'dark',
      });
      setTimeout(() => navigate('/orders'), 2000);
    }
  }, [navigate]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    }
  }, [error]);

  const handleAddDrink = () => {
    if (!isOrderCreated) {
      setDrinks([...drinks, { type: '', size: 'Small', price: '' }]);
    }
  };

  const handleRemoveDrink = (index: number) => {
    if (drinks.length > 1 && !isOrderCreated) {
      setDrinks(drinks.filter((_, i) => i !== index));
    }
  };

  const handleDrinkChange = (
    index: number,
    field: keyof (typeof drinks)[0],
    value: string
  ) => {
    if (!isOrderCreated) {
      const newDrinks = [...drinks];
      newDrinks[index][field] = value;
      setDrinks(newDrinks);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
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
      if (!drinkTypes.includes(drink.type as EDrinkType)) {
        setError(`Invalid drink type. Choose from: ${drinkTypes.join(', ')}.`);
        setLoading(false);
        return;
      }
      if (!drinkSizes.includes(drink.size as EDrinkSize)) {
        setError(`Invalid drink size. Choose from: ${drinkSizes.join(', ')}.`);
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
          price: parseFloat(drink.price),
        })),
      };
      const response = await createOrder(request);
      console.log(response.id);
      setIsOrderCreated(true);
      toast.success('Order created successfully.', {
        position: 'top-right',
        autoClose: 5000,
        theme: 'dark',
      });
      navigate('/orders');
    } catch (err: any) {
      const message = err.message || 'Failed to create order.';
      setError(message);
      if (err.message?.includes('401')) {
        localStorage.removeItem('jwtToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleCreateOrder}>
        <div className="drink-card">
          <div className="form-field">
            <label htmlFor="pickupTime">Pickup Time</label>
            <input
              id="pickupTime"
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              placeholder="Select pickup time"
              aria-label="Pickup time"
              required
              disabled={isOrderCreated}
            />
          </div>
          <div className="form-field">
            <label htmlFor="tip">Tip (optional)</label>
            <input
              id="tip"
              type="number"
              step="0.01"
              value={tip}
              onChange={(e) => setTip(e.target.value)}
              placeholder="Tip amount"
              aria-label="Tip amount"
              disabled={isOrderCreated}
            />
          </div>
        </div>
        {drinks.map((drink, index) => (
          <div key={index} className="drink-card">
            <div className="form-field">
              <label htmlFor={`drink-type-${index}`}>Drink Type</label>
              <select
                id={`drink-type-${index}`}
                value={drink.type}
                onChange={(e) => handleDrinkChange(index, 'type', e.target.value)}
                aria-label={`Drink type for drink ${index + 1}`}
                required
                disabled={isOrderCreated}
              >
                <option value="">Select Type</option>
                {drinkTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor={`drink-size-${index}`}>Size</label>
              <select
                id={`drink-size-${index}`}
                value={drink.size}
                onChange={(e) => handleDrinkChange(index, 'size', e.target.value)}
                aria-label={`Drink size for drink ${index + 1}`}
                disabled={isOrderCreated}
              >
                {drinkSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor={`drink-price-${index}`}>Price</label>
              <input
                id={`drink-price-${index}`}
                type="number"
                step="0.01"
                value={drink.price}
                onChange={(e) => handleDrinkChange(index, 'price', e.target.value)}
                placeholder="Price"
                aria-label={`Price for drink ${index + 1}`}
                required
                disabled={isOrderCreated}
              />
            </div>
            <div className="drink-card-actions">
              <button
                type="button"
                className="icon-button"
                onClick={() => handleRemoveDrink(index)}
                disabled={drinks.length <= 1 || isOrderCreated}
                aria-label={`Remove drink ${index + 1}`}
              >
                −
              </button>
            </div>
          </div>
        ))}
        <div className="drink-card-actions">
          <button
            type="button"
            className="icon-button"
            onClick={handleAddDrink}
            disabled={loading || isOrderCreated}
            aria-label="Add another drink"
          >
            +
          </button>
        </div>
        <div className="form-field">
          <button
            type="submit"
            disabled={loading || isOrderCreated}
            aria-label="Create order"
          >
            {loading ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;