# API para Gerenciamento Escolar

Este projeto é uma API desenvolvida para o gerenciamento de uma escola. A API foi construída utilizando **TypeScript**, **MongoDB** como banco de dados, o **Mongoose** para modelagem de dados e o framework **Express** para criar as rotas e lógica de negócios.

## Funcionalidades

A API oferece as seguintes funcionalidades:

1. **Gerenciamento de Estudantes:**
   - Cadastro de novos estudantes.
   - Consulta de informações de estudantes.
   - Atualização e remoção de dados.

2. **Gerenciamento de Professores:**
   - Cadastro e consulta de professores.
   - Atualização de informações.

3. **Gerenciamento de Turmas:**
   - Criação de turmas associadas a professores e estudantes.
   - Controle de capacidade.

4. **Autenticação e Autorização:**
   - Sistema de login para administradores.
   - Controle de acesso a rotas protegidas.

---

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do código JavaScript.
- **TypeScript**: Superset do JavaScript para fornecer tipagem estática.
- **Express**: Framework minimalista para desenvolvimento de APIs.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenamento das informações.
- **Mongoose**: ODM (Object Data Modeling) para MongoDB.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **Jest**: Framework de testes.

---

## Instalação e Execução

### Pré-requisitos

- Node.js (v16 ou superior)
- MongoDB (instância local ou em nuvem)
- Gerenciador de pacotes (npm ou yarn)

## Estrutura do Projeto

```
├── src
│   ├── controllers  // Lógica de negócios
│   ├── models       // Modelos do Mongoose
│   ├── routes       // Definição de rotas
│   ├── services     // Serviços auxiliares (ex: autenticação)
│   ├── middlewares  // Middlewares como autenticação
│   └── index.ts     // Ponto de entrada da aplicação
├── tests            // Testes unitários e de integração
├── package.json     // Dependências e scripts
├── tsconfig.json    // Configuração do TypeScript
└── README.md        // Documentação
```

---
## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie suas mudanças (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

---

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

