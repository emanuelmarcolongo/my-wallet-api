import { newDeposit, newWithdraw, userHistory } from "../controllers/transactionsController.js";
import express from "express";

const router = express.Router();

router.post("/deposit", newDeposit);

router.post("/withdraw", newWithdraw);

router.get("/history", userHistory);

export default router;