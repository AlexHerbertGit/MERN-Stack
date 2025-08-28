import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'beneficiary' });
  const { setUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const user = await api.register(form);
    setUser(user);
    nav('/');
  };

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:360 }}>
      <h2>Register</h2>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
        <option value="beneficiary">Beneficiary</option>
        <option value="member">Member</option>
      </select>
      <button type="submit">Create Account</button>
    </form>
  );
}