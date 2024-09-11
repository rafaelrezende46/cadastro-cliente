import { samplePrismaNotFoundError } from '../../../src/helpers';
import { prismaMock } from '../../../singleton';
import clienteAtualizar from '../../../src/features/cliente/cliente-atualizar';

describe('cliente-atualizar', () => {
  test('atualizar cliente com sucesso', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: new Date('1990-01-25'),
      renda: 7000,
    };

    prismaMock.cliente.update.mockResolvedValue({ id: 1 } as any);

    const resultado = clienteAtualizar(cliente);

    await expect(resultado).resolves.not.toThrow();

    expect(prismaMock.cliente.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        id: 1,
        nome: 'cliente nome',
        cpf: '39380723008',
        data_nascimento: new Date('1990-01-25'),
        renda: 7000,
      },
      select: {
        id: true,
      },
    });
  });

  test('atualizar cliente não encontrado', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: new Date('1990-01-25'),
      renda: 7000,
    };

    prismaMock.cliente.update.mockRejectedValue(samplePrismaNotFoundError);

    const resultado = clienteAtualizar(cliente);

    await expect(resultado).rejects.toThrow('Not found');
  });

  test('atualizar cliente com CPF invalido', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '74587963257',
      data_nascimento: new Date(Date.parse('1990-01-25')),
      renda: 7000,
    };

    const resultado = clienteAtualizar(cliente);

    await expect(resultado).rejects.toThrow('CPF inválido (cpf)');
  });

  test('atualizar cliente com CPF duplicado', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: new Date(Date.parse('1990-01-25')),
      renda: 7000,
    };

    prismaMock.cliente.findFirst.mockResolvedValue({ id: 1 } as any);

    const resultado = clienteAtualizar(cliente);

    await expect(resultado).rejects.toThrow('CPF já cadastrado (value)');
  });
});
