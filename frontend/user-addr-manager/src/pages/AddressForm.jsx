import { useState } from 'react';
import { createAddress, getAddressByCep } from '../services/addressService';
import FormField from '../components/FormField';

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

function cleanCep(value) {
  return value.replace(/\D/g, '');
}

export default function AddressForm({ userId, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  async function handleCepBlur() {
    const cep = cleanCep(form.zipCode);
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
    else if (cleanCep(form.zipCode).length !== 8) errs.zipCode = 'CEP inválido.';
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
        zipCode: cleanCep(form.zipCode),
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
                  <FormField label="CEP" error={errors.zipCode}>
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
                  </FormField>
                </div>

                <div className="col-md-4">
                  <FormField label="Número" error={errors.number}>
                    <input
                      name="number"
                      type="text"
                      className={`form-control ${errors.number ? 'is-invalid' : ''}`}
                      value={form.number}
                      onChange={handleChange}
                      placeholder="Ex: 100"
                    />
                  </FormField>
                </div>

                <div className="col-md-4">
                  <FormField label={<>Complemento <span className="text-muted small">(opcional)</span></>}>
                    <input
                      name="complement"
                      type="text"
                      className="form-control"
                      value={form.complement}
                      onChange={handleChange}
                      placeholder="Apto, sala..."
                    />
                  </FormField>
                </div>

                <div className="col-md-8">
                  <FormField label="Logradouro" error={errors.street}>
                    <input
                      name="street"
                      type="text"
                      className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                      value={form.street}
                      onChange={handleChange}
                      readOnly
                    />
                  </FormField>
                </div>

                <div className="col-md-4">
                  <FormField label="Bairro">
                    <input
                      name="neighborhood"
                      type="text"
                      className="form-control"
                      value={form.neighborhood}
                      onChange={handleChange}
                      readOnly
                    />
                  </FormField>
                </div>

                <div className="col-md-8">
                  <FormField label="Cidade" error={errors.city}>
                    <input
                      name="city"
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      value={form.city}
                      onChange={handleChange}
                      readOnly
                    />
                  </FormField>
                </div>

                <div className="col-md-4">
                  <FormField label="Estado" error={errors.state}>
                    <input
                      name="state"
                      type="text"
                      className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                      value={form.state}
                      onChange={handleChange}
                      readOnly
                    />
                  </FormField>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      name="principal"
                      type="checkbox"
                      className="form-check-input"
                      checked={form.principal}
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
