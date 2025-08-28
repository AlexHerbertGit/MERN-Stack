import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const { setUser } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const user = await api.login(form);
    setUser(user);
    nav('/');
  };

  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, maxWidth:320 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
      <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
      <button type="submit">Login</button>
    </form>
  );
}