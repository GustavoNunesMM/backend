import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import userRoutes from './routes/routes'
import { errorHandler } from './middleware/error'
import { PrismaClient } from "@prisma/client";
import { withOptimize } from "@prisma/extension-optimize"

export const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const app = express()

const corsOptions = {
  origin: 'http://localhost:5173', // Substitua pelo domínio do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Inclua cabeçalhos necessários
  credentials: true, // Habilita envio de cookies/autenticação
};


app.use(cors(corsOptions));  // Usando o CORS com as opções

export const prisma = new PrismaClient()
/*.$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || '' }),
)*/


app.use(cookieParser())
app.use(bodyParser.json())
app.use(userRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))