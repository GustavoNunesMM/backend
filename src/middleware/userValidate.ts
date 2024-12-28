import { Request, Response } from 'express';
import { UserModel } from '../models/Users';


export const validation = async (data: userData) => {
    const {username, email, password, permissionLevel, ClassID, savedSettings, confirmPassword} = data
    
    if (username.length <= 3) return {sucess: false, message: "Nome do usuario muito curto"}
    const countUsername = await UserModel.countDocuments({'username': username})
    if (countUsername >= 1 ) return {sucess:false, message: "Nome já utilizado"}

    const countEmail = await UserModel.countDocuments({'email': email})
    if (!email.includes('@')) return {sucess: false, message: "Formato do e-mail incorreto"}
    if (countEmail >= 1 ) return {sucess:false, message: "Email já utilizado"}

    if (confirmPassword && confirmPassword != password) return {sucess:false, message: "Senha e Confirmação de senha divergentes"}

    return {sucess:true, message: "Perfil de usuario valido"}
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