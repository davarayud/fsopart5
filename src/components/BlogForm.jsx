import { useState } from 'react'

const BlogForm = ({
    addBlog
  }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitle = (event) => setTitle(event.target.value)
    const handleAuthor = (event) => setAuthor(event.target.value)
    const handleUrl = (event) => setUrl(event.target.value)

    const handleAddBlog = (event) => {
      event.preventDefault()
      const objectBlog = {
        title, author, url
      }
      addBlog(objectBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
    }

    return(
      <div>
        <h2>Create New</h2>
        <form onSubmit={handleAddBlog}>
          <div>
            Title: <input 
              type='text'
              name='Title'
              value={title}
              onChange={handleTitle}
              />
          </div>
          <div>
            Author: <input
              type='text' 
              name='Author'
              value={author}
              onChange={handleAuthor}
              />
          </div>
          <div>
            URL: <input
              type='URL'
              name='Url'
              value={url}
              onChange={handleUrl} />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </div>
    )
}

export default BlogForm