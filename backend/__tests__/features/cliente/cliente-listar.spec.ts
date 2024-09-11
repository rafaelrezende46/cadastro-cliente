import { prismaMock } from '../../../singleton';
import clienteListar from '../../../src/features/cliente/cliente-listar';

describe('cliente-listar', () => {
  test('listar cliente com sucesso', async () => {
    const clientes = [
      {
        id: 1,
        nome: 'cliente nome',
        cpf: '39380723008',
        data_nascimento: new Date(Date.parse('1990-01-25')),
        renda: 7000,
      },
    ];

    prismaMock.cliente.findMany.mockResolvedValue(clientes as any);

    const resultado = clienteListar({});

    await expect(resultado).resolves.toEqual({ clientes });

    expect(prismaMock.cliente.findMany).toHaveBeenCalledWith({
      where: {
        nome: {
          startsWith: undefined,
        },
      },
      select: {
        id: true,
        nome: true,
        renda: true,
      },
      skip: 0,
      take: 10,
    });
  });

  test('listar cliente com pesquisa e paginação', async () => {
    const clientes = [
      {
        id: 1,
        nome: 'cliente nome',
        cpf: '39380723008',
        data_nascimento: new Date(Date.parse('1990-01-25')),
        renda: 7000,
      },
    ];

    prismaMock.cliente.findMany.mockResolvedValue(clientes as any);

    const resultado = clienteListar({
      pesquisa: 'pesquisa aqui',
      pagina: 3,
      paginaTamanho: 20,
    });

    await expect(resultado).resolves.toEqual({ clientes });

    expect(prismaMock.cliente.findMany).toHaveBeenCalledWith({
      where: {
        nome: {
          startsWith: 'pesquisa aqui',
        },
      },
      select: {
        id: true,
        nome: true,
        renda: true,
      },
      skip: 40,
      take: 20,
    });
  });
});
