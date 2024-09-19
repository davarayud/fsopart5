import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm/>', () => {
  test('Form calls the event handler it received as props with the correct details', async () => {
    const addBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(<BlogForm addBlog={addBlog} />).container

    const inputTitle = container.querySelector('#Title')
    const inputAuthor = container.querySelector('#Author')
    const inputUrl = container.querySelector('#Url')
    const sendButton = screen.getByText('add')

    await user.type(inputTitle, 'Title')
    await user.type(inputAuthor, 'Author')
    await user.type(inputUrl, 'http://www.url.com')
    await user.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('Title')
    expect(addBlog.mock.calls[0][0].author).toBe('Author')
    expect(addBlog.mock.calls[0][0].url).toBe('http://www.url.com')
  })
})
