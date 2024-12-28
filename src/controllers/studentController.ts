import {NextFunction, Request, Response} from 'express'
import { StudentClassModel } from '../models/Users'
import { createStudentHandler, deleteStudentHandler } from '../services/StudentService'

export const getStudent = async (req:Request, res:Response) => {
    try{
        const student = await StudentClassModel.find()
        res.json(student)
    } catch(error) {
        res.status(500).json({message:"Erro ao obter alunos", error})
    }
}

export const createStudent = async(req:Request, res:Response, next:NextFunction):Promise<any> => {
    try {
        const result = await createStudentHandler(req.body)
        if (!result.sucess) return res.status(400).json({message:result.message})
        res.status(201).json({message:"Aluno criado com sucesso!"})
    } catch(error) {
        console.error("Erro ao criar aluno:", error);
        return res.status(500).json({ message: 'Erro ao criar aluno', error });
    }   
}

export const delStudent = async(req:Request, res:Response):Promise<any> => {
    try {
        const result = await deleteStudentHandler(req.body._id)
        if (result.success) return res.status(404).json({ message: 'Aluno não encontrado' })
        return res.status(200).json({ message: 'Aluno deletado com sucesso' })

    } catch(error) {
        return res.status(500).json({ message: 'Erro ao deletar aluno', error })
    }
}


/*---- modelo criação -----
new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    terms: { type: [TermSchema], default: [] }, // 4 Bimestres com notas e presenças
})
*/
