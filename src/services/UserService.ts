import { UserModel } from "../models/Users";
import {validation} from '../middleware/userValidate'
import bcrypt from 'bcrypt'

export const createNewUser = async (userData:userData) => {
    if(!validation(userData)) return {sucess:false, status:400, message:"Dados inválidos"}
    try {
        const hashedData = await hashPassword(userData)
        const newUser = new UserModel(hashedData)
        await newUser.save()
        
        return {sucess:true, userId:newUser._id}
    } catch(error) {
        console.log(error)
        return {sucess:false, status:500, message:"Erro ao criar usuario"}
    }
}

export const deleteUserByEmail = async(email:string) => {
    const result = await UserModel.deleteOne({email})
    if (result.deletedCount===0) return {sucess:false, message:"Usuario não encontrado"}
    return {sucess:true, message:"usuario deletado no email:", email}
}

const hashPassword = async (userData:userData) => {
    const { password, ...rest } = userData
    const saltRound = await bcrypt.genSalt(15)
    const hashPass = await bcrypt.hash( password , saltRound)
    const newData = {...rest, password:hashPass}
    return newData
}

interface userData {
    username: string,
    password: string,
    confirmPassword: string,
    email: string,
    permissionLevel: string,
    ClassID: string
}