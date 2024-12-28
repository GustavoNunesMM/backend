import { UserModel } from "../models/Users";
import {validation} from '../middleware/userValidate'
import bcrypt from 'bcrypt'
import { changeModel } from "../middleware/modifyModel";

export const createNewUser = async (userData:userData) => {
    const valid = await validation(userData)
    if(!valid.sucess) return {sucess:false, message:valid.message}
    try {
        const hashedData = await hashPassword(userData)
        const newUser = new UserModel(hashedData)
        await newUser.save()
        
        return {sucess:true, message:"Usuario criado com sucesso" ,userId:newUser._id}
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

export const changeUser = async(userData) => {
    try {
        const result = await changeModel(userData, UserModel)
        return result
    } catch(error) {
        return {sucess:false, message: "Falha ao alterado usuario", error}
    }
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
    confirmPassword?: string,
    email: string,
    savedSettings?: string[],
    permissionLevel: string,
    ClassID?: string
}
