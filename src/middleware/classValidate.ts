import { Request, Response } from 'express';
import { ClassModel } from '../models/Users';

export const validation = async (req:Request) => {
    const { name } = req.body
    const nameExist = await ClassModel.findOne({name})
    if (nameExist) {
        return true
    }
    return false
}
