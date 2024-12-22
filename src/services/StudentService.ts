import mongoose from 'mongoose'
import { ClassModel, StudentClassModel } from '../models/Users'
import { createNewUser } from './UserService'

export const createStudentHandler = async(data:any) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { contents } = await ClassModel
                    .findById(data.ClassID)
                    .populate('contents', '_id name')
        const userResult = await createNewUser(data)
        
        if(!userResult.sucess) {
            console.log("olá")
            await session.abortTransaction()
            return {sucess: false, message: userResult.message}
        }
        const studentClass = new StudentClassModel({
            student:userResult.userId,
            Class:data.ClassID,
            terms: contents.map((contentId) => ({
                content:contentId,
                bimesters: Array(4).fill('').map((_, index) => ({
                    name: `Bimestre ${index + 1}`,
                    grades: [],
                    attendence: 0,
                    maxgrade: 25
                })
            )}))
        })
        await studentClass.save({ session })
        await session.commitTransaction()
        return {sucess:true, studentId:userResult.userId}

    }   catch(error) {
            await session.abortTransaction()
            return {sucess: false, message: 'Erro ao criar um aluno', error}
        } finally {
            session.endSession()
        }
} 

export const deleteStudentHandler = async (studentId: string) => {
    const result = await StudentClassModel.deleteOne({ _id: studentId });
    if (result.deletedCount === 0) return { success: false, message: 'Aluno não encontrado' };
    return { success: true };
};