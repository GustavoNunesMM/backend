import { ClassModel} from '../models/Users'

//verificar se é necessario atualizar ou adicionar
export const changeClass = async(data):Promise<resultInterface> => {
    try {
        const { changes } = data

        const operationFilter =  changes.reduce((acc, change)=>{
            const [operation, field] = Object.entries(change)[0] as [string, any]
            acc.push({[operation]: field})
            return acc
        },[]) 

        const response = operationMap(operationFilter, data._id)
        console.log(response)
        return {sucess:true, message:"Classe alterada com sucesso"}
    }catch(error) {
        return {sucess:false, message:"Erro ao alterar classe:", error}
    }
}


const operationMap= (operationArray, _id) => {
    let acc:number = 0
    const result = operationArray.map(async (operation, index) => {
        const count =  await querry(_id, operation)
        console.log("index",index,"acc", acc)
        count ? acc += 1: null

        if (acc == index+1) console.log("Operação concluida", acc)
            else console.log("A operação de numero", index, operation, "não foi concluida")
        return count
    })

}

const querry = async (_id, operation) =>{
    const response = await ClassModel.findByIdAndUpdate(
        _id,
        operation,
        {new: true, runValidators:true}
    )
    console.log("alo ",response)
    return response
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}
