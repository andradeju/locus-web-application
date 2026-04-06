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
  principal: false,
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
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card shadow p-4">
            <h2 className="mb-4">Cadastro de Endereço</h2>

            {status && (
              <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">CEP</label>
                  <input
                    name="zipCode"
                    type="text"
                    className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                    value={form.zipCode}
                    onChange={handleChange}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                  />
                  {cepLoading && <small className="text-muted">Buscando CEP...</small>}
                  {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Número</label>
                  <input
                    name="number"
                    type="text"
                    className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                    value={form.number}
                    onChange={handleChange}
                    placeholder="Ex: 100"
                  />
                  {errors.number && <div className="invalid-feedback">{errors.number}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Complemento <span className="text-muted small">(opcional)</span></label>
                  <input
                    name="complement"
                    type="text"
                    className="form-control"
                    value={form.complement}
                    onChange={handleChange}
                    placeholder="Apto, sala..."
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Logradouro</label>
                  <input
                    name="street"
                    type="text"
                    className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                    value={form.street}
                    onChange={handleChange}
                    readOnly
                  />
                  {errors.street && <div className="invalid-feedback">{errors.street}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Bairro</label>
                  <input
                    name="neighborhood"
                    type="text"
                    className="form-control"
                    value={form.neighborhood}
                    onChange={handleChange}
                    readOnly
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Cidade</label>
                  <input
                    name="city"
                    type="text"
                    className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                    value={form.city}
                    onChange={handleChange}
                    readOnly
                  />
                  {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                </div>

                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <input
                    name="state"
                    type="text"
                    className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                    value={form.state}
                    onChange={handleChange}
                    readOnly
                  />
                  {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      name="principal"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.principalrincipal}
                      onChange={handleChange}
                      id="principal"
                    />
                    <label className="form-check-label" htmlFor="principal">
                      Endereço principal
                    </label>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary mt-4 w-100">
                {loading ? 'Cadastrando...' : 'Cadastrar Endereço'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}