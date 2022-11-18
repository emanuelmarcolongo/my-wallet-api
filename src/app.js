import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import  {postSignIn, postSignUp} from "./controllers/usersController.js";


import transactionRouter from "./routes/transactionRouter.js";



const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(transactionRouter);


app.post("/sign-up", postSignUp);

app.post("/sign-in", postSignIn);



const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));

