import express, { Router, Request, Response } from 'express'
import { loginService } from '../services/loginService'
import { getUsers, getUserById, createUser, deleteUser, updateUser} from '../controllers/userController'
import { getClass, getClassById, createClass, deleteClass, updateClass } from '../controllers/classController'
import { getContents, getContentById, createContent, deleteContent, updateContent } from '../controllers/contentController'

const app = express();
const router = Router()

// Rotas para login
router.post('/login', loginService)


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

export default router
