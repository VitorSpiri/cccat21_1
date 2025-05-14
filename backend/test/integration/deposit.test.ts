import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Deve adicionar fundos em uma conta", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }

    const responseSignup = await axios.post("http://localhost:3000/signup")
    const outputSignup = responseSignup.data
    expect(outputSignup.accountId).toBeDefined();

    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit")
    const outputDeposit = responseDeposit.status
    expect(outputDeposit).toBe(201)



})