# Locus Web Application

Aplicação web para cadastro de usuários e gerenciamento de endereços, com consulta automática de CEP via ViaCEP.

## Tecnologias

**Backend**
- Java 17
- Spring Boot 3.5.13
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend**
- React
- Vite
- Axios

## Pré-requisitos

- Java 17
- Node.js 18+
- PostgreSQL

## Como rodar

### Banco de dados

1. Crie um banco de dados PostgreSQL chamado `locusdb`
2. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:

### Backend
```bash
./mvnw spring-boot:run
```

A API estará disponível em `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Funcionalidades

- Cadastro e listagem de usuários
- Autenticação com CPF e senha
- Controle de acesso por perfil (ADMIN e USER)
- Cadastro, edição, exclusão e listagem de endereços
- Consulta automática de CEP via ViaCEP
- Definição de endereço principal

## Perfis de acesso

**Administrador**
- Visualiza todos os usuários e endereços
- Cadastra usuários e endereços
- Edita e exclui endereços

**Usuário comum**
- Visualiza apenas seus próprios dados
- Gerencia apenas seus próprios endereços
- Define endereço principal

## Observação

O primeiro usuário administrador deve ser criado diretamente no banco de dados, alterando o campo `role` para `ADMIN`.