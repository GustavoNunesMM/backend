import { Response } from "express"
export const errorHandler = async (result:resultInterface):Promise<resultInterface> => {
    const { sucess, message, error } = result
    if (sucess) return {sucess,  message}
    if (error) return {sucess, message, error}
        else return {sucess, message}
}

export const responseServer = async(result:resultInterface, res:Response) => {
    if (result.sucess) return res.status(200).json({ message: result.message })
    if (result.error) return res.status(500).json({message: "Erro interno do servidor"})
        return res.status(404).json({message: result.message})
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}
