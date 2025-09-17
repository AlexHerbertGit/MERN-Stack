// Meals React page (improved)
// - Members: create meals with title, description, dietary, qty
// - Beneficiaries: read-only list with guidance
// - Shared: loading/error states + success feedback

import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Meals() {
  const { user } = useAuth();

  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // form (members only)
  const [form, setForm] = useState({
    title: '',
    description: '',
    dietary: '',
    qtyAvailable: 5
  });

  const refresh = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await api.listMeals();
      setMeals(data);
    } catch (e) {
      setErr(e.message || 'Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');

    // minimal client-side validation
    if (!form.title.trim()) {
      setErr('Title is required');
      return;
    }
    const qty = Number(form.qtyAvailable);
    if (Number.isNaN(qty) || qty < 0) {
      setErr('Quantity must be a number ≥ 0');
      return;
    }

    // build payload
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      qtyAvailable: qty,
      dietary: form.dietary
        ? form.dietary.split(',').map(s => s.trim()).filter(Boolean)
        : []
    };

    try {
      await api.createMeal(payload);
      setOk('Meal created');
      setForm({ title: '', description: '', dietary: '', qtyAvailable: 5 });
      await refresh();
    } catch (e) {
      setErr(e.message || 'Failed to create meal');
    }
  };

  return (
    <div style={{ display:'grid', gap:16 }}>
      <h2>Meals</h2>

      {/* Member create form */}
      {user?.role === 'member' && (
        <form onSubmit={create} style={{ display:'grid', gap:8, maxWidth:560 }}>
          <h3>Create Meal</h3>
          <input
            placeholder="Title *"
            value={form.title}
            onChange={e=>setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={e=>setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Dietary (comma-separated: gluten-free, vegan)"
            value={form.dietary}
            onChange={e=>setForm({ ...form, dietary: e.target.value })}
          />
          <input
            type="number"
            min={0}
            placeholder="Qty Available"
            value={form.qtyAvailable}
            onChange={e=>setForm({ ...form, qtyAvailable: e.target.value })}
          />
          <div style={{ display:'flex', gap:8 }}>
            <button type="submit">Add Meal</button>
            {ok && <span style={{ color:'seagreen' }}>{ok}</span>}
            {err && <span style={{ color:'crimson' }}>{err}</span>}
          </div>
        </form>
      )}

      {/* Beneficiary hint */}
      {user?.role === 'beneficiary' && (
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          This is a read-only list. To place an order, go to <b>Orders</b>.
        </p>
      )}

      {/* Meals list */}
      <div>
        <h3>All Meals</h3>
        {loading ? (
          <p>Loading meals…</p>
        ) : err && !user?.role === 'member' ? (
          <p style={{ color:'crimson' }}>{err}</p>
        ) : meals.length === 0 ? (
          <p>No meals yet.</p>
        ) : (
          <ul>
            {meals.map(m => (
              <li key={m._id} style={{ marginBottom: 6 }}>
                <b>{m.title}</b>
                {m.description ? <> — {m.description}</> : null}
                {' '} (qty {m.qtyAvailable})
                {m.dietary?.length ? <> | dietary: {m.dietary.join(', ')}</> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}