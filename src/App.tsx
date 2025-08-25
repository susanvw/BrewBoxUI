import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login/Login';
import CreateOrder from './components/Orders/CreateOrder';
import OrderList from './components/Orders/OrderList';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register/Register';
import Statement from './components/Statement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/login'
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path='/register'
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path='/'
            element={
              <Layout>
                <OrderList />
              </Layout>
            }
          />
          <Route
            path='/orders'
            element={
              <Layout>
                <OrderList />
              </Layout>
            }
          />
          <Route
            path='/create-order'
            element={
              <Layout>
                <CreateOrder />
              </Layout>
            }
          />
          <Route
            path='/statement'
            element={
              <Layout>
                <Statement />
              </Layout>
            }
          />
          <Route
            path='/profile'
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Route>
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
