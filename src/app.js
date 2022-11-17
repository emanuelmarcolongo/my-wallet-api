import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const signupSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
    confirmpassword: joi.string().required().min(3)
})

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

db = mongoClient.db("myWallet");
const usersCollection = db.collection("users");
const transactionsCollection = db.collection("transactions");

// ROTAS:

app.post("/sign-up", async (req, res) => {

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
})

const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));