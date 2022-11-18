import express from "express";
import { MongoClient} from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import joi from "joi";
import  {postSignIn, postSignUp} from "./controllers/usersController.js";

// funciona o codigo abaixo
import transactionRouter from "./routes/transactionRouter.js";
// import userControllers from "./routes/userRouter.js"

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(transactionRouter);






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


app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);



const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));

