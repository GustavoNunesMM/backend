import { bcrypt } from '../index'

export const encryptPass = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

export const verifyPass = async (password: string, hashedPassword: string): Promise<boolean> => {
    const validPassword:boolean = await bcrypt.compare(password, hashedPassword)
    return validPassword
}