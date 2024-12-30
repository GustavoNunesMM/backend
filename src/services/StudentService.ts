import mongoose from 'mongoose'
import { ClassModel, StudentClassModel } from '../models/Users'
import { createNewUser } from './UserService'
import { changeClass } from './ClassService'
import { changeModel } from '../middleware/modifyModel'
import { errorHandler } from '../middleware/error'

export const createStudentHandler = async(data:any) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { contents } = await ClassModel 
                    .findById(data.ClassID) //seleciona dentro da turma do id = ClassID
                    .populate('contents', '_id name') // Os conteudos, puxando id e nome

        data.permissionLevel = 'aluno' //define a permissão como aluno

        const userResult = await createNewUser(data) //neste bloco cria um novo usuario e avalia se ouve sucesso, caso contrario interrompe o processo
        if(!userResult.sucess) {
            await session.abortTransaction()
            return {sucess: false, message: userResult.message}
        }
        const requestAddStudent = { 
            _id:data.ClassID, 
            changes: [{"$push": {"students": String(userResult.userId)}}]
        }

        const classResult = await changeClass(requestAddStudent) //Adiciona na turma o user, caso contrario interrompe o processo
        if (!classResult.sucess) {
            await session.abortTransaction()
            return {sucess:false, message: classResult.message}
        }

        const studentClass = new StudentClassModel({ //Cria a relação aluno classe, definindo o aluno, a classe que ele pertence, e o desempenho
            student:userResult.userId,
            Class:data.ClassID,
            terms: contents.map((contentId) => ({
                content:contentId,
                bimesters: generateBimester()
            }))})
        await studentClass.save({ session })
        await session.commitTransaction()
        return {sucess:true, message: "Aluno criado com sucesso"}

    }   catch(error) {
            await session.abortTransaction()
            return {sucess: false, message: 'Erro ao criar um aluno', error}
        } finally {
            session.endSession()
        }
} 

export const deleteStudentHandler = async (studentId: string) => {
    const result = await StudentClassModel.deleteOne({ _id: studentId });
    if (result.deletedCount === 0) return { sucess: false, message: 'Aluno não encontrado' };
    return { sucess: true, message: "Aluno deletado com sucesso" };
};

export const modifyStudent = async (data) => {
    try {
        const newData = verifyPush(data)
        const result = await changeModel(newData, StudentClassModel)
        return result
    } catch(error) {
        return {sucess:false, message:"Erro interno do sistema", error}
    }
}

const verifyPush = (data) => {
    let newData = data
    for (const [index, operation] of data.changes.entries()) {
        try {
            operation.$push.terms.bimesters.length == 0? newData.changes[index].$push.terms.bimesters = generateBimester(): console.log("null") 
        } catch(error){
            console.log(error)
        }
    }
    return newData
}

const generateBimester = () => {
    return (
        Array(4).fill('').map((_, index) => ({
            name: `Bimestre ${index + 1}`,
            grades: [],
            attendence: 0,
            maxgrade: 25
        }))
    )
}