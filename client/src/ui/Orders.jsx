// Orders React Page
// Shows the list of pending orders for both beneficiaries and memebers
// Allows members to accept orders from the list of pending orders.

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [mealId, setMealId] = useState('');

  const refresh = async () => {
    if (user?.role === 'beneficiary') {
      setOrders(await api.listOrders('beneficiary'));
      setMeals(await api.listMeals());
    }
    if (user?.role === 'member') {
      setOrders(await api.listOrders('member'));
    }
  };
  useEffect(() => { refresh(); }, [user]);

  const place = async (e) => {
    e.preventDefault();
    await api.placeOrder({ mealId });
    setMealId('');
    refresh();
  };

  const accept = async (id) => {
    await api.acceptOrder(id);
    refresh();
  };

  return (
    <div>
      <h2>Orders</h2>
      {user?.role === 'beneficiary' && (
        <form onSubmit={place}>
          <select value={mealId} onChange={e=>setMealId(e.target.value)}>
            <option value="">Select a meal…</option>
            {meals.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
          </select>
          <button type="submit">Order</button>
        </form>
      )}
      <ul>
        {orders.map(o => (
          <li key={o._id}>
            {o.mealId} — {o.status}
            {user?.role === 'member' && o.status === 'pending' &&
              <button onClick={()=>accept(o._id)}>Accept</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}