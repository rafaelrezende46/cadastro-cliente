import { prisma } from '../../infra/prisma';

interface Request {
  pesquisa?: string;
  pagina?: number;
  paginaTamanho?: number;
}

export default async function clienteListar(request: Request) {
  const { pesquisa } = request;
  let { pagina, paginaTamanho } = request;

  if (!pagina || isNaN(pagina) || pagina < 0) {
    pagina = 1;
  }

  if (
    !paginaTamanho ||
    isNaN(paginaTamanho) ||
    paginaTamanho < 0 ||
    paginaTamanho > 100
  ) {
    paginaTamanho = 10;
  }

  const clientes = await prisma.cliente.findMany({
    where: {
      nome: {
        startsWith: pesquisa,
        mode: 'insensitive'
      },
    },
    select: {
      id: true,
      nome: true,
      renda: true,
    },
    orderBy: {
      nome: 'asc'
    },
    skip: (pagina - 1) * paginaTamanho,
    take: paginaTamanho,
  });

  return { clientes };
}
