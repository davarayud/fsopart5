import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog/>', () => {
  let container
  const blog = {
    title: 'titulo del blog',
    author: 'autor del blog',
    url: 'http://www.url.com',
    likes: 0,
    user: { username: 'nombre de usuario' },
  }
  let addLike
  const deleteBlog = (blog) => {}
  const user = { username: 'nombre de usuario' }

  beforeEach(() => {
    addLike = vi.fn()
    container = render(
      <Blog blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog} />
    ).container
  })

  test('At startup shows title and author but does not show url and likes', () => {
    const divShortInfo = container.querySelector('.short-info')
    const divAllInfo = container.querySelector('.all-info')

    expect(divShortInfo).toHaveTextContent('titulo del blog')
    expect(divShortInfo).toHaveTextContent('autor del blog')

    expect(divAllInfo).toHaveTextContent('http://www.url.com')
    expect(divAllInfo).toHaveTextContent(0)
    expect(divAllInfo).toHaveStyle('display: none')
  })

  test('After clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const divAllInfo = container.querySelector('.all-info')
    expect(divAllInfo).not.toHaveStyle('display: none')
  })

  test('Clicking the button 2 times activates the event handler 2 times', async () => {
    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(addLike.mock.calls).toHaveLength(2)
  })
})
