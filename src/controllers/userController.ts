import { prisma } from '../index';
import { Request, Response } from 'express';
import { changeModel } from '../services/modifyModel'
import { updateRelations } from '../services/modifyRelations'
import { bcrypt } from '../index'


export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' })
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {id: Number(id)},
            include: {contents:true ,class: true}
        });
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' })
    }
};

export const createUser = async (req: Request, res: Response) => {
    const data = req.body
    try {
        const salt = await bcrypt.genSalt(10) // Usar 10 como padrão
        const hashedPassword = await bcrypt.hash(data.password, salt)
        data.password = hashedPassword
        console.log("data",data)
        const User = await prisma.user.create({
            data,
        })
        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', err })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    let { id } = req.body
    try {
        const result = await prisma.user.deleteMany({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', err });
    }
}

export const updateUser = async(req:Request, res:Response):Promise<any> => {
    try{ 
        const {_id, newRelatedIds, relationModel, changes } = req.body
        let resultRelations:resultInterface = { message: '', sucess: false };
        let resultModify:resultInterface = { message: '', sucess: false };
        if(changes) resultModify = await changeModel({_id, changes}, "user")
        if(resultModify.error) return res.status(500).json({message: 'Erro ao modificar usuario', error: resultModify.error})
        
        if (relationModel == "UserContent"){
            console.log("UserContent")
            resultRelations = await updateRelations(
                Number(_id),
                newRelatedIds,
                'UserContent',
                'userId',
                'ContentId'
            )
        }
        if ( resultRelations.error) return res.status(500).json({ message:"Erro ao modificar relações", error: resultRelations.error})
        if ( resultRelations.sucess || resultModify.sucess) {
            return res
                .status(200)
                .json({message: `Alteração nas relações realizada com ${resultRelations.sucess} e alteração no modelo realizada com ${resultModify.sucess}`})
        } else {
            res.status(500).json({ message: "Não foram realizadas operações" })
        }
    }catch(err) {
        res.status(500).json({ error: 'Falha ao atualizar usuario', err })
    }
}
interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}
/*
    _id: number,
    newRelatedIds: number[],
    relationModel: string,
    changes: [
    {operations: string, field: string},
    {operations: string, field: string}]
  */
