import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getClass = async (req: Request, res: Response) => {
    try {
        const classes = await prisma.class.findMany();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch classes' });
    }
}
export const getClassById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const classData = await prisma.class.findUnique({
            where: { id: Number(id) },
        });

        if (!classData) {
            return res.status(404).json({ error: 'Class not found' });
        }

        res.json(classData);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createClass = async(req: Request, res: Response) => {
    const { name, series, users, contents } = req.body;
    try {
        const classData = await prisma.class.create({
            data: {
                name,
                series
            },
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