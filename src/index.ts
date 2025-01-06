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


export const prisma = new PrismaClient().$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || '' }),
)

app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors())
app.use(userRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))