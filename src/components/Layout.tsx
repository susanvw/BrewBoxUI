import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/api';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('userRoles');
  const isProtectedRoute = ['/', '/orders', '/create-order', '/statement', '/profile'].includes(location.pathname);

  if (!isLoggedIn || !isProtectedRoute) {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/orders':
        return 'Orders';
      case '/create-order':
        return 'Create Order';
      case '/statement':
        return 'Statement';
      case '/profile':
        return 'Profile';
      default:
        return 'Coffee Shop';
    }
  };

  return (
    <>
      <div className="title-bar">
        <h1>{getPageTitle()}</h1>
      </div>
      {children}
      <div className="tab-bar">
        <button
          className={`tab-button ${location.pathname === '/orders' || location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/orders')}
        >
          Orders
        </button>
        <button
          className={`tab-button ${location.pathname === '/statement' ? 'active' : ''}`}
          onClick={() => navigate('/statement')}
        >
          Statement
        </button>
        <button
          className="tab-button primary"
          onClick={() => navigate('/create-order')}
        >
          +
        </button>
        <button
          className={`tab-button ${location.pathname === '/profile' ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
        <button
          className="tab-button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Layout;