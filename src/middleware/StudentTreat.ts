import {NextFunction, Request, Response} from 'express'
import { ClassModel, StudentClassModel, UserModel } from '../models/Users'
import { validation, passCaching } from '../middleware/userVerify'
import mongoose from 'mongoose'

export async function contentSearch(ClassID: mongoose.Types.ObjectId):Promise<any>  {
    const data = await ClassModel
                .findById(ClassID)
                .populate('contents', '_id name'); // Especifica os campos que deseja trazer
    return data
}

export const createUser = async (req: Request, res: Response):Promise<any> => {
    try {
        if(!validation(req.body)) return
        
        const user = await passCaching(req)
        const newUser = new UserModel(user)
        await newUser.save()
        console.log("Aluno criado com sucesso")
        return true

    } catch(error) {
        return res.status(500)
    }
}

export async function createStudentClass(res:Response, studentId: mongoose.Types.ObjectId, classId: mongoose.Types.ObjectId, contents: mongoose.Types.ObjectId[]):Promise<any> {
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
        Class: classId,         
        terms
    })
    await studentClass.save();    
}

