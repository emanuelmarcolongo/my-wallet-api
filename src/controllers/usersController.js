import { depositSchema, sessionCollection, signinSchema, signupSchema, transactionsCollection, usersCollection } from "../app.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';
import dayjs from "dayjs";




export async function postSignUp (req, res) {

    const user = req.body;

    const validation = signupSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    if (user.password !== user.confirmpassword) {
        return res.status(409).send("As senhas devem ser iguais")
    }

    try {
        const userExists = await usersCollection.findOne({ email: user.email})
    
        if (userExists){ 
            return res.status(409).send("email cadastrado")
        }

        const hashPassword = bcrypt.hashSync(user.password, 10);

        delete user.confirmpassword
        await usersCollection.insertOne({...user, password: hashPassword})

        res.sendStatus(200);
        
    } catch (err) {
        return res.sendStatus(500)
    }
}

export async function postSignIn (req, res) {
    const user = req.body;

    const validation = signinSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    try {
        const userExists = await usersCollection.findOne ({ email: user.email});

        if (!userExists) {
            return res.status(404).send("E-mail não encontrado, por favor faça seu cadastro")
        }
    
        if (bcrypt.compareSync (user.password, userExists.password)) {
            
            const session = await sessionCollection.findOne({userId: userExists._id})
    
            if (session) {
                return res.status(201).send(session.token);
            }
    
            const token = uuidV4();
    
            await sessionCollection.insertOne({
                userId: userExists._id,
                token
            })
    
            return res.status(201).send(token);
        } else {
            return res.status(401).send("Senha incorreta")
        }
    } catch (err) {
        return res.status(500).send(err);
    }
    

}

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
        time: dayjs().format('DD-MM-YYYY HH:mm')
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
        time: dayjs().format('DD-MM-YYYY HH:mm')
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