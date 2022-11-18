import { depositSchema, signinSchema, signupSchema } from "../schemas/validationSchemas.js";


export async function signUpValidate (req, res, next) {

    const user = req.body;

    const validation = signupSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    if (user.password !== user.confirmpassword) {
        return res.status(409).send("As senhas devem ser iguais")
    }
    
    next();
}

export async function signInValidate(req, res, next) {
    const user = req.body;


    const validation = signinSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    next();
}

export async function depositValidate(req, res, next) {
    const { authorization } = req.headers;
    const { value, description} = req.body;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }

    const validation = depositSchema.validate(req.body, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    next();
}

export async function headersAuthorizationValidate (req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).send("Headers authorization inválido")
    }

    next();
}

