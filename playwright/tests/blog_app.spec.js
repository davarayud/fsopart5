const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWhith, createBlog, clickLike } = require('./helper')
const { getByRole } = require('@testing-library/react')

describe('Blog app', () => {
  const validUser = {
    username: 'damian',
    name: 'Damian Varayud',
    password: 'secret12',
  }
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http:localhost:3003/api/users', {
      data: validUser,
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application')
    await expect(locator).toBeVisible()
    const locatorForm = await page.getByRole('form')
    await expect(locatorForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWhith(page, validUser.username, validUser.password)

      await expect(page.getByText('Damian Varayud logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWhith(page, validUser.username, validUser.password + 'wrong')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWhith(page, validUser.username, validUser.password)
    })

    const title = 'Motos'
    const author = 'Pedro Varela'
    const url = 'https://motosargentinasnews.com'

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, title, author, url)

      const notifGood = page.locator('.good')
      await expect(notifGood).toContainText(
        `A new blog ${title} by ${author} added.`
      )
      await expect(notifGood).toBeVisible()
      const shortInfo = page.locator('.short-info')
      await expect(shortInfo).toBeVisible()
      await expect(shortInfo).toContainText(title + ' ' + author)
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title, author, url)
      })

      test('adding like to the blog works', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('the user who created a blog can delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain(
            `Remove blog ${title} by ${author}`
          )
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'delete' }).click()

        const notifGood = page.locator('.good')
        await expect(notifGood).toContainText(
          `The blog ${title} has been delete`
        )
        await expect(notifGood).toBeVisible()
        await expect(
          page.getByText('Here will be shown the added blogs')
        ).toBeVisible()
      })

      test('only the creator can see the delete button of a blog', async ({
        page,
        request,
      }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()
        await page.getByRole('button', { name: 'logout' }).click()

        const anotherUser = {
          username: 'username',
          name: 'name',
          password: 'secret32',
        }
        await request.post('http:localhost:3003/api/users', {
          data: anotherUser,
        })
        await loginWhith(page, anotherUser.username, anotherUser.password)

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.locator('.delete')).toBeHidden()
      })

      test('blogs are sorted by likes, most likes first', async ({ page }) => {
        const blogs = [
          {
            title: 'tercero',
            author: 'tercer autor',
            url: 'https://3.com',
            likes: 1
          },
          {
            title: 'primero',
            author: 'primer autor',
            url: 'https://1.com',
            likes: 3
          },
          {
            title: 'segundo',
            author: 'cuarto autor',
            url: 'https://4.com',
            likes: 2
          },
        ]
        for (let index = 0; index < blogs.length; index++) {
          await createBlog(page, blogs[index].title, blogs[index].author, blogs[index].url)
        }

        for (let index = 0; index < blogs.length; index++) {
          const locator = page.getByText(
            blogs[index].title + ' ' + blogs[index].author + ' view'
          )
          await locator.getByRole('button', { name: 'view' }).click()
          await clickLike(page, blogs[index].likes)
          await page.getByRole('button', { name: 'hide' }).click()
        }

        const algo =  await page.locator('.short-info').all()
        await expect(algo[0].getByText('primero')).toBeVisible()
        await expect(algo[1].getByText('segundo')).toBeVisible()
        await expect(algo[2].getByText('tercero')).toBeVisible()
        await expect(algo[3].getByText('Motos')).toBeVisible()
      })
    })
  })
})
