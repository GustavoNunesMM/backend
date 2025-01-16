import { Request, Response } from 'express';
import { prisma } from '../index';
import { changeModel } from '../services/modifyModel'
import { updateRelations } from '../services/modifyRelations'
import { error } from 'console';


export const getClass = async (req: Request, res: Response) => {
    try {
        const classes = await prisma.class.findMany();
        res.status(200).json(classes)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
}

export const getClassById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params
    try {
        const classData = await prisma.class.findUnique({
            where: { id: Number(id) },
            include: { users: true, contents: true }
        });

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getClassData = async (req: Request, res: Response): Promise<any> => {
    const classId = Number(req.params.id);

    try {
        const classDetails = await prisma.class.findUnique({
            where: { id: classId }, // Substitua pelo ID da turma que você deseja buscar
            include: {
                contents: {
                    include: {
                        user: {
                            include: {
                                teacher: {
                                    select: {
                                        id: true,
                                        username: true,
                                        permissionLevel:true
                                    }
                                }
                            },

                        }
                    },
                },
                users: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        terms: true,
                        permissionLevel: true,
                    }
                }
            },
        })
        console.log("Olá")
        if (!classDetails) {
            return res.status(404).json({ message: 'Classe não encontrada' });
        }
        //const content = await prisma.content.findUnique()
        return res.status(200).json({ message: 'Dados obtidos com sucesso', classDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar dados da classe', error });
    }
}


export const createClass = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const classData = await prisma.class.createMany({
            data
        });
        res.status(201).json(classData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create class' });
    }
}

export const deleteClass = async (req: Request, res: Response) => {
    const { id } = req.body
    try {
        const result = await prisma.class.deleteMany({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete class', err });
    }
}

export const updateClass = async (req: Request, res: Response): Promise<any> => {
    try {
        const { _id, newRelatedIds, relationModel, changes } = req.body
        let resultRelations: resultInterface = { message: '', sucess: false }
        let resultModify: resultInterface = { message: '', sucess: false }
        if (changes) resultModify = await changeModel({ _id, changes }, "Class")
        if (resultModify.error) return res.status(500).json({ message: "Erro ao modificar Classe", error: resultModify.error })

        if (relationModel == "ContentClass") {
            console.log("Content Class", _id, newRelatedIds)
            resultRelations = await updateRelations(
                Number(_id),
                newRelatedIds,
                'ContentClass',
                'classId',
                'contentId'
            )
        }
        if (resultRelations.error) return res.status(500).json({ message: "Erro ao modificar relações", error: resultRelations.error });
        if (resultRelations.sucess || resultModify.sucess) {
            return res
                .status(200)
                .json({ message: `Alteração nas relações realizada com ${resultRelations.sucess} e alteração no modelo realizada com ${resultModify.sucess}` })
        } else {
            res.status(500).json({ message: "Não foram realizadas operações" })
        }
    } catch (err) {
        res.status(500).json({ error: 'Falha ao atualizar classe', err });
    }
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?: string
}
/*
    _id: number,
    newRelatedIds: number[],
    relationModel: string,
    changes: [
    {operations: string, field: string},
    {operations: string, field: string}]
  */