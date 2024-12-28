import { Router, Request, Response } from 'express';
import { getUsers,  createUser , delUser, userChange} from '../controllers/userController';
import {getClass, createClass, delClass, alterClass } from '../controllers/classControler'
import {createContent, delContent, getContent } from '../controllers/contentController'
import { getStudent, createStudent, delStudent } from '../controllers/studentController';

const router = Router();


//usuario
router.post('/', createUser);
router.get('/', getUsers)
router.delete('/', delUser)
router.put('/', userChange)

//classe
router.post('/class', createClass)
router.get('/class', getClass)
router.delete('/class', delClass)
router.put('/Class', alterClass)

//conteudo
router.get('/Content', getContent)
router.post('/Content', createContent)
router.delete('/Content', delContent)

//Relação estudante e conteudo
router.get('/Student', getStudent)
router.post('/Student', createStudent)
router.delete('/Student', delStudent)

//Criar para relação StudentClass

export default router;
