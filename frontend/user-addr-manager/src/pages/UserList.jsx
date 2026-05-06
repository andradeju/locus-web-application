import { useEffect, useState } from 'react';
import { formatDate } from '../utils/formatDate';
import { getAllUsers, deleteUser } from '../services/userService';

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Erro ao carregar usuários.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-4">Carregando...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (users.length === 0) return <p className="text-center mt-4">Nenhum usuário cadastrado.</p>;

  async function handleDelete(id) {
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      setUserToDelete(null);
    } catch {
      alert('Erro ao excluir usuário.');
      setUserToDelete(null);
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Usuários</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Data de Nascimento</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.cpf}</td>
                <td>{formatDate(user.birthDate)}</td>
                <td>
                  <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-3"
                    onClick={() => onSelectUser(user)}
                  >
                    Ver Endereços
                  </button>
                  <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setUserToDelete(user)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {userToDelete && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar exclusão</h5>
                  <button className="btn-close" onClick={() => setUserToDelete(null)} />
                </div>
                <div className="modal-body">
                  <p>Tem certeza que deseja excluir <strong>{userToDelete.name}</strong>?</p>
                  <p className="text-muted small">Todos os endereços deste usuário também serão removidos.</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setUserToDelete(null)}>
                    Cancelar
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(userToDelete.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}