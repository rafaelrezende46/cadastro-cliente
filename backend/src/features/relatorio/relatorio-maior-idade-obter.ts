import { prisma } from '../../infra/prisma';
import { DateTime } from 'luxon';
import { obterDataCadastroInicio, Periodo } from './common';

interface Request {
  periodo: Periodo
}

function obterMaiorIdadeInicio() {
  return DateTime.now().minus({ years: 18 }).startOf('day').toJSDate();
}

export default async function relatorioMaiorIdadeObter(request: Request) {
  const dataCadastroInicio = obterDataCadastroInicio(request.periodo);
  const maiorIdadeInicio = obterMaiorIdadeInicio();

  const rendaMedia = await prisma.cliente
    .aggregate({
      _avg: {
        renda: true
      },
      where: {
        data_cadastro: {
          gte: dataCadastroInicio
        }
      }
    })
    .then(p => p._avg?.renda?.toNumber() || 0);

  const qtdeMaiorIdade = await prisma.cliente
    .aggregate({
      _count: {
        id: true
      },
      where: {
        data_cadastro: {
          gte: dataCadastroInicio
        },
        data_nascimento: {
          lte: maiorIdadeInicio
        },
        renda: {
          gt: rendaMedia
        }
      }
    })
    .then(p => p._count?.id || 0);

  return { qtdeMaiorIdade, rendaMedia };
}
