export default function Header({ user, selectedUser, onLogout, onNavigate, onAddAddress }) {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">📍 Locus</span>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        <span className="text-white me-2">
          Olá, {user.name}
          <span className={`badge ms-2 ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
            {user.role}
          </span>
        </span>
        {user.role === 'ADMIN' && (
          <>
            <button className="btn btn-sm btn-outline-light" onClick={() => onNavigate('list')}>Usuários</button>
            <button className="btn btn-sm btn-outline-light" onClick={() => onNavigate('create')}>Novo Usuário</button>
            {selectedUser && (
              <button className="btn btn-sm btn-outline-light" onClick={onAddAddress}>
                Novo Endereço para {selectedUser.name}
              </button>
            )}
          </>
        )}
        {user.role === 'USER' && (
          <>
            <button className="btn btn-sm btn-outline-light" onClick={() => onNavigate('addresses')}>Meus Endereços</button>
            <button className="btn btn-sm btn-outline-light" onClick={() => onNavigate('addAddress')}>Novo Endereço</button>
          </>
        )}
        <button className="btn btn-sm btn-danger" onClick={onLogout}>Sair</button>
      </div>
    </nav>
  );
}