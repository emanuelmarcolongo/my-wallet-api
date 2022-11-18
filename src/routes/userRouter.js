import express from "express";
import { postSignIn, postSignUp } from "../controllers/usersController";

const router = express.Router();

router.post("/sign-up", postSignUp);

router.post("/sign-in", postSignIn);

export default router;