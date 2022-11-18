import express from "express";
import { newDeposit, newWithdraw, userHistory } from "../controllers/transactionsController.js";
import { depositValidate, headersAuthorizationValidate } from "../middlewares/validationMiddleware.js";


const router = express.Router();

router.post("/deposit",  depositValidate , newDeposit);

router.post("/withdraw", depositValidate, newWithdraw);

router.get("/history", headersAuthorizationValidate , userHistory);

export default router;