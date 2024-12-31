import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { changeModel } from '../middleware/modifyModel'
import { responseServer } from '../middleware/error'

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
            include: {content:true ,classes: true}
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const data = req.body
    try {
        const user = await prisma.user.create({
            data,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', err });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    let { id } = req.body
    try {
        const result = await prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', err });
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const result = await changeModel(req.body, "user")
        responseServer(result, res)
    }catch(err) {
        res.status(500).json({ error: 'Failed to update user', err });
    }
}
