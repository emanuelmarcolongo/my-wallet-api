import express from "express";
import { newDeposit, newWithdraw, userHistory } from "../controllers/transactionsController.js";

const router = express.Router();

router.post("/deposit", newDeposit);

router.post("/withdraw", newWithdraw);

router.get("/history", userHistory);

export default router;