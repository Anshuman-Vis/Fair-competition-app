import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    roll_number: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', form);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Create Account</h2>

        {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Roll Number"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.roll_number}
          onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-6"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700">
          Create Account
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
