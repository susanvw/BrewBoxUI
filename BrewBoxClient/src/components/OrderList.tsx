import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getActiveOrders,
  claimOrder,
  updateOrderStatus,
  updatePaymentStatus,
  logout,
  registerFcmToken,
  getCurrentOrders
} from '../services/api';
import { requestNotificationPermission, onMessageListener } from '../firebase';
import { EOrderStatus, type IOrder } from '../services/order.type';
import { toast } from 'react-toastify';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBarista, setIsBarista] = useState(false);

  useEffect(() => {
    // Request notification permission and register FCM token
    const initializeNotifications = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        try {
          registerFcmToken();
        } catch (err: any) {
          console.error('Failed to register FCM token:', err);
        }
      }
    };
    initializeNotifications();

    // Listen for foreground FCM messages
    onMessageListener()
      .then((payload: any) => {
        const { notification } = payload;
        toast.info(`${notification.title}: ${notification.body}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark'
        });
      })
      .catch((err) => console.error('Foreground notification error:', err));

    // Fetch orders and set up polling
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userRoles = localStorage.getItem('userRoles')?.split(',') || [
          'Customer'
        ];
        setIsBarista(userRoles.includes('Barista'));
        const newOrders = userRoles.includes('Barista')
          ? await getCurrentOrders()
          : await getActiveOrders();

          console.log(newOrders);

        // Check for new unclaimed orders (baristas) or status changes
        setOrders((prevOrders) => {
          if (isBarista) {
            const newUnclaimed = newOrders.filter(
              (newOrder) =>
                newOrder.status === EOrderStatus.Placed &&
                !prevOrders.some((prev) => prev.id === newOrder.id)
            );
            if (newUnclaimed.length > 0) {
              newUnclaimed.forEach((order) => {
                new Notification('New Unclaimed Order', {
                  body: `Order ID: ${order.id} is available for claiming.`,
                  icon: '/icon.png'
                });
              });
            }
          }

          // Check for status changes
          newOrders.forEach((newOrder) => {
            const prevOrder = prevOrders.find(
              (prev) => prev.id === newOrder.id
            );
            if (prevOrder && prevOrder.status !== newOrder.status) {
              new Notification('Order Status Updated', {
                body: `Order ID: ${newOrder.id} is now ${newOrder.status}.`,
                icon: '/icon.png'
              });
            }
          });

          return newOrders;
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 180000); // Poll every 3 minutes

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate, isBarista]);

  const handleClaimOrder = async (orderId: string) => {
    try {
      await claimOrder(orderId);
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: EOrderStatus.Claimed }
            : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to claim order');
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: IOrder['status']
  ) => {
    try {
      await updateOrderStatus(orderId, { status });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, { status: EOrderStatus.Ready });
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: EOrderStatus.Ready }
            : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    try {
      await updatePaymentStatus(orderId, { paid: true });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, paid: true } : order
        )
      );
    } catch (err: any) {
      setError(err.message || 'Failed to mark order as paid');
    }
  };

  return (
    <div className='register-container'>
      <h2>Orders</h2>
      {error && <div className='error'>{error}</div>}
      {loading ? (
        <p className='text-center text-vikinger-light'>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className='text-center text-vikinger-light'>No orders found.</p>
      ) : (
        <ul className='order-list'>
          {orders.map((order) => (
            <li key={order.id} className='order-list-item'>
              <div className='order-details'>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Pickup Time:</strong>{' '}
                  {new Date(order.pickupTime).toLocaleString()}
                </p>
                <p>
                  <strong>Total Price:</strong> {order.totalPrice.toFixed(2)}
                </p>
                {order.tip && (
                  <p>
                    <strong>Tip:</strong> ${order.tip.toFixed(2)}
                  </p>
                )}
                <p>
                  <strong>Paid:</strong> {order.paid ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Customer:</strong> {order.customer || 'N/A'}
                </p>
                {order.barista && (
                  <p>
                    <strong>Barista:</strong> {order.barista}
                  </p>
                )}
                <p>
                  <strong>Drinks:</strong>
                </p>
                <ul>
                  {order.drinks.map((drink) => (
                    <li key={drink.id}>
                      {drink.type} ({drink.size}) - {drink.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='order-actions'>
                {isBarista && order.status === EOrderStatus.Placed && (
                  <>
                    <button onClick={() => handleClaimOrder(order.id)}>
                      Claim
                    </button>
                    <button onClick={() => handleCancelOrder(order.id)}>
                      Cancel
                    </button>
                  </>
                )}
                {isBarista && order.status === EOrderStatus.Claimed && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, EOrderStatus.InProgress)
                      }
                    >
                      In Progress
                    </button>
                    <button onClick={() => handleCancelOrder(order.id)}>
                      Cancel
                    </button>
                  </>
                )}
                {isBarista && order.status === EOrderStatus.InProgress && (
                  <>
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, EOrderStatus.Ready)
                      }
                    >
                      Ready for Collection
                    </button>
                    <button onClick={() => handleCancelOrder(order.id)}>
                      Cancel
                    </button>
                  </>
                )}
                {isBarista &&
                  order.status ===
                    EOrderStatus.Ready && (
                      <button onClick={() => handleMarkPaid(order.id)}>
                        Mark Paid
                      </button>
                    )}
                {!isBarista && order.status === EOrderStatus.Ready && (
                  <button
                    onClick={() =>
                      handleUpdateStatus(order.id, EOrderStatus.Collected)
                    }
                  >
                    Mark Collected
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='link-container'>
        <button onClick={() => navigate('/create-order')}>Create Order</button>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default OrderList;
