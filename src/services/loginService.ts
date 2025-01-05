import { Request, Response} from 'express'
import { prisma } from '../index'
import { bcrypt } from '../index'
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'

export const loginService = async (req: Request, res: Response):Promise<any> => {
    try {
        const { username, password } = req.body
        const salt = await bcrypt.genSalt(10) // Usar 10 como padrão
        const hashedPassword = await bcrypt.hash(password, salt)

        const user:userInterface | null = await prisma.user.findUnique({
            where: { username: username }
        })
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' })
        }
        if (req.cookies.token) {
            jwt.verify(req.cookies.token, SECRET_KEY, (err: any, user: any) => {
                if (err) {
                    return res.status(403).json({ message: 'Token inválido' })
                }
                return  res.status(301)
                            .json({ message: 'Usuário já autenticado', user })
                            .redirect(301, `/user:${user.id}`)
            })
        }
        const validPassword = await bcrypt.compare(hashedPassword, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: 'Senha inválida' })
        }
        const token = jwt.sign({ username, email: user.email }, SECRET_KEY, { expiresIn: '1h' })
        res.status(301)
            .cookie('token', token, { httpOnly: true })
            .redirect(301, `/user:${user.id}`)
    } catch(error) {
        res.status(500).json({ message: 'Erro interno do servidor', error })
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