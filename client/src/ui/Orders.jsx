// Orders React Page
// Shows the list of pending orders for both beneficiaries and memebers
// Allows members to accept orders from the list of pending orders.

import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Orders() {
  const { user, setUser } = useAuth();

  const [orders, setOrders] = useState([]);
  const [meals, setMeals] = useState([]);
  const [mealId, setMealId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [acceptingId, setAcceptingId] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const mealsById = useMemo(() => {
    const map = new Map();
    meals.forEach(m => map.set(m._id, m));
    return map;
  }, [meals]);

  const refresh = async () => {
    setLoading(true);
    setErr('');
    try {
      // Always fetch meals so we can display order meal titles
      const mealList = await api.listMeals();
      setMeals(mealList);

      if (user?.role === 'beneficiary') {
        const os = await api.listOrders('beneficiary');
        setOrders(os);
      } else if (user?.role === 'member') {
        const os = await api.listOrders('member');
        setOrders(os);
      } else {
        setOrders([]);
      }
    } catch (e) {
      setErr(e.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) refresh(); }, [user]);

  const place = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    if (!mealId) {
      setErr('Please select a meal before ordering.');
      return;
    }
    const meal = mealsById.get(mealId);
    if (!meal) {
      setErr('Selected meal was not found. Try refreshing the page.');
      return;
    }
    if (meal.qtyAvailable <= 0) {
      setErr('That meal is out of stock.');
      return;
    }

    try {
      setPlacing(true);
      await api.placeOrder({ mealId });
      setMealId('');
      setOk('Order placed.');
      await refresh();
      // Refresh user to show updated token balance on the dashboard
      const u = await api.me();
      setUser(u);
    } catch (e) {
      setErr(e.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const accept = async (id) => {
    setErr(''); setOk('');
    try {
      setAcceptingId(id);
      await api.acceptOrder(id);
      setOk('Order accepted.');
      await refresh();
    } catch (e) {
      setErr(e.message || 'Failed to accept order');
    } finally {
      setAcceptingId('');
    }
  };

  if (!user) return <p>Please log in.</p>;

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h2>Orders</h2>

      {user.role === 'beneficiary' && (
        <form onSubmit={place} style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <label>
            Place order for:&nbsp;
            <select value={mealId} onChange={e=>setMealId(e.target.value)}>
              <option value="">Select a meal…</option>
              {meals.map(m => (
                <option key={m._id} value={m._id} disabled={m.qtyAvailable <= 0}>
                  {m.title} {m.qtyAvailable <= 0 ? '(out of stock)' : `(qty ${m.qtyAvailable})`}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={!mealId || placing}>
            {placing ? 'Ordering…' : 'Order'}
          </button>
        </form>
      )}

      {err && <p style={{ color:'crimson' }}>{err}</p>}
      {ok && <p style={{ color:'seagreen' }}>{ok}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <h3>My {user.role} orders</h3>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <ul>
              {orders.map(o => {
                const meal = mealsById.get(o.mealId);
                const title = meal?.title || o.mealId; // fallback to id if not found
                return (
                  <li key={o._id} style={{ marginBottom: 6 }}>
                    <b>{title}</b> — status: <b>{o.status}</b>
                    {user.role === 'member' && o.status === 'pending' && (
                      <> &nbsp;
                        <button onClick={() => accept(o._id)} disabled={acceptingId === o._id}>
                          {acceptingId === o._id ? 'Accepting…' : 'Accept'}
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}