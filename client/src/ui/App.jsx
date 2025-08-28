import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <Link to="/">Dashboard</Link>
        <Link to="/meals">Meals</Link>
        <Link to="/orders">Orders</Link>

        {!user ? (
          <>
            <Link style={{ marginLeft: 'auto' }} to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginLeft: 'auto', opacity: 0.85 }}>
              Signed in as <b>{user.name}</b> ({user.role})
            </span>
            <button
              onClick={() => logout().then(() => nav('/'))}
              style={{ padding: '6px 10px' }}
            >
              Logout
            </button>
          </>
        )}
      </header>

      <Outlet />
    </div>
  );
}