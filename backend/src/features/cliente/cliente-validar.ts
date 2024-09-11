import Joi from 'joi';
import { prisma } from '../../../src/infra/prisma';
import CustomValidationError from '../core/custom-validation-error';
import validarCpf from '../core/validar-cpf';
import { messages } from 'joi-translation-pt-br';

async function cpfJaExiste(cliente: { id?: number; cpf: string }) {
  const id = cliente.id || 0;
  const cpf = cliente.cpf;

  return !!(await prisma.cliente.findFirst({
    select: { id: true },
    where: {
      id: {
        not: id,
      },
      cpf: {
        equals: cpf,
      },
    },
  }));
}

const clienteValidar = Joi.object({
  id: Joi.number().optional(),
  cpf: Joi.string()
    .required()
    .external(cpf => {
      if (!validarCpf(cpf)) {
        throw new CustomValidationError('cpf', 'CPF inválido');
      }
    })
    .label('CPF'),
  nome: Joi.string().max(150).required().label('Nome'),
  data_nascimento: Joi.date().max('now').required().label('Data de Nascimento'),
  renda: Joi.number().min(0).required().label('Renda'),
}).external(async cliente => {
  const existe = await cpfJaExiste(cliente);

  if (existe) {
    throw new CustomValidationError('cpf', 'CPF já cadastrado');
  }
}).messages(messages);

export default clienteValidar;
