import { useState } from 'react'

const Blog = ({ blog }) => {
	const [view, setView] = useState(false)
	const hide = { display: view ? 'none' : '' }
	const show = { display: view ? '' : 'none' }

	return (
		<div className="blog">
			<div style={hide}>
				{blog.title} {blog.author}{' '}
				<button onClick={() => setView(true)}>view</button>
			</div>
			<div style={show}>
				{blog.title} {blog.author}{' '}
				<button onClick={() => setView(false)}>hide</button>
				<br />
				{blog.url}
				<br />
				Likes: {blog.likes} <button>like</button>
				<br />
				{blog.user.name}
			</div>
		</div>
	)
}

export default Blog
