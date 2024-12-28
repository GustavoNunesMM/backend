import { ContentModel, ClassModel, StudentClassModel } from "../models/Users";
import { changeModel } from "../middleware/modifyModel";
import mongoose from "mongoose";

export const modifyContent = async(data) => {
    try {
        const result = await changeModel(data, ContentModel)
        return result
    } catch(error) {
        return {sucess:false, message: "Erro ao modificar conteudo", error }
    }
}

export const deleteContent = async(data) => {
    const session = await mongoose.startSession(); // Inicia uma sessão
    session.startTransaction(); // Inicia a transação
    try{
        const result = await ContentModel.deleteOne({_id: data._id})
        if (result.deletedCount === 0) return {sucess:false, message: "Conteudo não encontrada"}

        const studentRemove = RemoveContent(
            data._id, 
            StudentClassModel, 
            {"terms.content": data._id}, 
            { terms: { content: data._id } } 
        )
        if(!studentRemove) session.abortTransaction()
        
        
        const classRemove = RemoveContent(
            data._id,
            ClassModel,
            {"contents": data._id},
            { content: data._id }
        )
        if(!classRemove) session.abortTransaction()

        

        await session.commitTransaction()

        return {sucess:true, message: "Conteudo deletada com sucesso"}

    } catch(error){
        await session.abortTransaction()
        return {sucess:false, message: "Erro ao deletar conteudo", error}
    } finally {
        session.endSession()
    }
}

const RemoveContent = async (_id, model, filter, element):Promise<boolean> => {
    let removed:boolean
    const {acknowledged, matchedCount, modifiedCount} = await model.updateMany(
        filter, // Condição para encontrar o contentId
        { $pull: element } // Remove o termo correspondente
    )
    console.log("Remover conteudo de", filter ,acknowledged, matchedCount, modifiedCount)
    matchedCount == modifiedCount && acknowledged?removed = true: removed = false
    return removed
}