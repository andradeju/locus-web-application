import { formatDate } from '../utils/formatDate';

export default function UserCard({ user }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Dados do Usuário</h5>
        <div className="row">
          <div className="col-md-3">
            <p className="mb-1 text-muted small">Nome</p>
            <p className="fw-bold">{user.name}</p>
          </div>
          <div className="col-md-3">
            <p className="mb-1 text-muted small">CPF</p>
            <p className="fw-bold">{user.cpf}</p>
          </div>
          <div className="col-md-3">
            <p className="mb-1 text-muted small">Data de Nascimento</p>
            <p className="fw-bold">{formatDate(user.birthDate)}</p>
          </div>
          <div className="col-md-3">
            <p className="mb-1 text-muted small">Perfil</p>
            <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}