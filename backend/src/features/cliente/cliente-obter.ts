import { prisma } from '../../infra/prisma';
import { NotFoundError } from '../core/found-found-error';

interface Request {
  id: number;
}

export default async function clienteObter(request: Request) {
  const cliente = await prisma.cliente.findFirst({
    where: { id: { equals: request.id } },
    select: {
      id: true,
      cpf: true,
      nome: true,
      data_cadastro: true,
      data_nascimento: true,
      renda: true,
    },
  });

  if (!cliente) {
    throw new NotFoundError();
  }

  return cliente;
}
