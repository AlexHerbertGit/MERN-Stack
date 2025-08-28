import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import App from './ui/App.jsx';
import Login from './ui/Login.jsx';
import Register from './ui/Register.jsx';
import Dashboard from './ui/Dashboard.jsx';
import Meals from './ui/Meals.jsx';
import Orders from './ui/Orders.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'meals', element: <Meals /> },
    { path: 'orders', element: <Orders /> },
  ]}
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);