import {NextFunction, Request, Response} from 'express'
import { ClassModel, StudentClassModel, UserModel } from '../models/Users'
import {createUser} from './userController'
import mongoose from 'mongoose'

export const getStudent = async (req:Request, res:Response) => {
    const student = await StudentClassModel.find()
    res.json(student)
}

export const createStudent = async(req:Request, res:Response):Promise<any> => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const data = req.body
        data.permissionLevel = 'aluno'

        const userCreated = await createUser(req, res);
        if (!userCreated) return res.status(400).json({ message: 'Erro ao criar usuário' })
            else console.log("Aluno cadastrado com sucesso")

        const {content} = await contentSearch(req.body.ClassID)

        const student = await UserModel.findOne({ username: req.body.username });
        if (!student) return res.status(404).json({ message: 'Usuário não encontrado' });

        console.log(student)
        await createStudentClass(res, student.id, data.ClassID,  content)

        return res.status(200).json({
            success: true,
            message: "Aluno cadastrado com sucesso!",
            data: { studentId: student.id },
        })
        
    } catch(error) {
        console.error("Erro ao criar aluno:", error);
        await session.abortTransaction();
        return res.status(500).json({ message: 'Erro ao criar aluno', error });
    } finally {
        session.endSession();
    }
    
}
export const addContent = async(req:Request, res:Response):Promise<any> => {
    try {
        
    }catch (error){
        console.log(error)
        res.status(500).json(error)
    }
}
export const delStudent = async(req:Request, res:Response):Promise<any> => {
    try {
        const { _id } = req.body
        const result = await StudentClassModel.deleteOne({_id})
        console.log(result)
        if (result.deletedCount === 0 ) return res.status(404).json({ message: 'Aluno não encontrado' })
        return res.status(200).json({ message: 'Aluno deletado com sucesso' })

    } catch(error) {
        return res.status(500).json({ message: 'Erro ao deletar aluno', error })
    }
}

async function contentSearch(ClassID: mongoose.Types.ObjectId):Promise<any>  {
    console.log(ClassID)
    const data = await ClassModel
                .findById(ClassID)
                .populate('contents', '_id name'); // Especifica os campos que deseja trazer
    return data
}

async function createStudentClass(res:Response, studentId: mongoose.Types.ObjectId, classId: mongoose.Types.ObjectId, contents: mongoose.Types.ObjectId[]):Promise<any> {
    console.log( "olá mundo",contents)
    const terms = contents.map((contentId) => ({         
        content: contentId,         
        bimesters: Array(4).fill('').map((_, index) => ({             
            name: `Bimestre ${index + 1}`,             
            grades: [],             
            attendance: 0,             
            maxGrade: 25,         
            })),     
        }));      
    const studentClass = new StudentClassModel({         
        student: studentId,         
        class: classId,         
        terms
    })
    await studentClass.save();    
}

/*
async function createStudentClass(studentId: string, classId: string, contents: mongoose.Types.ObjectId[]) { 
 const terms = contents.map((contentId) => ({         
  content: contentId,         
  bimesters: Array(4).fill().map((_, index) => ({             
   name: `Bimestre ${index + 1}`,             
   grades: [],             
   attendance: 0,             
   maxGrade: 25,         
  })),     
 }));      
 const studentClass = new StudentClassModel({         
  student: studentId,         
  class: classId,         
  terms,     });      
 await studentClass.save();     
 return studentClass; 
}
*/
/*---- modelo criação -----
new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    Class: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    terms: { type: [TermSchema], default: [] }, // 4 Bimestres com notas e presenças
})
*/
