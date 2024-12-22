import { UserModel } from "../models/Users";
import {validation, passCaching} from '../middleware/userVerify'

export const createNewUser = async (userData:any) => {
    if(!validation(userData)) return {sucess:false, status:400, message:"Dados inválidos"}
    try {
        const hashedData = await passCaching(userData)
        const newUser = new UserModel(hashedData)
        await newUser.save()
        
        return {sucess:true, userId:newUser._id}
    } catch(error) {
        return {sucess:false, status:500, message:"Erro ao criar usuario", error}
    }
}

export const deleteUserByEmail = async(email:string) => {
    const result = await UserModel.deleteOne({email})
    if (result.deletedCount===0) return {sucess:false, message:"Usuario não encontrado"}
    return {sucess:true, message:"usuario deletado no email:", email}
}