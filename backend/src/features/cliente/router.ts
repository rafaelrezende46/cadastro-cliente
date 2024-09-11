import { Router } from 'express';
import clienteListar from './cliente-listar';
import clienteCriar from './cliente-criar';
import clienteAtualizar from './cliente-atualizar';
import clienteObter from './cliente-obter';
import clienteRemover from './cliente-remover';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const pesquisa = req.query.pesquisa as any;
    const pagina = parseInt(req.query.pagina as any);
    const paginaTamanho = parseInt(req.query.paginaTamanho as any);

    res.json(
      await clienteListar({
        pesquisa,
        pagina,
        paginaTamanho,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    res.json(await clienteObter({ id }));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    res.json(await clienteCriar(req.body));
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    await clienteAtualizar({
      id,
      ...req.body,
    });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    await clienteRemover({ id });

    res.status(200).end();
  } catch (error) {
    next(error);
  }
});

export default router;
