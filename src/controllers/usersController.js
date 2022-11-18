import bcrypt from "bcrypt";
import { v4 as uuidV4 } from 'uuid';
import { sessionCollection, usersCollection } from "../database/db.js";
import { signinSchema, signupSchema } from "../schemas/validationSchemas.js";


export async function postSignUp (req, res) {

    const user = req.body;


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
    const user = req.body;


    const validation = signinSchema.validate(user, {abortEarly: false});

    if(validation.error) {
        const errors = validation.error.details.map((i) => i.message);
        return res.status(422).send(errors);
    }

    try {
        const userExists = await usersCollection.findOne ({ email: user.email});

        if (!userExists) {
            return res.status(404).send("E-mail não encontrado, por favor faça seu cadastro")
        }
    
        if (bcrypt.compareSync (user.password, userExists.password)) {
            
            const session = await sessionCollection.findOne({userId: userExists._id})
    
            if (session) {
                return res.status(201).send(session.token);
            }
    
            const token = uuidV4();
    
            await sessionCollection.insertOne({
                userId: userExists._id,
                token
            })
    
            return res.status(201).send(token);
        } else {
            return res.status(401).send("Senha incorreta")
        }
    } catch (err) {
        return res.status(500).send(err);
    }
    

}



