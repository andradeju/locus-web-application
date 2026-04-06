import { useEffect, useState } from 'react';
import { getAddressesByUser, deleteAddress, setPrincipalAddress, updateAddress } from '../services/addressService';

function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar exclusão</h5>
          </div>
          <div className="modal-body">
            <p>Deseja excluir este endereço?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
            <button className="btn btn-danger" onClick={onConfirm}>Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddressList({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  function loadAddresses() {
    setLoading(true);
    getAddressesByUser(userId)
      .then(({ data }) => setAddresses(data))
      .catch(() => setError('Erro ao carregar endereços.'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadAddresses();
  }, [userId]);

  async function handleDelete(id) {
    try {
      await deleteAddress(id);
      loadAddresses();
    } catch {
      alert('Erro ao excluir endereço.');
    } finally {
      setConfirmDeleteId(null);
    }
  }
  

  async function handleSetPrincipal(id) {
    try {
      await setPrincipalAddress(id);
      loadAddresses();
    } catch {
      alert('Erro ao definir endereço principal.');
    }
  }

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;
    setEditingAddress((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateAddress(editingAddress.id, editingAddress);
      setEditingAddress(null);
      loadAddresses();
    } catch {
      alert('Erro ao atualizar endereço.');
    }
  }

  if (loading) return <p className="text-center mt-4">Carregando...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (addresses.length === 0) return <p className="text-center mt-4">Nenhum endereço cadastrado.</p>;

  return (
    <div className="container mt-4">

      {confirmDeleteId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      <h2 className="mb-4">Endereços</h2>

      {editingAddress && (
        <div className="card shadow mb-4 p-4">
          <h5 className="mb-3">Editar Endereço</h5>
          <form onSubmit={handleUpdate}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">CEP</label>
                <input className="form-control" name="zipCode" value={editingAddress.zipCode} onChange={handleEditChange} />
              </div>
              <div className="col-md-5">
                <label className="form-label">Logradouro</label>
                <input className="form-control" name="street" value={editingAddress.street} onChange={handleEditChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Número</label>
                <input className="form-control" name="number" value={editingAddress.number} onChange={handleEditChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Complemento</label>
                <input className="form-control" name="complement" value={editingAddress.complement || ''} onChange={handleEditChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Bairro</label>
                <input className="form-control" name="neighborhood" value={editingAddress.neighborhood} onChange={handleEditChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Cidade</label>
                <input className="form-control" name="city" value={editingAddress.city} onChange={handleEditChange} />
              </div>
              <div className="col-md-2">
                <label className="form-label">Estado</label>
                <input className="form-control" name="state" value={editingAddress.state} onChange={handleEditChange} />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="principal"
                    checked={editingAddress.principal} onChange={handleEditChange} />
                  <label className="form-check-label">Principal</label>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Salvar</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingAddress(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>CEP</th>
              <th>Logradouro</th>
              <th>Número</th>
              <th>Complemento</th>
              <th>Bairro</th>
              <th>Cidade</th>
              <th>Estado</th>
              <th>Principal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address) => (
              <tr key={address.id}>
                <td>{address.zipCode}</td>
                <td>{address.street}</td>
                <td>{address.number}</td>
                <td>{address.complement}</td>
                <td>{address.neighborhood}</td>
                <td>{address.city}</td>
                <td>{address.state}</td>
                <td>{address.principal ? '✅' : '—'}</td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingAddress(address)}>Editar</button>
                    {!address.principal && (
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleSetPrincipal(address.id)}>Principal</button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmDeleteId(address.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}