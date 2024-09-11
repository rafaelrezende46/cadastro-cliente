import { prismaMock } from '../../../singleton';
import clienteCriar from '../../../src/features/cliente/cliente-criar';

describe('cliente-criar', () => {
  test('criar cliente com sucesso', async () => {
    const cliente = {
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: '1990-01-25',
      renda: 7000,
    };

    prismaMock.cliente.create.mockResolvedValue({ id: 1 } as any);

    const resultado = clienteCriar(cliente as any);

    await expect(resultado).resolves.toEqual({ id: 1 });

    expect(prismaMock.cliente.create).toHaveBeenCalledWith({
      data: {
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

  test('criar cliente com CPF inválido', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '74587963257',
      data_nascimento: new Date(Date.parse('1990-01-25')),
      renda: 7000,
    };

    const resultado = clienteCriar(cliente);

    await expect(resultado).rejects.toThrow('CPF inválido (cpf)');
  });

  test('criar cliente com CPF duplicado', async () => {
    const cliente = {
      id: 1,
      nome: 'cliente nome',
      cpf: '39380723008',
      data_nascimento: new Date(Date.parse('1990-01-25')),
      renda: 7000,
    };

    prismaMock.cliente.findFirst.mockResolvedValue({ id: 1 } as any);

    const resultado = clienteCriar(cliente);

    await expect(resultado).rejects.toThrow('CPF já cadastrado (value)');
  });
});
