# Cadastro de Clientes

## Introdução

O objetivo deste projeto é desenvolver um sistema de administração de clientes com funcionalidades de CRUD (Create, Read, Update, Delete), focado em avaliar a capacidade técnica e a organização do código de novos desenvolvedores. O projeto deve proporcionar uma experiência de usuário fluida e eficiente, com uma interface visualmente atraente e responsiva, adaptada para dispositivos móveis e desktops.

Durante a implementação, o desenvolvedor terá liberdade de escolher ferramentas e frameworks modernos, como React, Angular, PHP Laravel ou Vue.js para o frontend, além de soluções como .NET com C# para o backend. O uso de bibliotecas externas para melhorar a funcionalidade e o estilo é permitido, porém a estruturação e clareza do código, assim como a documentação, são aspectos essenciais para a avaliação.

O sistema deverá incluir uma API RESTful que se comunique com um banco de dados relacional via migrations ou scripts SQL, utilizando Docker para garantir portabilidade entre diferentes ambientes de desenvolvimento. A documentação clara e precisa deve orientar sobre como rodar o sistema em diferentes sistemas operacionais e garantir que o projeto seja facilmente reproduzido e compreendido por outros desenvolvedores.

Além da implementação das funcionalidades básicas de CRUD, o projeto deve incorporar validações de formulários e regras de negócio, como verificação de CPF duplicado e categorização de clientes com base em sua renda familiar, incluindo a exibição de relatórios detalhados e interativos. 

A apresentação do trabalho, a clareza da comunicação, o planejamento do prazo de entrega e a documentação, são fatores cruciais na avaliação deste teste para novos desenvolvedores.



## Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/en) >= 20.0.0
- [Docker](https://www.docker.com/)

## Configuração do Ambiente

Na raiz do projeto (mesma pasta onde está o arquivo _docker-compose.yml_), crie um arquivo `.env` e preencha as variáveis conforme o exemplo no arquivo `.env.sample`.

No arquivo `.env`, preencha as credenciais necessárias para o container do PostgreSQL:

- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## Executando o Sistema

### Passo 1: Baixar o projeto

Faça o download do projeto em uma máquina com sistema operacional Windows.

### Passo 2: Criar o container do PostgreSQL

Execute o comando abaixo para criar e iniciar o container do PostgreSQL no Docker:

```bash
docker-compose up -d --build postgres
```

Após esses dois passos, o ambiente estará preparado para ser instalado e executado localmente via Docker.

## Inicialização com Docker - Backend e Frontend

Para iniciar o projeto (backend e frontend) usando Docker, execute o seguinte comando na raiz do projeto:

```bash
docker-compose up -d --build
```

Após a execução, acesse o sistema através do navegador no endereço: [http://localhost:8080](http://localhost:8080).

## Inicialização em Modo de Desenvolvimento

### Backend

> Atenção: Não é possível rodar o backend em Docker e em modo de desenvolvimento simultaneamente, pois ambos utilizam a mesma porta configurada no arquivo `.env`.

> **Importante**: O container do PostgreSQL no Docker deve estar em execução. Veja as instruções no início do documento.

Na primeira execução do projeto, dentro da pasta `_backend_`, rode os seguintes comandos para instalar as dependências e executar as migrações do banco de dados:

```bash
npm install
npm run prismaDeploy
```

Para iniciar o backend em modo de desenvolvimento, o servidor será executado por padrão no endereço [http://localhost:8080](http://localhost:8080). A porta pode ser configurada no arquivo `.env`:

```bash
npm run dev
```

Para rodar os testes unitários em tempo real (TDD):

```bash
npm run dev:tdd
```

Para rodar os testes unitários apenas uma vez:

```bash
npm run test
```

### Frontend

> **Importante**: O frontend depende do backend estar em execução.

Na primeira execução do projeto, dentro da pasta `_frontend_`, rode o seguinte comando para instalar as dependências:

```bash
npm install
```

Para iniciar o frontend em modo de desenvolvimento:

```bash
npm run dev
```

O servidor será iniciado por padrão no endereço [http://localhost:8080](http://localhost:8080). A porta também pode ser configurada no arquivo `.env`.

---

# Dockerfile

Este `Dockerfile` está dividido em duas etapas para otimizar a construção e o deploy do projeto:

### Etapa 1: Construção da Aplicação

```dockerfile
FROM node:20 as build
```
- A imagem base utilizada é o Node.js versão 20.
- O estágio "build" é usado para compilar e construir os projetos do backend e frontend.

```dockerfile
WORKDIR /build
```
- Define o diretório de trabalho `/build`, onde os arquivos de backend e frontend serão copiados e construídos.

```dockerfile
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
```
- Aceita a variável `DATABASE_URL` via argumento e a define como uma variável de ambiente. Esta variável é necessária para as migrações do Prisma.

```dockerfile
COPY backend ./backend
COPY frontend ./frontend
```
- Copia as pastas do backend e frontend para o diretório de construção.

```dockerfile
WORKDIR /build/backend
RUN npm install
RUN npm run build
```
- Muda para o diretório do backend, instala as dependências e executa o comando de build.

```dockerfile
WORKDIR /build/frontend
RUN npm install
RUN npm run build
```
- Muda para o diretório do frontend, instala as dependências e executa o comando de build.

### Etapa 2: Deploy da Aplicação

```dockerfile
FROM node:20-alpine as deploy
```
- Utiliza uma imagem Node.js mais leve (alpine) para o estágio de deploy, otimizando o tamanho final da imagem.

```dockerfile
WORKDIR /app
```
- Define o diretório de trabalho `/app`, onde o build final será colocado.

```dockerfile
COPY --from=build /build/backend/dist/src ./src
COPY --from=build /build/backend/src/infra/prisma/schema.prisma ./src/infra/prisma
COPY --from=build /build/backend/src/infra/prisma/migrations ./src/infra/prisma/migrations
COPY --from=build /build/backend/package*.json ./
```
- Copia os artefatos construídos do backend e as migrações para o estágio de deploy.

```dockerfile
COPY --from=build /build/frontend/dist ./src/public
```
- Copia o build do frontend para a pasta pública do backend.

```dockerfile
WORKDIR /app/src
RUN npm install --only=production
RUN npx prisma generate
```
- Instala apenas as dependências de produção e gera o cliente Prisma para acesso ao banco de dados.

```dockerfile
CMD ["node", "index.js"]
```
- Define o comando de entrada para iniciar a aplicação.

---

# docker-compose.yml

O arquivo `docker-compose.yml` define os serviços necessários para executar a aplicação e suas dependências.

### Versão

```yaml
version: '3.8'
```
- Especifica a versão do Docker Compose.

### Serviços

#### Serviço PostgreSQL

```yaml
services:
  postgres:
    image: postgres:16
    container_name: postgres
    restart: always
    env_file:
      - .env
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "${POSTGRES_PORT}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 5s
      retries: 5
```
- Define um serviço para o PostgreSQL com persistência de dados (`pgdata`).
- As variáveis de ambiente são lidas do arquivo `.env`.
- A porta padrão do PostgreSQL (`5432`) é mapeada.
- Um healthcheck garante que o serviço está pronto antes de outros serviços dependerem dele.

#### Serviço de Migrações

```yaml
migrations:
    build:
      context: .
      dockerfile: Dockerfile
    command: ["npx", "prisma", "migrate", "deploy"]
    container_name: node-migrations
    env_file:
      - .env
    environment:
      DATABASE_URL: "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"
    depends_on:
      postgres:
        condition: service_healthy
```
- Serviço que executa as migrações do banco de dados Prisma.
- Depende do serviço `postgres` estar saudável para rodar.
  
#### Serviço da Aplicação

```yaml
app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: node-app
    env_file:
      - .env
    environment:
      NODE_ENV: ${NODE_ENV}
      SERVER_PORT: ${SERVER_PORT}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_HOST: postgres
      POSTGRES_PORT: 5432
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      VITE_SERVER_URL: ${VITE_SERVER_URL}
    ports:
      - "${SERVER_PORT}:${SERVER_PORT}"
    depends_on:
      - migrations
```
- Serviço principal da aplicação.
- Depende do serviço de migrações.
- Mapeia a porta definida pela variável de ambiente `SERVER_PORT`.

### Volumes

```yaml
volumes:
  pgdata:
```
- Define um volume para persistir os dados do PostgreSQL.

---

# Arquivo `.env`

Este arquivo define variáveis de ambiente usadas pelo Docker, backend, frontend e PostgreSQL.

```env
# Define o ambiente da aplicação (desenvolvimento ou produção)
NODE_ENV=development

## BACKEND

# Configurações do servidor Node.js
SERVER_PORT=8080

# URL do Frontend permitida pelo CORS
FRONTEND_URL=http://localhost:5173

# Configurações do banco de dados PostgreSQL
POSTGRES_DB=cadastro-cliente
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER= # Preencha o usuário do banco de dados
POSTGRES_PASSWORD= # Preencha a senha do banco de dados

# URL de conexão ao banco de dados PostgreSQL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

## FRONTEND

# URL do backend usada pelo frontend
VITE_SERVER_URL=http://localhost:${SERVER_PORT}
```
- As variáveis `POSTGRES_USER` e `POSTGRES_PASSWORD` precisam ser preenchidas com as credenciais corretas.
- As variáveis de ambiente são compartilhadas entre o Docker, backend e frontend para garantir a comunicação entre os serviços.
