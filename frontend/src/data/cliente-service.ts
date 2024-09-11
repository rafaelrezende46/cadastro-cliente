import api, { buildResponse } from "./api"

export interface ClienteRequest {
    nome: string,
    cpf: string,
    data_nascimento: string,
    renda: number
}

export interface ListarClienteRequest {
    pesquisa?: string,
    pagina?: number,
    paginaTamanho?: number
}

export interface ListarClienteResponse {
    clientes: ListarClienteDto[]
}

export interface ListarClienteDto {
    id: number,
    nome: string,
    renda: number
}

export interface ClienteResponse {
    id: number,
    nome: string,
    cpf: string,
    data_nascimento: string,
    renda: number
}

class ClienteService {
    obter(id: number | string): Promise<ClienteResponse> {
        return api.get(`/api/clientes/${id}`).then(p => p.data);
    }

    criar(request: ClienteRequest) {
        return api.post('/api/clientes', request).then(buildResponse);
    }

    atualizar(id: number | string, request: ClienteRequest) {
        return api.put(`/api/clientes/${id}`, request).then(buildResponse);
    }

    remover(id: number | string) {
        return api.delete(`/api/clientes/${id}`).then(buildResponse);
    }

    listar(request: ListarClienteRequest): Promise<ListarClienteResponse> {
        return api.get('/api/clientes', { params: request }).then(p => p.data);
    }
}

const clienteService = new ClienteService();

export default clienteService;