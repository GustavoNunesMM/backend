export const changeModel = async(data: dataInterface, model):Promise<resultInterface> => {
    try {
        const { changes } = data

        const operationFilter =  changes.reduce((acc, change)=>{ //realiza reduce em cima das alterações para concatenar o array por operação
            const [operation, field] = Object.entries(change)[0] as [string, any]
            acc.push({[operation]: field})
            return acc
        },[]) 

        const result = operationMap(operationFilter, data._id, model) //Realiza map sobre as operações, para suporte de multiplas simultaneas

        if (!result.sucess) return {sucess:false, message: result.message}
            else return {sucess:true, message: result.message}
    }catch(error) {
        return {sucess:false, message:"Erro interno", error}
    }
}


const operationMap= (operationArray:Operation[], _id:string, model) => {
    let acc:number = 0
    const numberOfOperations =  operationArray.length+1

    operationArray.forEach(async (operation:Operation, index:number) => {
        const count =  await querry(_id, operation, model)
        count ? acc += 1: null

        if (acc == index+1) console.log("Operação concluida", acc)
            else console.log("A operação de numero", index, operation, "não foi concluida")
        
    })
    if (acc >= 1) return {sucess:true, message: `Foram realizadas ${acc} operações de ${numberOfOperations}`}
        else return {sucess:false, message: "Não foi realizada nenhuma operação"}
}

const querry = async (_id:string, operation:Operation, model) =>{ //Realiza a querry para cada operação solicitada
    const response = await model.findByIdAndUpdate(
        _id,
        operation,
        {new: true, runValidators:true}
    )
    return response
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}

interface dataInterface {
    _id: string,
    changes: Operation[]
}

type OperationType = "$set" | "$pull" | "$push"; // Operações possíveis

type Operation = {
  [operation in OperationType]?: Record<string, string>; // Chaves são operações, valores são objetos com strings
}
