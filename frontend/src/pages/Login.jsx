import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed: ' + (err.message || 'Server error'));
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Student Login</h2>
        
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full border p-3 rounded-lg mb-4" 
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full border p-3 rounded-lg mb-6" 
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required
        />
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Logging in...' : 'Enter Arena'}
        </button>
        <p className="mt-4 text-sm text-center">New? <Link to="/register" className="text-blue-600">Create Account</Link></p>
      </form>
    </div>
  );
};

export default Login;