import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";


import  {postSignIn, postSignUp} from "./controllers/usersController.js";
import { newDeposit, newWithdraw, userHistory } from "./controllers/transactionsController.js";



const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

export const signupSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
    confirmpassword: joi.string().required().min(3)
})

export const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

export const depositSchema = joi.object({
    value: joi.number().required().min(1),
    description: joi.string()
})


const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
await mongoClient.connect();
} catch (err) {
console.log("Erro no mongo.conect", err.message);
}

db = mongoClient.db("myWallet");
export const usersCollection = db.collection("users");
export const transactionsCollection = db.collection("transactions");
export const sessionCollection = db.collection("sessions");

// ROTAS:

app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);

app.post("/deposit", newDeposit);

app.post("/withdraw", newWithdraw);

app.get("/history", userHistory);



const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));

