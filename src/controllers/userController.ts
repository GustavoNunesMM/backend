import { NextFunction, Request, Response } from 'express';
import { UserModel, ContentModel } from '../models/Users';
import {createNewUser} from '../services/UserService'


// Controlador para obter todos os usuários
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find(); // Encontrando todos os usuários
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter usuários', error });
    }
}

export const createUser = async (req: Request, res: Response):Promise<any> => {
    try {
        const result = await createNewUser(req.body)

        if(result.sucess) {
            res.status(200).json({message: result.message})
        }
        return res.status(400).json({message: result.message})

    } catch(error) {
        return res.status(500).json({message: "Erro interno da aplicação", error})
    }
}

export const delUser = async (req: Request, res: Response):Promise<any> => {
    try {
        const { email } = req.body
        const result = await UserModel.deleteOne({email})
        if (result.deletedCount === 0 ) return res.status(404).json({ message: 'Usuário não encontrado' })
        return res.status(200).json({ message: 'Usuário deletado com sucesso' })
    }catch(error) {
        return res.status(500).json({ message: 'Erro ao deletar usuário', error })
    }
}


/*---- modelo criação -----
new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    permissionLevel: {
        type: String,
        enum: Object.values(PermissionLevel),
        required: true,
    },
    savedSettings: { type: Schema.Types.Mixed, default: {} },
});
*/