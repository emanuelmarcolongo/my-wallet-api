import express from "express"
import { postSignIn, postSignUp } from "../controllers/usersController.js";
import { signInValidate, signUpValidate } from "../middlewares/validationMiddleware.js";


const userRouter = express.Router();

userRouter.post("/sign-up",signUpValidate, postSignUp);

userRouter.post("/sign-in", signInValidate, postSignIn);

export default userRouter;