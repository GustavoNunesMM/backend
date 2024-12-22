import { Request, Response } from 'express';
import { UserModel } from '../models/Users';
import bcrypt from 'bcrypt'

export const validation = async (req:Request, res: Response) => {
    const {username, email, password, confirmPassword} = req.body

    if (!username  && !email && !password) {
        return res.status(400).json({message: 'Campo(s) em branco'})
    }
    
    const emailExist = await UserModel.findOne({email})
    if (emailExist) {
        res.status(400).json({message: 'E-mail já cadastrado'})
        return false
    }

    const nameExist = await UserModel.findOne({username})
    if (nameExist) {
        res.status(400).json({message:'Nome já cadastrado'})
        return false
    }
    //const VerifyConfPass = req.body.filter(key => key!=="confirmPassword")
    //if (confirmPassword && password!==confirmPassword) return false
    return true
}

export const passCaching = async (req:Request) => {
    const { password } = req.body
    const saltRound = await bcrypt.genSalt(15)
    const hashPassword = await bcrypt.hash(password, saltRound)
    const obj = { ...req.body, password:hashPassword }
    return obj
}