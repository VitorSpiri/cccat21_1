import { isValidPassword } from '../../src/validatePassword'

test("Deve validar a senha", () => {
    const password = "asdQWE123"
    const isValid = isValidPassword(password)
    expect(isValid).toBe(true)
})

test.each([
    "asd23",
    "asdfreiuj",
    "ALOKEH23",
    "alokeh32",
    "12346789"
])("Não deve validar a senha", (password: string) => {
    const isValid = isValidPassword(password)
    expect(isValid).toBe(false)
})