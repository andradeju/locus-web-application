import { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';

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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  if (users.length === 0) return <p>Nenhum usuário cadastrado.</p>;

  return (
    <div>
      <h2>Usuários</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Data de Nascimento</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.cpf}</td>
              <td>{user.birthDate}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => onSelectUser(user)}>
                  Ver Endereços
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}