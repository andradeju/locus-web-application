import { useState } from 'react';
import { createUser } from '../services/userService';

function formatCpf(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function validateCpf(cpf) {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
}

const initialForm = { name: '', cpf: '', birthDate: '', password: '' };

export default function UserForm({ onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nome é obrigatório.';
    if (!form.cpf.trim()) {
      errs.cpf = 'CPF é obrigatório.';
    } else if (!validateCpf(form.cpf)) {
      errs.cpf = 'CPF inválido.';
    }
    if (!form.birthDate) errs.birthDate = 'Data de nascimento é obrigatória.';
    if (!form.password) {
      errs.password = 'Senha é obrigatória.';
    } else if (form.password.length < 6) {
      errs.password = 'Senha deve ter ao menos 6 caracteres.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'cpf') {
      setForm((prev) => ({ ...prev, cpf: formatCpf(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await createUser({
        name: form.name.trim(),
        cpf: form.cpf.replace(/\D/g, ''),
        birthDate: form.birthDate,
        password: form.password,
      });
      setStatus({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
      setForm(initialForm);
      setErrors({});
      if (onSuccess) onSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'CPF já cadastrado.'
          : 'Erro ao cadastrar usuário. Tente novamente.');
      setStatus({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Cadastro de Usuário</h2>

      {status && (
        <div style={status.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={styles.form}>
        <div style={styles.field}>
          <label htmlFor="name" style={styles.label}>Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome completo"
            style={errors.name ? { ...styles.input, ...styles.inputError } : styles.input}
            autoComplete="name"
          />
          {errors.name && <span style={styles.error}>{errors.name}</span>}
        </div>

        <div style={styles.field}>
          <label htmlFor="cpf" style={styles.label}>CPF</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={form.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            inputMode="numeric"
            style={errors.cpf ? { ...styles.input, ...styles.inputError } : styles.input}
            autoComplete="off"
          />
          {errors.cpf && <span style={styles.error}>{errors.cpf}</span>}
        </div>

        <div style={styles.field}>
          <label htmlFor="birthDate" style={styles.label}>Data de Nascimento</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            style={errors.birthDate ? { ...styles.input, ...styles.inputError } : styles.input}
          />
          {errors.birthDate && <span style={styles.error}>{errors.birthDate}</span>}
        </div>

        <div style={styles.field}>
          <label htmlFor="password" style={styles.label}>Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            style={errors.password ? { ...styles.input, ...styles.inputError } : styles.input}
            autoComplete="new-password"
          />
          {errors.password && <span style={styles.error}>{errors.password}</span>}
        </div>

        <button type="submit" disabled={loading} style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}


