import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './style.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notifMessage, setNotifMessege] = useState( [ null, ''] )

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const setNotifObjet = (notif) => {
    setNotifMessege(notif)
    setTimeout(() => {
      setNotifMessege([null,''])
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const userLog = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userLog))
      setUser(userLog)
      blogService.setToken(userLog.token)
      setUsername('')
      setPassword('')
      setNotifObjet([`Hi ${userLog.name}, Welcome to blog application!`,'good'])
    } catch {
      console.log('Wrong credentials')
      setNotifObjet(['Wrong username or password', 'error'])
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setNotifObjet([`Goodbye ${user.name} come back soon.`,'good'])
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (objectBlog) => {
    try {
      const response = await blogService.createBlog(objectBlog)
      setBlogs(blogs.concat(response))
      setNotifObjet([`A new blog ${response.title} by ${response.author} added.`,'good'])
    } catch (error) {
      console.log(error)
    }
  }

  if (user === null) {
    return (
      <div>
        <h1>Log in to application</h1>
        <Notification notifObjet={notifMessage} />
        <form onSubmit={handleLogin}>
          <div>
            Username: <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password: <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button> </p>     
      <Notification notifObjet={notifMessage} />
      <BlogForm addBlog={addBlog} />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App