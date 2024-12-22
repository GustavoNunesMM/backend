import { Request, Response } from 'express';
import { UserModel } from '../models/Users';
import bcrypt from 'bcrypt'

export const validation = async ({username, email, password, confirmPassword, ...rest}) => {

    if (!username  && !email && !password) {
        return console.log('Campo(s) em branco')
    }
    
    const emailExist = await UserModel.findOne({email})
    if (emailExist) {
        console.log('E-mail já cadastrado')
        return false
    }

    const nameExist = await UserModel.findOne({username})
    if (nameExist) {
        console.log('Nome já cadastrado')
        return false
    }
    //const VerifyConfPass = req.body.filter(key => key!=="confirmPassword")
    //if (confirmPassword && password!==confirmPassword) return false
    return true
}

export const passCaching = async (data) => {
    const { password } = data
    const saltRound = await bcrypt.genSalt(15)
    const hashPassword = await bcrypt.hash(password, saltRound)
    const obj = { ...data, password:hashPassword }
    return obj
}