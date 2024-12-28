import { changeModel } from '../middleware/modifyModel'
import { StudentClassModel } from '../models/Users'
//verificar se é necessario atualizar ou adicionar
export const changeClass = async(data):Promise<resultInterface> => {
    try {
        const result = await changeModel(data, StudentClassModel)
        console.log(result.message)

        if (result.sucess) return {sucess:true, message:"Classe alterada com sucesso"}
            else return {sucess:false, message:"Erro ao alterar classe"}
    }catch(error) {
        return {sucess:false, message:"Erro interno do servidor", error}
    }
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}
