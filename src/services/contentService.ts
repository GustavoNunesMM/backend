import { ContentModel, ClassModel } from "../models/Users";
import { changeModel } from "../middleware/modifyModel";
export const modifyContent = async(data) => {
    try {
        const result = await changeModel(data, ContentModel)
        return result
    } catch(error) {
        return {sucess:false, message: "Erro ao modificar conteudo", error }
    }
}
