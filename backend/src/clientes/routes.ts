import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    res.json({
        foi: true
    });
});

router.post('/', (req, res) => {
    const clienteData = req.body;

    res.json({
        deuCerto: true,
        dadosDoCliente: clienteData
    })
})

router.put('/', (req, res) => {
    const clienteData = req.body;

    res.json({
        deuCerto: true,
        dadosAtualizadosDoCliente: clienteData
    })
})

router.put('/:id', (req, res) => {
    const clienteData = req.body;
    const { id } = req.params;

    res.json({
        deuCerto: true,
        idParam: id,
        dadosAtualizadosDoCliente: clienteData
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    res.json({
        deuCerto: true,
        idParamExcluido: id,
    })
})

export default router;