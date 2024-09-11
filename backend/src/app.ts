import * as bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import errorHandler from './infra/error-handler';

import clienteRouter from './features/cliente/router';
import relatorioRouter from './features/relatorio/router';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: [process.env.FRONTEND_URL!]
};

app.use(cors(corsOptions))

// support application/json type post data
app.use(bodyParser.json());

// support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

// responde with indented JSON string
app.set('json spaces', 2);

// static files
const staticPath='public';
app.use(express.static(staticPath));

// fallback SPA app routes to static files
app.use('/', ((...args) => (req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.accepts('html') && !req.path.startsWith('/api')) {
    (res.sendFile || res.sendfile).call(res, ...args, err => err && next())
  } else next()
})('index.html', {
  root: staticPath
}));

/*
 * Início Rotas - Adicione as rotas da aplicação a partir de aqui
 */

app.use('/api/clientes', clienteRouter);

app.use('/api/relatorios', relatorioRouter);

/*
 * Fim Rotas
 */

// Trata erros de servidor em código assíncrono
app.use((err: any, req: any, res: any, next: any) =>
  errorHandler(err, req, res, next),
);

export default app;
