import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './style.css'
import Togglable from './components/Togglable'

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [user, setUser] = useState(null)
	const [notifMessage, setNotifMessege] = useState([null, ''])

	useEffect(() => {
		const setingBlog = async () => {
			const blogsInDB = await blogService.getAll()
			const orderBlogs = blogsInDB.sort((a, b) => (a.likes > b.likes ? -1 : 1))
			setBlogs(orderBlogs)
		}
		setingBlog()
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
			setNotifMessege([null, ''])
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
			setNotifObjet([
				`Hi ${userLog.name}, Welcome to blog application!`,
				'good',
			])
		} catch {
			console.log('Wrong credentials')
			setNotifObjet(['Wrong username or password', 'error'])
		}
	}

	const handleLogout = (event) => {
		event.preventDefault()
		window.localStorage.removeItem('loggedBlogappUser')
		setNotifObjet([`Goodbye ${user.name} come back soon.`, 'good'])
		setUser(null)
		blogService.setToken(null)
	}

	const addBlog = async (objectBlog) => {
		try {
			const response = await blogService.createBlog(objectBlog)
			setBlogs(blogs.concat(response))
			setNotifObjet([
				`A new blog ${response.title} by ${response.author} added.`,
				'good',
			])
		} catch (error) {
			console.log(error)
		}
	}

	const addLike = async (blog) => {
		const blogToUp = {
			user: blog.user.id,
			likes: blog.likes + 1,
			author: blog.author,
			title: blog.title,
			url: blog.url,
		}
		try {
			const response = await blogService.update(blog.id, blogToUp)
			const blogAdded = blogs.map((blogInList) =>
				blogInList.id !== blog.id ? blogInList : response
			)
			const orderBlogs = blogAdded.sort((a, b) => (a.likes > b.likes ? -1 : 1))
			setBlogs(orderBlogs)
		} catch (error) {
			console.log(error)
		}
	}

	const deleteBlog = async (blogToDelete) => {
		if (
			window.confirm(
				`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
			)
		) {
			await blogService.deleteBlog(blogToDelete.id)
			setBlogs(blogs.filter((blog) => blog.id !== blogToDelete.id))
			setNotifObjet([`The blog ${blogToDelete.title} has been delete`, 'good'])
		}
	}

	if (user === null) {
		return (
			<div>
				<h1>Log in to application</h1>
				<Notification notifObjet={notifMessage} />
				<form onSubmit={handleLogin}>
					<div>
						Username:{' '}
						<input
							type="text"
							value={username}
							name="Username"
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
					<div>
						Password:{' '}
						<input
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
			<p>
				{user.name} logged in <button onClick={handleLogout}>Logout</button>{' '}
			</p>
			<Notification notifObjet={notifMessage} />
			<Togglable buttonLabel="New blog">
				<BlogForm addBlog={addBlog} />
			</Togglable>
			{blogs.map((blog) => (
				<Blog
					key={blog.id}
					blog={blog}
					user={user}
					addLike={addLike}
					deleteBlog={deleteBlog}
				/>
			))}
		</div>
	)
}

export default App
