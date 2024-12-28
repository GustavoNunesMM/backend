import {NextFunction, Request, Response} from 'express'
import { StudentClassModel } from '../models/Users'
import { createStudentHandler, deleteStudentHandler, modifyStudent } from '../services/StudentService'
import { responseServer } from '../middleware/error'
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
        
        responseServer(result, res)
    } catch(error) {
        console.error("Erro ao criar aluno:", error);
        return res.status(500).json({ message: 'Erro ao criar aluno', error });
    }   
}

export const delStudent = async(req:Request, res:Response):Promise<any> => {
    try {
        const result = await deleteStudentHandler(req.body._id)
        responseServer(result, res)
    } catch(error) {
        return res.status(500).json({ message: 'Erro ao deletar aluno', error })
    }
}

export const changeStudent = async(req:Request, res:Response):Promise<any> => {
    try{
        const result = await modifyStudent(req.body)
        responseServer(result, res)
    } catch(error){
        return res.status(500).json({message: "Erro ao modificar aluno", error})
    }
}

/* Requisições do tipo $push devem ter o formato de:
{
	"_id": "67678aef518bd7c188575111",
    "changes": [
        {"$push": {"terms": {"content": "67703aadea1d2a6cac90c088", "bimesters": []} }}
    ]
}
*/
/*---- modelo criação -----
new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    terms: { type: [TermSchema], default: [] }, // 4 Bimestres com notas e presenças
})
*/
