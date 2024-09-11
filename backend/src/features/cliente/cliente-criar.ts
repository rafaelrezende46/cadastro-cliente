import { prisma } from '../../infra/prisma';
import clienteValidar from './cliente-validar';

interface Request {
  id?: number | null;
  cpf: string;
  nome: string;
  data_nascimento: Date;
  renda: number;
}

export default async function clienteCriar(request: Request) {
  const data = {
    nome: request.nome,
    cpf: request.cpf,
    data_nascimento: new Date(request.data_nascimento),
    renda: request.renda,
  };

  await clienteValidar.validateAsync(data);

  return await prisma.cliente.create({ data, select: { id: true } });
}
