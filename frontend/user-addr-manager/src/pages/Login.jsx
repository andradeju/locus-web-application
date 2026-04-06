import { useState } from 'react';
import { login } from '../services/authService';
import './Login.css';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ cpf: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await login({
        cpf: form.cpf.replace(/\D/g, ''),
        password: form.password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      onLogin(data);
    } catch {
      setError('CPF ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

return (
  <div className="login-container">
    <div className="login-box">
      <h2>Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>CPF</label>
          <input
            name="cpf"
            type="text"
            value={form.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading} className="login-btn">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  </div>
);
}