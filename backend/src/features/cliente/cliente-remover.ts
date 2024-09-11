import { prisma } from '../../infra/prisma';
import { isNotFoundError, NotFoundError } from '../core/found-found-error';

interface Request {
  id: number;
}

export default async function clienteRemover(request: Request) {
  try {
    await prisma.cliente.delete({
      where: { id: request.id },
      select: { id: true },
    });
  } catch (err) {
    if (isNotFoundError(err)) throw new NotFoundError();

    throw err;
  }
}
