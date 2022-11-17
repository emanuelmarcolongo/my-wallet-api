import { signupSchema, usersCollection } from "../app.js";
import bcrypt from "bcrypt";

export async function postSignUp (req, res) {

    const user = req.body;

    const validation = signupSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    if (user.password !== user.confirmpassword) {
        return res.status(409).send("As senhas devem ser iguais")
    }

    try {
        const userExists = await usersCollection.findOne({ email: user.email})
    
        if (userExists){ 
            return res.status(409).send("email cadastrado")
        }

        const hashPassword = bcrypt.hashSync(user.password, 10);

        delete user.confirmpassword
        await usersCollection.insertOne({...user, password: hashPassword})

        res.sendStatus(200);
        
    } catch (err) {
        return res.sendStatus(500)
    }
}

export async function postSignIn (req, res) {

}