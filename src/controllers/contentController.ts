import {Request, Response} from 'express'
import { ContentModel, ClassModel } from '../models/Users'
import { modifyContent, deleteContent } from '../services/contentService'
import { responseServer } from '../middleware/error'

export const getContent = async (req: Request, res:Response):Promise<any> => {
    try {
        const content = await ContentModel.find()
        res.status(200).json(content)
    }catch(error) {
        return res.status(500).json({message: "Erro ao achar conteudo"})
    }
}
export const createContent = async (req: Request, res:Response):Promise<any> => {
    try {
        const {name, teacher} = req.body
        const newContent = new ContentModel({name, teacher});
        await newContent.save()
        console.log(newContent)
/*
        const result = await ClassModel.findByIdAndUpdate(
            ClassID,
            {$push: { contents: newContent}},
            { new: true}
        )
*/
        return res.status(200).json({ message: "Conteudo atualizado"})
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Erro ao criar conteudo"})
    }
}

export const delContent = async (req: Request, res:Response):Promise<any> => {
    const result = await deleteContent(req.body)
    responseServer(result, res)
}

export const changeContent = async (req:Request, res:Response):Promise<any> => {
    const result = await modifyContent(req.body)
    responseServer(result, res)
}

/*  ---- modelo de criação ---------
    name: "Matemática",
    teacher: new mongoose.Types.ObjectId("63f123456789abcdef012345")
*/