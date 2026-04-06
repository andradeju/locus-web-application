import { useState } from 'react'
import UserForm from './pages/UserForm'
import UserList from './pages/UserList'
import AddressList from './pages/AddressList'
import AddressForm from './pages/AddressForm'

function App() {
  const [page, setPage] = useState('list')
  const [selectedUser, setSelectedUser] = useState(null)

  function handleSelectUser(user) {
    setSelectedUser(user)
    setPage('addresses')
  }

  return (
    <div>
      <nav>
        <button onClick={() => setPage('list')}>Usuários</button>
        <button onClick={() => setPage('create')}>Novo Usuário</button>
        {selectedUser && (
          <button onClick={() => setPage('addresses')}>
            Endereços de {selectedUser.name}
          </button>
        )}
        {selectedUser && (
          <button onClick={() => setPage('addAddress')}>
            Novo Endereço
          </button>
        )}
      </nav>

      {page === 'list' && <UserList onSelectUser={handleSelectUser} />}
      {page === 'create' && <UserForm onSuccess={() => setPage('list')} />}
      {page === 'addresses' && selectedUser && (
        <AddressList userId={selectedUser.id} />
      )}
      {page === 'addAddress' && selectedUser && (
        <AddressForm userId={selectedUser.id} onSuccess={() => setPage('addresses')} />
      )}
    </div>
  )
}

export default App