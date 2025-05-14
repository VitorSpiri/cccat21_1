import express, { Request, Response } from "express";
import pgp from "pg-promise";

const app = express();
app.use(express.json());

const connection = pgp()("postgres://postgres:123456@localhost:5431/app");

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

    await connection.query("insert into ccca.account_asset (account_id, assetId, quantity) values ($1, $2, $3)", [deposit.accountId, deposit.assetId, deposit.quantity])
    res.status(201)
})
