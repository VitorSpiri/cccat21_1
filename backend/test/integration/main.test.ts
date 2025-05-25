import axios from "axios";

axios.defaults.validateStatus = () => true;

test("Deve criar uma conta válida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
    expect(outputGetAccount.document).toBe(inputSignup.document);
});

test("Não deve criar uma conta com nome inválido", async () => {
    const inputSignup = {
        name: "John",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid name");
});

test("Não deve criar uma conta com email inválido", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid email");
});

test.each([
    "111",
    "abc",
    "7897897897"
])("Não deve criar uma conta com cpf inválido", async (document: string) => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document,
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid document");
});

test("Não deve criar uma conta com senha inválida", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    expect(responseSignup.status).toBe(422);
    expect(outputSignup.error).toBe("Invalid password");
});

test("Deve adicionar fundos em uma conta", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }

    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup)
    const outputSignup = responseSignup.data

    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3001/deposit", inputDeposit)
    const outputDeposit = responseDeposit.status
    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount.assets).toHaveLength(1)
    expect(outputGetAccount.assets[0].assetId).toBe("BTC")
    expect(outputGetAccount.assets[0].quantity).toBe(10)

})

test("Deve fazer um saque", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup)
    const outputSignup = responseSignup.data
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 10
    }
    await axios.post("http://localhost:3001/deposit", inputDeposit)
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 5
    }

    await axios.post("http://localhost:3001/withdraw", inputWithdraw)
    const responseGetAccount = await axios.get(`http://localhost:3001/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;   
    expect(outputGetAccount.assets).toHaveLength(1)
    expect(outputGetAccount.assets[0].assetId).toBe("BTC")
    expect(outputGetAccount.assets[0].quantity).toBe(5)
    

})

test("Não deve fazer um saque sem fundos", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup)
    const outputSignup = responseSignup.data
    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 10
    }
    await axios.post("http://localhost:3001/deposit", inputDeposit)
    const inputWithdraw = {
        accountId: outputSignup.accountId,
        assetId: 'BTC',
        quantity: 10
    }

    const responseWithdraw = await axios.post("http://localhost:3001/withdraw", inputWithdraw)
    const outputWithdraw = responseWithdraw.data
    expect(outputWithdraw.error).toBe("Insufficient funds")

})



test("Deve criar uma ordem de venda", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3001/signup", inputSignup);
    const outputSignup = responseSignup.data;
    const inputPlaceOrder = {
        marketId: "BTC/USD",
        accountId: outputSignup.accountId,
        side: "sell",
        quantity: 1,
        price: 94000
    }
    const responsePlaceOrder = await axios.post("http://localhost:3001/place_order", inputPlaceOrder)
    const outputPlaceOrder = responsePlaceOrder.data
    expect(outputPlaceOrder.orderId).toBeDefined()
    const responseGetPlaceOrder = await axios.get(`http://localhost:3001/orders/${outputPlaceOrder.orderId}`)
    const outputGetPlaceOrder = responseGetPlaceOrder.data
    expect(outputGetPlaceOrder.marketId).toBe(inputPlaceOrder.marketId)
    expect(outputGetPlaceOrder.side).toBe(inputPlaceOrder.side)
    expect(outputGetPlaceOrder.quantity).toBe(inputPlaceOrder.quantity)
    expect(outputGetPlaceOrder.price).toBe(inputPlaceOrder.price)
    expect(outputGetPlaceOrder.status).toBe("open")
    expect(outputGetPlaceOrder.timestamp).toBeDefined()
});

