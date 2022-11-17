import { depositSchema, sessionCollection, transactionsCollection} from "../app.js";
import dayjs from "dayjs";


export async function newDeposit (req, res) {
    const { authorization } = req.headers;
    const { value, description} = req.body;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }

    const validation = depositSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    const token = authorization.replace("Bearer ", "");

    const user = await sessionCollection.findOne({token: token})
    if (!user) {
        return res.status(401).send("Token inválido")
    }

    const deposit = {
        userId: user.userId,
        token,
        value,
        description,
        type: "Deposit",
        time: dayjs().format('DD-MM')
    }

    await transactionsCollection.insertOne(deposit)
   
    res.status(200).send(token)
}

export async function newWithdraw (req, res) {
    const { authorization } = req.headers;
    const { value, description} = req.body;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }

    const validation = depositSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    const token = authorization.replace("Bearer ", "");

    const user = await sessionCollection.findOne({token: token})
    if (!user) {
        return res.status(401).send("Token inválido")
    }

    const deposit = {
        userId: user.userId,
        token,
        value,
        description,
        type: "Withdraw",
        time: dayjs().format('DD-MM')
    }

    await transactionsCollection.insertOne(deposit)
   
    res.status(200).send(token)
}

export async function userHistory (req, res) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }

    const token = authorization.replace("Bearer ", "");

    const user = await sessionCollection.findOne({token: token})
    if (!user) {
        return res.status(401).send("Token inválido")
    }

    const userTransactions = await transactionsCollection.find({token: token}).toArray()
   
    res.status(200).send([...userTransactions].reverse());
}