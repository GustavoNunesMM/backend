import { Request, Response } from 'express';
import { prisma } from '../index';
import { changeModel } from '../services/modifyModel'
import { updateRelations } from '../services/modifyRelations'

export const getContents = async (req: Request, res: Response) => {
    try {
        const contents = await prisma.content.findMany();
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contents' });
    }
}

export const getContentById = async (req: Request, res: Response):Promise<any> => {
    const { id } = req.params
    try {
        const content = await prisma.content.findUnique({
            where: { id: Number(id) },
            include: {users: true, classes: true}
        }); 

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createContent = async(req: Request, res: Response) => {
    try {
        const data = req.body
        const content = await prisma.content.createMany({
            data,
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create content' });
    }
}

export const deleteContent = async(req: Request, res: Response) => {
    const { id } = req.body
    try {
        const result = await prisma.content.deleteMany({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete content', err });
    }
}

export const updateContent = async(req:Request, res:Response):Promise<any> => {
    try{ 
        const {_id, newRelatedIds, relationModel, changes } = req.body
        let resultRelations:resultInterface = { message: '', sucess: false };
        let resultModify:resultInterface = { message: '', sucess: false };
        if(changes) resultModify = await changeModel({_id, changes}, "Content")
        if(resultModify.error) return res.status(500).json({message: 'Erro ao modificar usuario', error: resultModify.error})
        
        switch (relationModel){
            case "UserContent":
                console.log("UserContent")
                resultRelations = await updateRelations(
                    Number(_id),
                    newRelatedIds,
                    'UserContent',
                    'contentId',
                    'userId'
                )
                break
            case "ContentClass":
                console.log("ContentClass")
                resultRelations = await updateRelations(
                    Number(_id),
                    newRelatedIds,
                    'ContentClass',
                    'ContentId',
                    'classId'
                )
        }
        if ( resultRelations.error) return res.status(500).json({ message:"Erro ao modificar relações", error: resultRelations.error})
        if ( resultRelations.sucess || resultModify.sucess) {
            return res
                .status(200)
                .json({message: `Alteração nas relações realizada com ${resultRelations.sucess} e alteração no modelo realizada com ${resultModify.sucess}`})
        } else {
            res
            .status(500)
            .json({ message: "Não foram realizadas operações" })
        }
    }catch(err) {
        res
        .status(500)
        .json({ error: 'Falha ao atualizar conteudo', err })
    }
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}

/*
    _id: number,
    newRelatedIds: number[],
    relationModel: string,
    changes: [
    {operations: string, field: string},
    {operations: string, field: string}]
  */