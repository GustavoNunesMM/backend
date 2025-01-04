import { Request, Response } from 'express';
import { prisma } from '../index';
import { changeModel } from '../middleware/modifyModel'
import { responseServer } from '../middleware/error'



export const getClass = async (req: Request, res: Response) => {
    try {
        const classes = await prisma.class.findMany();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
}
export const getClassById = async (req: Request, res: Response):Promise<any> => {
    const { id } = req.body
    try {
        const classData = await prisma.class.findUnique({
            where: { id: Number(id) },
            include: {users: true, contents: true}
        });

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.status(200).json(classData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createClass = async(req: Request, res: Response) => {
    const data = req.body;
    try {
        const classData = await prisma.class.create({
            data
        });
        res.status(201).json(classData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create class' });
    }
}

export const deleteClass = async(req: Request, res: Response) => {
    const { id } = req.body
    try {
        const result = await prisma.class.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete class', err });
    }
}

export const updateClass = async(req: Request, res: Response) => {
    try {
        const result = await changeModel(req.body, "class")
        responseServer(result, res)
    }catch(err) {
        res.status(500).json({ error: 'Failed to update class', err });
    }
}