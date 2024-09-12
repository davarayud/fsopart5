const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http:localhost:3003/api/users', {
      data: {
        username: 'damian',
        name: 'Damian Varayud',
        password: 'secret',
      },
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
      await page.getByRole('textbox', { name: 'Username' }).fill('damian')
      await page.getByRole('textbox', { name: 'Password' }).fill('secret')
      await page.getByRole('button').click()

      await expect(page.getByText('Damian Varayud logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('Username').fill('damian')
      await page.getByLabel('Password').fill('Wrong')
      await page.getByRole('button').click()

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong username or password')
    })
  })
})
