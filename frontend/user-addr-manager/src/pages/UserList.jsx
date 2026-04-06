import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { formatDate } from '../utils/formatDate';

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllUsers()
      .then(({ data }) => setUsers(data))
      .catch(() => setError('Erro ao carregar usuários.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-4">Carregando...</p>;
  if (error) return <p className="text-danger text-center mt-4">{error}</p>;
  if (users.length === 0) return <p className="text-center mt-4">Nenhum usuário cadastrado.</p>;

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
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onSelectUser(user)}
                  >
                    Ver Endereços
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}