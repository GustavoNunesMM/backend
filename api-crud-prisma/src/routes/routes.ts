import express, { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUsers, getUserById, createUser, deleteUser, updateUser} from '../controllers/userController';
import { getClass, getClassById, createClass, deleteClass, updateClass } from '../controllers/classController';
import { getContents, getContentById, createContent, deleteContent, updateContent } from '../controllers/contentController';
const app = express();
const router = Router()

// Rotas para tratar usuarios
router.get('/user', (req: Request, res: Response) => {
    if(req.body.id) return getUserById(req, res)
        else return getUsers(req, res)
});
router.post('/user', createUser)
router.delete('/user', deleteUser)
router.put('/user', updateUser)



// Rotas para tratar classes
router.get('/class', (req: Request, res: Response):Promise<any> => {
    if(req.body.id) return getClassById(req, res)
        else return getClass(req, res)
})
router.post('/class', createClass)
router.delete('/class', deleteClass)
router.put('/class', updateClass)



// Rotas para tratar conteudos
router.get('/content', (req: Request, res: Response):Promise<any> => {
    if(req.body.id) return getContentById(req, res)
        else return getContents(req, res)
})
router.post('/content', createContent)
router.delete('/content', deleteContent)
router.put('/content', updateContent)


export default router;