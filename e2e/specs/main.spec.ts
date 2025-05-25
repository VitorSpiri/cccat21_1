import { test, expect } from '@playwright/test'

test.describe("Signup Test", () => {
    test("Deve criar uma conta", async ({ page }) => {
        await page.goto('http://localhost:3001/signup')
        await page.fill('.input-name', 'John Doe')
        await page.fill('.input-email', 'john.doe@gmail.com')
        await page.fill('.input-document', '97456321558')
        await page.fill('.input-password', 'asdQWE123')
        await page.locator('.button-confirm').click()
        await expect(page.locator(".span-message")).toHaveText("Conta criada com sucesso")
    })
})