import {Request, Response} from 'express'
import { ClassModel } from '../models/Users'
import { validation } from '../middleware/classValidate'
import { addStudent, changeSeries, remStudent } from '../services/ClassStudent' 

export const getClass = async (req: Request, res: Response) => {
    try {
        let classes
        if(req.body._id) classes = await ClassModel.findById(req.body._id)
            else classes = await ClassModel.find()
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
        const { _id } = req.body
        const result = await ClassModel.deleteOne({_id})
        if (result.deletedCount === 0) return res.status(404).json({message: "Turma não encontrada"})
        return res.status(200).json({message: "Turma deletada com sucesso"})
    } catch(error){
        res.status(500).json({message: "Erro ao deletar turma"})
    }
}

export const alterClass = async (req: Request, res: Response):Promise<any> => {
    try{ 
        const { operation, ...data } = req.body
        let result:resultInterface
        switch (operation) {
            case "AddStudent":
                result = await addStudent(data)
                break
            case "RemoveStudent":
                result = await remStudent(data)
                break
            case "ChangeSeries":
                result = await changeSeries(data)
                break
            default: 
                res.status(400).json({sucess: false, message: "Operação invalida"})
    }
        if (result.sucess) {
            return res.status(200).json({message: result.message})
        } else{
            return res.status(400).json({message: result.message})
        }
    } catch(error) {
        res.status(500).json({message: "Erro interno do servidor", error})
    }
    
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
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