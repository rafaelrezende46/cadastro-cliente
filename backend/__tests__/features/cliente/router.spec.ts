import app from '../../../src/app';
import request from 'supertest';
import clienteListar from '../../../src/features/cliente/cliente-listar';
import clienteObter from '../../../src/features/cliente/cliente-obter';
import clienteAtualizar from '../../../src/features/cliente/cliente-atualizar';
import clienteCriar from '../../../src/features/cliente/cliente-criar';
import clienteRemover from '../../../src/features/cliente/cliente-remover';
import { sampleCustomValidationError } from '../../../src/helpers';

jest.mock('../../../src/features/cliente/cliente-listar', () => jest.fn());
jest.mock('../../../src/features/cliente/cliente-obter', () => jest.fn());
jest.mock('../../../src/features/cliente/cliente-atualizar', () => jest.fn());
jest.mock('../../../src/features/cliente/cliente-criar', () => jest.fn());
jest.mock('../../../src/features/cliente/cliente-remover', () => jest.fn());

describe('clientes', () => {
  describe('GET /', () => {
    test('listar clientes', async () => {
      const result = { clientes: [] as any };

      jest.mocked(clienteListar).mockResolvedValueOnce(result);

      const response = await request(app).get('/clientes');

      expect(clienteListar).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(result);
    });

    test('listar clientes falhou', async () => {
      jest
        .mocked(clienteListar)
        .mockRejectedValueOnce(sampleCustomValidationError);

      const response = await request(app).get('/clientes');

      expect(clienteListar).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });

    test('listar clientes com pesquisa e paginação', async () => {
      await request(app).get(
        '/clientes?pesquisa=test&pagina=2&paginaTamanho=20',
      );

      expect(clienteListar).toHaveBeenCalledWith({
        pesquisa: 'test',
        pagina: 2,
        paginaTamanho: 20,
      });
    });
  });

  describe('GET /1', () => {
    test('obter cliente', async () => {
      const result = {
        id: 1,
        nome: 'cliente nome',
        cpf: '12345678900',
        data_cadastro: '2021-01-02',
        data_nascimento: '1990-01-02',
        renda: 7000,
      };

      jest.mocked(clienteObter).mockResolvedValueOnce(result as any);

      const response = await request(app).get('/clientes/1');

      expect(clienteObter).toHaveBeenCalledWith({ id: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(result);
    });

    test('obter cliente falhou', async () => {
      jest
        .mocked(clienteObter)
        .mockRejectedValueOnce(sampleCustomValidationError);

      const response = await request(app).get('/clientes/1');

      expect(clienteObter).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  describe('POST /', () => {
    test('criar cliente', async () => {
      jest.mocked(clienteCriar).mockResolvedValue({ id: 1 });

      const response = await request(app).post('/clientes').send({
        nome: 'cliente nome',
        cpf: '12345678900',
        data_nascimento: '2000-07-23',
        renda: 7000,
      });

      expect(clienteCriar).toHaveBeenCalledWith({
        nome: 'cliente nome',
        cpf: '12345678900',
        data_nascimento: '2000-07-23',
        renda: 7000,
      });
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({ id: 1 });
    });

    test('criar cliente falhou', async () => {
      jest
        .mocked(clienteCriar)
        .mockRejectedValueOnce(sampleCustomValidationError);

      const response = await request(app).post('/clientes');

      expect(clienteCriar).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  describe('PUT /1', () => {
    test('atualizar cliente', async () => {
      const response = await request(app).put('/clientes/1').send({
        nome: 'cliente nome',
        cpf: '12345678900',
        data_nascimento: '2000-07-23',
        renda: 7000,
      });

      expect(clienteAtualizar).toHaveBeenCalledWith({
        id: 1,
        nome: 'cliente nome',
        cpf: '12345678900',
        data_nascimento: '2000-07-23',
        renda: 7000,
      });
      expect(response.status).toBe(200);
    });

    test('atualizar cliente falhou', async () => {
      jest
        .mocked(clienteAtualizar)
        .mockRejectedValueOnce(sampleCustomValidationError);

      const response = await request(app).put('/clientes/1');

      expect(clienteAtualizar).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /1', () => {
    test('remover cliente', async () => {
      const response = await request(app).delete('/clientes/1');

      expect(clienteRemover).toHaveBeenCalledWith({ id: 1 });
      expect(response.status).toBe(200);
    });

    test('remover cliente falhou', async () => {
      jest
        .mocked(clienteRemover)
        .mockRejectedValueOnce(sampleCustomValidationError);

      const response = await request(app).delete('/clientes/1');

      expect(clienteRemover).toHaveBeenCalled();
      expect(response.status).toBe(400);
    });
  });
});
