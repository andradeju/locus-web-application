import { useState } from 'react';
import { createAddress, getAddressByCep } from '../services/addressService';

const initialForm = {
  zipCode: '',
  number: '',
  complement: '',
  street: '',
  neighborhood: '',
  city: '',
  state: '',
  isPrincipal: false,
};

export default function AddressForm({ userId, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  async function handleCepBlur() {
    const cep = form.zipCode.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const { data } = await getAddressByCep(cep);
      if (data.erro) {
        setErrors((prev) => ({ ...prev, zipCode: 'CEP não encontrado.' }));
        return;
      }
      setForm((prev) => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }));
    } catch {
      setErrors((prev) => ({ ...prev, zipCode: 'Erro ao buscar CEP.' }));
    } finally {
      setCepLoading(false);
    }
  }

  function validate() {
    const errs = {};
    if (!form.zipCode.trim()) errs.zipCode = 'CEP é obrigatório.';
    else if (form.zipCode.replace(/\D/g, '').length !== 8) errs.zipCode = 'CEP inválido.';
    if (!form.number.trim()) errs.number = 'Número é obrigatório.';
    if (!form.street.trim()) errs.street = 'Logradouro é obrigatório.';
    if (!form.city.trim()) errs.city = 'Cidade é obrigatória.';
    if (!form.state.trim()) errs.state = 'Estado é obrigatório.';
    return errs;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
      await createAddress(userId, {
        ...form,
        zipCode: form.zipCode.replace(/\D/g, ''),
      });
      setStatus({ type: 'success', message: 'Endereço cadastrado com sucesso!' });
      setForm(initialForm);
      setErrors({});
      if (onSuccess) onSuccess();
    } catch {
      setStatus({ type: 'error', message: 'Erro ao cadastrar endereço. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Cadastro de Endereço</h2>

      {status && (
        <div style={{ color: status.type === 'success' ? 'green' : 'red' }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>CEP</label>
          <input
            name="zipCode"
            type="text"
            value={form.zipCode}
            onChange={handleChange}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            inputMode="numeric"
            maxLength={9}
          />
          {cepLoading && <span>Buscando CEP...</span>}
          {errors.zipCode && <span>{errors.zipCode}</span>}
        </div>

        <div>
          <label>Número</label>
          <input
            name="number"
            type="text"
            value={form.number}
            onChange={handleChange}
            placeholder="Ex: 100"
          />
          {errors.number && <span>{errors.number}</span>}
        </div>

        <div>
          <label>Complemento</label>
          <input
            name="complement"
            type="text"
            value={form.complement}
            onChange={handleChange}
            placeholder="Apto, sala... (opcional)"
          />
        </div>

        <div>
          <label>Logradouro</label>
          <input
            name="street"
            type="text"
            value={form.street}
            onChange={handleChange}
            readOnly
          />
          {errors.street && <span>{errors.street}</span>}
        </div>

        <div>
          <label>Bairro</label>
          <input
            name="neighborhood"
            type="text"
            value={form.neighborhood}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div>
          <label>Cidade</label>
          <input
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            readOnly
          />
          {errors.city && <span>{errors.city}</span>}
        </div>

        <div>
          <label>Estado</label>
          <input
            name="state"
            type="text"
            value={form.state}
            onChange={handleChange}
            readOnly
          />
          {errors.state && <span>{errors.state}</span>}
        </div>

        <div>
          <label>
            <input
              name="isPrincipal"
              type="checkbox"
              checked={form.isPrincipal}
              onChange={handleChange}
            />
            Endereço principal
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Endereço'}
        </button>
      </form>
    </div>
  );
}