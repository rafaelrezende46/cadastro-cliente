import { samplePrismaNotFoundError } from '../../../src/helpers';
import { prismaMock } from '../../../singleton';
import clienteRemover from '../../../src/features/cliente/cliente-remover';

describe('cliente-remover', () => {
  test('remover cliente com sucesso', async () => {
    const cliente = {
      id: 1,
    };

    prismaMock.cliente.findFirst.mockResolvedValue(cliente as any);
    prismaMock.cliente.delete.mockResolvedValue(cliente as any);

    const resultado = clienteRemover({ id: 1 });

    await expect(resultado).resolves.not.toThrow();

    expect(prismaMock.cliente.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true },
    });
  });

  test('remover cliente não encontrado', async () => {
    prismaMock.cliente.delete.mockRejectedValue(samplePrismaNotFoundError);

    const resultado = clienteRemover({ id: 1 });

    await expect(resultado).rejects.toThrow('Not found');
  });
});
