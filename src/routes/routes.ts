import express, { Router, Request, Response } from 'express'
import { loginService, userLogout } from '../services/loginService'
import { getUsers, getUserById, createUser, registerUser, deleteUser, updateUser} from '../controllers/userController'
import { getClass, getClassById, getClassData, createClass, deleteClass, updateClass } from '../controllers/classController'
import { getContents, getContentById, createContent, deleteContent, updateContent } from '../controllers/contentController'
import { jwtAuth } from '../middleware/JwtAuth'

const app = express();
const router = Router()

// Rotas para login
router.post('/login', loginService)
router.get('/user/logout', userLogout)

router.get('/auth/validate', jwtAuth)

// Rotas para registro
router.post('/register', createUser)

// Rotas para tratar usuarios
router.get('/user', getUsers)
router.get('/user/:id', getUserById)
router.post('/user', createUser)
router.post('/register/user', registerUser)
router.delete('/user', deleteUser)
router.put('/user', updateUser)


// Rotas para tratar classes
router.get('/class', getClass)
router.get('/class/:id', getClassById)
router.post('/class', createClass)
router.delete('/class', deleteClass)
router.put('/class', updateClass)
router.get('/classData/:id', getClassData)

// Rotas para tratar conteudos
router.get('/content', getContents)
router.get('/content/:id', getContentById)
router.post('/content', createContent)
router.delete('/content', deleteContent)
router.put('/content', updateContent)

export default router
