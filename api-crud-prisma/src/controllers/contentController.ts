import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getContents = async (req: Request, res: Response) => {
    try {
        const contents = await prisma.content.findMany();
        res.status(200).json(contents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch contents' });
    }
}

export const getContentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body
        const content = await prisma.content.findUnique({
            where: { id: Number(id) },
        });

        if (!content) {
            return res.status(404).json({ error: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createContent = async(req: Request, res: Response) => {
    const { name, teacherId } = req.body;
    try {
        const content = await prisma.content.create({
            data: {
                name,
                teacherId
            },
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create content' });
    }
}

export const deleteContent = async(req: Request, res: Response) => {
    const { id } = req.body
    try {
        const result = await prisma.content.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete content', err });
    }
}