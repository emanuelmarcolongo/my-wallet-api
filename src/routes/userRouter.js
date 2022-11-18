import express from "express"
import { postSignIn, postSignUp } from "../controllers/usersController.js";
import { signUpValidate } from "../middlewares/validationMiddleware.js";
// import { postSignIn, postSignUp } from "../controllers/usersController";


const userRouter = express.Router();

userRouter.post("/sign-up",signUpValidate, postSignUp);

userRouter.post("/sign-in", postSignIn);

export default userRouter;