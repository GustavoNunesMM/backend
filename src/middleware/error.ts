import { Response, Request, NextFunction } from "express"
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    details: err.details || null,
    });
};

export const responseServer = async(result:resultInterface, res:Response) => {
    if (result.sucess) return res.status(200).json({ message: result.message })
    if (result.error) return res.status(500).json({message: "Erro interno do servidor"})
        return res.status(404).json({message: result.message})
}

interface resultInterface {
    message: string,
    sucess: boolean,
    error?:string
}
