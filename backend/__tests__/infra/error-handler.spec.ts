import app from '../../src/app';
import request from 'supertest';
import clienteListar from '../../src/features/cliente/cliente-listar';
import { ValidationError } from 'joi';
import CustomValidationError from '../../src/features/core/custom-validation-error';
import { NotFoundError } from '../../src/features/core/found-found-error';

jest.mock('../../src/features/cliente/cliente-listar', () => jest.fn());

describe('error-handler', () => {
  test('erro interno de servidor', async () => {
    // No Express, as exceções em código assíncrono não são tratadas automaticamente,
    // então é encessário manualmente fazer o await com try-catch ou o servidor cai após uma exceção.
    // Esse teste confirma que o servidor retorna 500 em vez de cair em exceções assíncronas.

    jest.mocked(clienteListar).mockRejectedValueOnce(new Error());

    const response = await request(app).get('/clientes');

    expect(response.status).toBe(500);
  });

  test('validação do Joi', async () => {
    jest
      .mocked(clienteListar)
      .mockRejectedValueOnce(
        new ValidationError(
          'Exemplo',
          [{ path: ['pai', 'campo'], message: 'mensagem aqui', type: 'error' }],
          null,
        ),
      );

    const response = await request(app).get('/clientes');

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: [{ field: 'campo', message: 'mensagem aqui' }],
    });
  });

  test('validação do Customizada', async () => {
    jest
      .mocked(clienteListar)
      .mockRejectedValueOnce(
        new CustomValidationError('campo', 'mensagem aqui'),
      );

    const response = await request(app).get('/clientes');

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({
      errors: [{ field: 'campo', message: 'mensagem aqui' }],
    });
  });

  test('not found', async () => {
    jest.mocked(clienteListar).mockRejectedValueOnce(new NotFoundError());

    const response = await request(app).get('/clientes');

    expect(response.status).toBe(404);
  });
});
