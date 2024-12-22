import {Request, Response} from 'express'
import { ClassModel } from '../models/Users'
import { validation } from '../middleware/classValidate'
export const getClass = async (req: Request, res: Response) => {
    try {
        const classes = await ClassModel.find()
        res.json(classes)
    } catch(error) {
        res.status(500).json({message:"erro ao obter a turma"})
    }
}

export const createClass = async (req: Request, res: Response ):Promise<any> => {
    try{
        const validate = await validation(req)
        if (validate) {
            return res.status(500).json({message: "Turma já existe"})
        }
        const newClass = new ClassModel(req.body)
        await newClass.save()
        
        res.status(200).json({message: "Turma criada com sucesso"})

    } catch(error){
        console.log(error)
        res.status(500).json({message: "Erro ao criar turma"})
    }
}

export const delClass = async (req: Request, res: Response ):Promise<any> => {
    try{
        const { name } = req.body
        const result = await ClassModel.deleteOne({name})
        if (result.deletedCount === 0) return res.status(404).json({message: "Turma não encontrada"})
        return res.status(200).json({message: "Turma deletada com sucesso"})
    } catch(error){
        res.status(500).json({message: "Erro ao deletar turma"})
    }
}

/* ---- modelo criação -----
new ClassModel({
            series: "8ª Série",
            name: "Turma A",
            students: [ // IDs dos alunos
                new mongoose.Types.ObjectId("63f23456789abcdef0123456"),
                new mongoose.Types.ObjectId("63f3456789abcdef01234567"),
            ],
            contents: [savedContent], // Conteúdo adicionado à turma
        });
*/