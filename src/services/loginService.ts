import { Request, Response} from 'express'
import { prisma } from '../index'
import { verifyPass } from './encryptPass'
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'

export const loginService = async (req: Request, res: Response):Promise<any> => {
    try {
        const data:loginInterface = req.body

        const user:userInterface | null = await prisma.user.findUnique({ //busca pelo usuario no banco
            where: { username: data.username }
        })
        if (!user) return res.status(404).json({message: "Usuario não encontrado"})

        const validPassword = await verifyPass(data.password, user.password)
        if (!validPassword) return res.status(401).json({ message: 'Senha inválida' })

        const token = jwt.sign(
            { username: data.username, email: user.email, id:user.id },
            SECRET_KEY,
            { expiresIn: '1h' }
        )
        res.cookie('token', token,{httpOnly: true})
        return res.status(200).json({userId: user.id})
    } catch(error) {
        res.status(500).json({ message: 'Erro interno do servidor', error })
    }
}

export const userLogout = (req: Request, res: Response):any => {
    try {
        res.clearCookie('token')
        return res.status(200).json({sucess: true})
    } catch(error) {
        return res.status(500).json({ message: 'Erro interno do servidor', error })
    }
}

interface userInterface{
    username: string
    password: string
    id: number
    endereco: string | null
    contato: string | null
    email: string
    permissionLevel: string
    classId: number | null
    terms: any | null
    createdAt: Date
}

interface loginInterface {
    username: string
    password: string
}

//res.cookie('token', token, { httpOnly: true });

//res.cookie('token', token, { secure: true, httpOnly: true }); Apenas para aplicações HTTPS

/*
app.post('/login', (req, res) => {
const { username, password } = req.body;

  // Verifique o usuário (exemplo simples, você pode usar um banco de dados)
if (username === 'admin' && password === 'password123') {
    // Gerando o token
    const token = jwt.sign(
        { username }, 
        SECRET_KEY, 
        { expiresIn: '1h' }
    );
    return res.json({ token });
} else {
    return res.status(401).json({ message: 'Credenciais inválidas' });
}
});

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Verifica o token no cabeçalho

if (!token) {
    return res.status(403).json({ message: 'Token não fornecido' });
}

jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
        return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next(); // Token válido, continue a execução
});
};

// Rota protegida com autenticação JWT
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.username}` });
});

*/