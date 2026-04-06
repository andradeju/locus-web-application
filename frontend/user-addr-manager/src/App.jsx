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
      {page === 'addresses' && selectedUser && <AddressList userId={selectedUser.id} />}
      {page === 'addAddress' && selectedUser && (
        <AddressForm userId={selectedUser.id} onSuccess={() => setPage('addresses')} />
      )}
    </div>
  )
}

export default App