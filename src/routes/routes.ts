import express, { Router, Request, Response } from 'express';
import { getUsers, getUserById, createUser, deleteUser, updateUser} from '../controllers/userController';
import { getClass, getClassById, createClass, deleteClass, updateClass } from '../controllers/classController';
import { getContents, getContentById, createContent, deleteContent, updateContent } from '../controllers/contentController';
import { changeModel } from '../middleware/modifyModel';
import { responseServer } from '../middleware/error';
import { prisma } from '../index';

const app = express();
const router = Router()


// Rotas para tratar usuarios
router.get('/user', getUsers)
router.get('/user/:id', getUserById)

router.post('/user', createUser)
router.delete('/user', deleteUser)
router.put('/user', updateUser)


// Rotas para tratar classes
router.get('/class', getClass)
router.get('/class/:id', getClassById)
router.post('/class', createClass)
router.delete('/class', deleteClass)
router.put('/class', updateClass)


// Rotas para tratar conteudos
router.get('/content', getContents)
router.get('/content/:id', getContentById)
router.post('/content', createContent)
router.delete('/content', deleteContent)
router.put('/content', updateContent)

router.put('/contentClass', async (req: Request, res: Response) => {
    console.log(req.body.classId)
    const response = await prisma.contentClass.create({
        data: {
            classId: req.body.classId,
            ContentId: req.body.ContentId,
        },
    });
    res.status(200).json({message: "Conteudo adicionado a classe"});
})

export default router
