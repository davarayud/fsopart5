import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ logger }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    const userObj = { username, password }
    logger(userObj)
    setUsername('')
    setPassword('')
  }

  return (
    <>
      <form onSubmit={handleLogin} aria-label="Login">
        <div>
          <label>
            Username:{' '}
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password:{' '}
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  )
}

LoginForm.prototype = {
  logger: PropTypes.func.isRequired,
}

export default LoginForm
