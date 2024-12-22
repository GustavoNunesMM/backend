import express, { Request, Response } from 'express';
import connectDB from './database/database'
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json()); // Para poder interpretar o corpo das requisições como JSON

// Definindo a rota
app.use('/users', userRoutes);


const PORT = 4040;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});