import { useState } from 'react'
import blogServices from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, deleteBlog, user }) => {
  const [view, setView] = useState(false)
  const hide = { display: view ? 'none' : '' }
  const show = { display: view ? '' : 'none' }
  const showDelete = {
    display: user.username === blog.user.username ? '' : 'none',
  }

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
        Likes: {blog.likes} <button onClick={() => addLike(blog)}>like</button>
        <br />
        {blog.user.name}
        <br />
        <div style={showDelete}>
          <button onClick={() => deleteBlog(blog)}>delete</button>
        </div>
      </div>
    </div>
  )
}

Blog.prototype = {
  blog: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default Blog
