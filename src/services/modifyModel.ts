import { prisma } from '../index';

export const changeModel = async(data: dataInterface, model:string):Promise<resultInterface> => {
    try {
        const { changes, _id } = data
        const keyFilter =  changes.reduce((acc: any[], change)=>{ //realiza reduce em cima das alterações para concatenar o array por operação
            const [key, field] = Object.entries(change)[0] as [string, any]
            acc.push({[key]: field})
            return acc
        },[]) 
        
        const result = await operationMap(keyFilter, _id, model) //Realiza map sobre as operações, para suporte de multiplas simultaneas
        
        return {sucess:result.sucess, message:result.message}
    }catch(error:any) {
        return {sucess:false, message:"Erro interno", error}
    }
}

const operationMap = async (operationArray:Operation[], _id:string, model:any):Promise<resultInterface> => {
    let acc:number = 0
    const numberOfOperations =  operationArray.length
    console.log("Numero de operações", numberOfOperations)
    for (const [index, operation] of operationArray.entries()) {
        console.log("Operação",index,  operation)
        const count =  await querryAll(_id, operation, model)
        count ? acc += 1: null

        if (acc == index+1) console.log("Operação concluida", acc)
            else console.log("A operação de numero", index, operation, "não foi concluida")
        
    }
    
    if (acc >= 1) return {sucess:true, message: `Foram realizadas ${acc} operações de ${numberOfOperations}`}
        else return {sucess:false, message: "Não foi realizada nenhuma operação"}
}

const querryAll = async (_id:string, operation:Operation, model:string):Promise<boolean> =>{ //Realiza a querry para cada operação solicitada
    try {
        const prismaModel = (prisma as any)[model] //permite um modelo dinamico
        const response = await prismaModel.update({
            where: { id: Number(_id)  },
            data: operation,
        })
        console.log("Resposta", response)
        !response? console.log("Provavel problema de querry"): console.log("Querry executada", response)
        return true
    } catch (error) {
        console.log("Erro ao executar querry", error)
        return false
    }
    
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
