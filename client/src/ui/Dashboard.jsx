import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <p>Please log in or register.</p>;
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.role === 'beneficiary' && <p>Token Balance: {user.tokenBalance}</p>}
    </div>
  );
}