import { useState } from 'react';
import { login } from '../services/authService';

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">CPF</label>
            <input
              name="cpf"
              type="text"
              className="form-control"
              value={form.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}