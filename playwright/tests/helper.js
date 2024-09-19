const loginWhith = async (page, username, password) => {
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button').click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New blog' }).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('URL').fill(url)
  await page.getByRole('button', { name: 'add' }).click()
  await page.getByText(title + ' ' + author).waitFor()
}

const clickLike = async (page, i) => {
  for (let index = 1; index <= i ; index++) {
    await page.getByRole('button', { name: 'like' }).click()
    await page.getByText('Likes: '+index.toString()).waitFor()
  }
}

export { loginWhith, createBlog, clickLike }
