import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'

export const jwtAuth = async (req:Request, res:Response): Promise<any> => {
    const token = req.cookies.token
    if (!token) { //verifica se o token existe
        return res.status(401).json({ isAuthenticated: false})
    }
    console.log("Verificação de token")
    jwt.verify(req.cookies.token, SECRET_KEY, (err: any, decoded:any) => {
        if (!err) return res.status(200).json({isAuthenticated:true, user:decoded})
            else return res.status(401).json({isAuthenticated: false})
    })
}
