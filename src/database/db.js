import { MongoClient} from "mongodb";
import dotenv from "dotenv";
dotenv.config();


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