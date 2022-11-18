import joi from "joi"


export const signupSchema = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required().min(3),
    confirmpassword: joi.string().required().min(3)
})

export const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
})

export const depositSchema = joi.object({
    value: joi.number().required().min(1),
    description: joi.string()
})