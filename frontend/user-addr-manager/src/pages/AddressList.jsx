import { useEffect, useState } from 'react';
import { getAddressesByUser, deleteAddress, setPrincipalAddress, updateAddress } from '../services/addressService';

export default function AddressList({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);

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
    if (!window.confirm('Deseja excluir este endereço?')) return;
    try {
      await deleteAddress(id);
      loadAddresses();
    } catch {
      alert('Erro ao excluir endereço.');
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (addresses.length === 0) return <p>Nenhum endereço cadastrado.</p>;

  return (
    <div>
      <h2>Endereços</h2>

      {editingAddress && (
        <div>
          <h3>Editar Endereço</h3>
          <form onSubmit={handleUpdate}>
            <div>
              <label>Número</label>
              <input
                value={editingAddress.number}
                onChange={(e) => setEditingAddress({ ...editingAddress, number: e.target.value })}
              />
            </div>
            <div>
              <label>Complemento</label>
              <input
                value={editingAddress.complement || ''}
                onChange={(e) => setEditingAddress({ ...editingAddress, complement: e.target.value })}
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={editingAddress.isPrincipal}
                  onChange={(e) => setEditingAddress({ ...editingAddress, isPrincipal: e.target.checked })}
                />
                Endereço principal
              </label>
            </div>
            <button type="submit">Salvar</button>
            <button type="button" onClick={() => setEditingAddress(null)}>Cancelar</button>
          </form>
        </div>
      )}

      <table>
        <thead>
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
              <td>{address.principal ? '✅' : ''}</td>
              <td>
                <button onClick={() => setEditingAddress(address)}>Editar</button>
                {!address.isPrincipal && (
                  <button onClick={() => handleSetPrincipal(address.id)}>Tornar Principal</button>
                )}
                <button onClick={() => handleDelete(address.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}