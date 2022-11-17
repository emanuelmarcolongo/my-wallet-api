import { transactionsCollection } from "../app";

export async function newDeposit (req, res) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }


    const token = authorization.replace("Bearer ", "");
    res.status(200).send(token)
}