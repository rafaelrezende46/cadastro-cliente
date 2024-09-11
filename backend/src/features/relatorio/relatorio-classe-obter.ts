import { prisma } from '../../infra/prisma';
import { obterDataCadastroInicio, Periodo } from './common';

interface Request {
    periodo: Periodo
}

export default async function relatorioClasseObter(request: Request) {
    const dataCadastroInicio = obterDataCadastroInicio(request.periodo);

    const qtdeClasseA = await prisma.cliente
        .aggregate({
            _count: {
                id: true
            },
            where: {
                data_cadastro: {
                    gte: dataCadastroInicio
                },
                renda: {
                    lte: 980
                }
            }
        })
        .then(p => p._count?.id || 0);

    const qtdeClasseB = await prisma.cliente
        .aggregate({
            _count: {
                id: true
            },
            where: {
                data_cadastro: {
                    gte: dataCadastroInicio
                },
                renda: {
                    gte: 980.01,
                    lte: 2500
                }
            }
        })
        .then(p => p._count?.id || 0);

    const qtdeClasseC = await prisma.cliente
        .aggregate({
            _count: {
                id: true
            },
            where: {
                data_cadastro: {
                    gte: dataCadastroInicio
                },
                renda: {
                    gte: 2500.01
                }
            }
        })
        .then(p => p._count?.id || 0);

    return { qtdeClasseA, qtdeClasseB, qtdeClasseC };
}
