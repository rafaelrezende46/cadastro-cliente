import { prisma } from '../../infra/prisma';
import clienteValidar from './cliente-validar';
import { isNotFoundError, NotFoundError } from '../core/found-found-error';

interface Request {
  id: number;
  cpf: string;
  nome: string;
  data_nascimento: Date;
  renda: number;
}

export default async function clienteCriarAtualizar(request: Request) {
  const data = {
    id: request.id,
    nome: request.nome,
    cpf: request.cpf,
    data_nascimento: new Date(request.data_nascimento),
    renda: request.renda,
  };

  await clienteValidar.validateAsync(data);

  try {
    await prisma.cliente.update({
      data,
      where: { id: request.id },
      select: { id: true },
    });
  } catch (err) {
    if (isNotFoundError(err)) throw new NotFoundError();

    throw err;
  }
}
