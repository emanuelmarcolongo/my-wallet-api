import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transactionRouter from "./routes/transactionRouter.js";
import userRouter from "./routes/userRouter.js";


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(transactionRouter);
app.use(userRouter);


const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));

