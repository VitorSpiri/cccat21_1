import express, { Request, Response } from "express";
import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";
import { isValidPassword } from "./validatePassword"

const app = express();
app.use(express.json());

// const accounts: any = [];
const connection = pgp()("postgres://postgres:123456@localhost:5431/app");

export function isValidName (name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

export function isValidEmail (email: string) {
    return email.match(/^(.+)\@(.+)$/);
}

app.post("/signup", async (req: Request, res: Response) => {
    const input = req.body;
    if (!isValidName(input.name)) {
        return res.status(422).json({
            error: "Invalid name"
        });
    }
    if (!isValidEmail(input.email)) {
        return res.status(422).json({
            error: "Invalid email"
        });
    }
    if (!validateCpf(input.document)) {
        return res.status(422).json({
            error: "Invalid document"
        });
    }
    if (!isValidPassword(input.password)) {
        return res.status(422).json({
            error: "Invalid password"
        });
    }
    const accountId = crypto.randomUUID();
    const account = {
        accountId,
        name: input.name,
        email: input.email,
        document: input.document,
        password: input.password
    }
    // accounts.push(account);
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
    res.json({
        accountId
    });
});

app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    // const account = accounts.find((account: any) => account.accountId === accountId);
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId])
    accountData.assets = []
    for (const accountAssetData of accountAssetsData){
        accountData.assets.push({ assetId: accountAssetData.asset_Id, quantity: parseFloat(accountAssetData.quantity) })
    }
    res.json(accountData);
});


function isValidQuantity (quantity: number) {
    if (quantity <= 0) return false
    return true
}


app.post("/deposit", async (req: Request, res: Response) => {
    const input = req.body;

        if (!isValidQuantity(input.quantity)){
            return res.status(422).json({
                error: "Invalid quantity"
            })
        }

    const deposit = {
        accountId: input.accountId,
        assetId: input.assetId,
        quantity: input.quantity
    }

    await connection.query("insert into ccca.account_asset (account_id, asset_Id, quantity) values ($1, $2, $3)", [deposit.accountId, deposit.assetId, deposit.quantity])
    res.end()
})


app.listen(3000);

