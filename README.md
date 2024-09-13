# Cadastro de clientes

## Dependências

Antes de executar o projeto, instale as seguintes dependências na máquina:

* [NodeJs](https://nodejs.org/en) >= 20.0.0
* [Docker](https://www.docker.com/)

## Preparando o ambiente

Na raiz do projeto (mesma pasta onde está o arquivo _docker-compose.yml_) crie um arquivo .env e preencha conforme o exemplo em .env.sample.

No arquivo .env preencha as variáveis com as credenciais que serão usadas no container do Postgres:
* POSTGRES_USER
* POSTGRES_PASSWORD

Rode o comando abaixo para criar o container do Postgres no docker.

```
docker-compose up -d --build postgres
```

## Backend e Frontend - Iniciar utilizando o docker

Para inicializar o projeto usando o docker, execute o seguinte comando na raiz do projeto:

```
docker-compose up -d --build
```

Em seguida abra a URL no navegador: http://localhost:8080

## Backend - Iniciar em desenvolvimento

> Não é possível rodar a backend no Docker e em modo desenvolvimento ao mesmo tempo, pois ambos os modos utilizam a mesma porta para o backend (configurada no arquivo .env).

> __Importante__: O backend precisa que o container do docker do Postgres esteja rodando, veja as instruções no topo do arquivo.


Na pasta _backend_, apenas na primeira vez antes de executar o projeto, rode os seguintes commandos para instalar as libs e rodar o migrations do banco de dados:

```
npm install
npm run prismaDeploy
```

Para iniciar o backend em modo de desenvolvimento (o servidor vai iniciar por padrão no endereço http://localhost:8080, a porta é configurável no arquivo .env):
```
npm run dev
```

Para rodar os unit tests em tempo real:
```
npm run dev:tdd
```

Para rodar os unit tests apenas uma vez:

```
npm run test
```

## Frontend - Iniciar em desenvolvimento

> __Importante__: O frontend precisa que o backend já esteja rodando.

Na pasta _frontend_, apenas na primeira vez antes de executar o projeto, rode os seguintes commandos para instalar as libs:

```
npm install
```

Para iniciar o backend em modo de desenvolvimento (o servidor vai iniciar por padrão no endereço http://localhost:8080, a porta é configurável no arquivo .env):
```
npm run dev
```
