import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Meals() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [title, setTitle] = useState('');

  const refresh = () => api.listMeals().then(setMeals);
  useEffect(() => { refresh(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.createMeal({ title, qtyAvailable: 5 });
    setTitle('');
    refresh();
  };

  return (
    <div>
      <h2>Meals</h2>
      {user?.role === 'member' && (
        <form onSubmit={create}>
          <input placeholder="Meal title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button type="submit">Add Meal</button>
        </form>
      )}
      <ul>{meals.map(m => <li key={m._id}>{m.title} (qty {m.qtyAvailable})</li>)}</ul>
    </div>
  );
}