import { useState } from 'react'
import Login from './pages/Login'
import UserForm from './pages/UserForm'
import UserList from './pages/UserList'
import AddressList from './pages/AddressList'
import AddressForm from './pages/AddressForm'

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [page, setPage] = useState('list')
  const [selectedUser, setSelectedUser] = useState(null)

  function handleLogin(userData) {
    setUser(userData)
    setPage('list')
  }

  function handleLogout() {
    localStorage.removeItem('user')
    setUser(null)
    setSelectedUser(null)
    setPage('list')
  }

  function handleSelectUser(u) {
    setSelectedUser(u)
    setPage('addresses')
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <div>
      <nav>
        <span>Olá, {user.name} ({user.role})</span>
        {user.role === 'ADMIN' && (
          <>
            <button onClick={() => setPage('list')}>Usuários</button>
            <button onClick={() => setPage('create')}>Novo Usuário</button>
            {selectedUser && (
              <button onClick={() => setPage('addAddress')}>
                Novo Endereço para {selectedUser.name}
              </button>
            )}
          </>
        )}
        {user.role === 'USER' && (
          <>
            <button onClick={() => { setSelectedUser(user); setPage('addresses'); }}>
              Meus Endereços
            </button>
            <button onClick={() => { setSelectedUser(user); setPage('addAddress'); }}>
              Novo Endereço
            </button>
          </>
        )}
        <button onClick={handleLogout}>Sair</button>
      </nav>

      {page === 'list' && user.role === 'ADMIN' && <UserList onSelectUser={handleSelectUser} />}
      {page === 'create' && user.role === 'ADMIN' && <UserForm onSuccess={() => setPage('list')} />}
      {page === 'addresses' && selectedUser && (
        <div>
          <div>
            <h3>Dados do Usuário</h3>
            <p><strong>Nome:</strong> {selectedUser.name}</p>
            <p><strong>CPF:</strong> {selectedUser.cpf}</p>
            <p><strong>Data de Nascimento:</strong> {selectedUser.birthDate}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
          </div>
          <AddressList userId={selectedUser.id} />
        </div>
      )}
      {page === 'addAddress' && selectedUser && (
        <AddressForm userId={selectedUser.id} onSuccess={() => setPage('addresses')} />
      )}
    </div>
  )
}

export default App