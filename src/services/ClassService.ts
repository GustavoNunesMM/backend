import { changeModel } from '../middleware/modifyModel'
import { errorHandler } from '../middleware/error'
import { ClassModel } from '../models/Users'

// Altera a turma 
export const changeClass = async(data):Promise<resultInterface> => { 
    try {
        const result = await changeModel(data, ClassModel)

        return errorHandler(result)
    }catch(error) {
        return {sucess:false, message:"Erro interno do servidor", error}
    }
}

//Deleta a turma
export const deleteClass = async(data):Promise<resultInterface> => { 
    try {
        const result = await ClassModel.deleteOne(data._id)
        if (result.deletedCount === 0) return {sucess: false, message:"Turma não encontrada" }
            else return {sucess:true, message: "Turma deletada com sucesso"}
            
    } catch(error) {
        return {sucess:false, message: "Erro interno do servidor", error}
    }
    
}


interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}