import {Request, Response} from 'express'
import { ContentModel, ClassModel } from '../models/Users'
import { modifyContent } from '../services/contentService'

export const getContent = async (req: Request, res:Response):Promise<any> => {
    try {
        const content = await ContentModel.find()
        res.json(content)
    }catch(error) {
        console.log(error)
        return res.status(500).json({message: "Erro ao achar conteudo"})
    }
}
export const createContent = async (req: Request, res:Response):Promise<any> => {
    try {
        const {name, teacher, ClassID} = req.body
        const newContent = new ContentModel({name, teacher});

        const updateClass = await ClassModel.findByIdAndUpdate(
            ClassID,
            {$push: { contents: newContent}},
            { new: true}
        )
        
        if(!updateClass) {
            return res.status(400).json({ message: "Classe não atualizada"})
        } else {
            return res.status(200).json({message: "Classe atualizada com sucesso"})
        }
    } catch(error) {
        console.log(error)
        return res.status(500).json({message: "Erro ao criar conteudo"})
    }
}

export const delContent = async (req: Request, res:Response):Promise<any> => {
    try{
        const { name } = req.body
        const result = await ContentModel.deleteOne({name})
        if (result.deletedCount === 0) return res.status(404).json({message: "Conteudo não encontrada"})
        return res.status(200).json({message: "Conteudo deletada com sucesso"})
    } catch(error){
        res.status(500).json({message: "Erro ao deletar conteudo"})
    }
}

export const changeContent = async (req:Request, res:Response):Promise<any> => {
    try {
        const result = await modifyContent(req.body)
        if(!result.sucess) res.status(400).json({message:result.message})
            else res.status(200).json({message:result.message})
    }catch(error){
        res.status(500).json({message: "Erro ao modificar conteudo"})
    }
}

/*  ---- modelo de criação ---------
    name: "Matemática",
    teacher: new mongoose.Types.ObjectId("63f123456789abcdef012345")
*/