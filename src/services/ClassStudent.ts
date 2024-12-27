import { ClassModel, UserModel} from '../models/Users'
export const addStudent = async (data: Student) => {
    try{
        await ClassModel.findByIdAndUpdate(data._id, 
            {$push: { students: data.student}},
            { new: true})
        return {sucess: true, message: 'Turma atualizada com sucesso'}
    } catch(error) {
        return {sucess: false, message: 'Erro ao atualizar a turma', error}
    }
}

export const changeSeries = async(data: changeSeries) => {

    try {
        await ClassModel.findByIdAndUpdate(data._id,
            {$set: {series: data.series}}
        )
        return {sucess: true, message: 'Turma atualizada com sucesso'}
    }catch(error) {
        return {sucess:false, message: 'Erro ao atualizar a turma', error}
    }
}

export const remStudent = async(data: Student) => {
    try{
        const studentName = await UserModel.findById({_id: data.student})
        await ClassModel.findByIdAndUpdate(
            data._id,
            {$pull: {students:data.student}},
            {new: true}
        )
        console.log(studentName)

        return {sucess:true, message: 'Aluno removido com sucesso'}

    }catch(error) {
        return {sucess:false, message: 'Erro ao remover aluno', error}
    }
}

interface changeSeries {
    _id: string,
    series: string 
}
interface Student {
    _id: string,
    student: string
}