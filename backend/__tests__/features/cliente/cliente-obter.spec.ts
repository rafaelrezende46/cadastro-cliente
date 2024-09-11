import { prismaMock } from '../../../singleton';
import clienteObter from '../../../src/features/cliente/cliente-obter';

describe('cliente-obter', () => {
  test('obter cliente com sucesso', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: new Date(Date.parse('1990-01-25')),
      renda: 7000,
    };

    prismaMock.cliente.findFirst.mockResolvedValue(cliente as any);

    const resultado = clienteObter({ id: 1 });

    await expect(resultado).resolves.toEqual(cliente as any);

    expect(prismaMock.cliente.findFirst).toHaveBeenCalledWith({
      where: { id: { equals: 1 } },
      select: {
        id: true,
        cpf: true,
        nome: true,
        data_cadastro: true,
        data_nascimento: true,
        renda: true,
      },
    });
  });

  test('obter cliente não encontrado', async () => {
    prismaMock.cliente.findFirst.mockResolvedValue(null);

    const resultado = clienteObter({ id: 1 });

    await expect(resultado).rejects.toThrow('Not found');
  });
});
