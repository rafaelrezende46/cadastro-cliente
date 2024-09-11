import { Router } from 'express';
import relatorioMaiorIdadeObter from './relatorio-maior-idade-obter';
import relatorioClasseObter from './relatorio-classe-obter';

const router = Router();

router.get('/maior-idade', async (req, res, next) => {
  try {
    const periodo = req.query.periodo as any;

    res.json(await relatorioMaiorIdadeObter({ periodo }));
  } catch (error) {
    next(error);
  }
});

router.get('/classe', async (req, res, next) => {
  try {
    const periodo = req.query.periodo as any;

    res.json(await relatorioClasseObter({ periodo }));
  } catch (error) {
    next(error);
  }
});

export default router;