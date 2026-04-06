import { useState } from 'react'
import Login from './pages/Login'
import UserForm from './pages/UserForm'
import UserList from './pages/UserList'
import AddressList from './pages/AddressList'
import AddressForm from './pages/AddressForm'
import Header from './components/Header'
import UserCard from './components/UserCard'

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [page, setPage] = useState('list')
  const [selectedUser, setSelectedUser] = useState(null)

  function handleLogin(userData) {
    setUser(userData)
    if (userData.role === 'USER') {
      setSelectedUser(userData)
      setPage('addresses')
    } else {
    setPage('list')
    }
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
    <Header
        user={user}
        selectedUser={selectedUser}
        onLogout={handleLogout}
        onNavigate={(p) => {
          if (user.role === 'USER' && (p === 'addresses' || p === 'addAddress')) {
            setSelectedUser(user)
          }
          setPage(p)
        }}
        onAddAddress={() => setPage('addAddress')}
    />
      {page === 'list' && user.role === 'ADMIN' && <UserList onSelectUser={handleSelectUser} />}
      {page === 'create' && user.role === 'ADMIN' && <UserForm onSuccess={() => setPage('list')} />}
      {page === 'addresses' && selectedUser && (
        <div className="container mt-4">
          <UserCard user={selectedUser} />
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