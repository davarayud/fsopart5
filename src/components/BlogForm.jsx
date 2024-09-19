import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleTitle = (event) => setTitle(event.target.value)
  const handleAuthor = (event) => setAuthor(event.target.value)
  const handleUrl = (event) => setUrl(event.target.value)

  const handleAddBlog = (event) => {
    event.preventDefault()
    const objectBlog = {
      title,
      author,
      url,
    }
    addBlog(objectBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          <label>
            Title:{' '}
            <input
              type="text"
              name="Title"
              value={title}
              onChange={handleTitle}
              id="Title"
            />
          </label>
        </div>
        <div>
          <label>
            Author:{' '}
            <input
              type="text"
              name="Author"
              value={author}
              onChange={handleAuthor}
              id="Author"
            />
          </label>
        </div>
        <div>
          <label>
            URL:{' '}
            <input
              type="URL"
              name="Url"
              value={url}
              onChange={handleUrl}
              id="Url"
            />
          </label>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

BlogForm.prototype = {
  addBlog: PropTypes.func.isRequired,
}

export default BlogForm
