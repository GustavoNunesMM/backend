import {Response, Request, NextFunction} from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
};
