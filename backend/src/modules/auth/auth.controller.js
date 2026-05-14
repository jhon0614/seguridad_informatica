import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";
export async function login(req, res){
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({where: {email}});
    if(!user || !user.isActive){
        return res.status(401).json({message: "Credenciales invalidas"});
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if(!valid){
        return res.status(401).json({message: "Credenciales invalidas"});
    }
    const token = jwt.sign(
        {id: user.id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "1h"},
    );
    return res.json({
        token,
        user: {id: user.id, email: user.email, role: user.role},
    });
}
export async function me(req, res) {
    return res.json({user: req.user});
}