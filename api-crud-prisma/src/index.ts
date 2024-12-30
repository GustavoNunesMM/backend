import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/routes';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(userRoutes)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));