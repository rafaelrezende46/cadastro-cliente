import api, { buildResponse } from "./api"

export type Periodo = 'hoje' | 'esta_semana' | 'este_mes';

export interface RelatorioRequest {
    periodo: Periodo
}

export interface RelatorioClasseResponse {
    qtdeClasseA: number,
    qtdeClasseB: number,
    qtdeClasseC: number
}

export interface RelatorioMaiorIdadeResponse {
    qtdeMaiorIdade: number,
    rendaMedia: number
}

class RelatorioService {
    maiorIdade(request: RelatorioRequest): Promise<RelatorioMaiorIdadeResponse> {
        return api.get('/api/relatorios/maior-idade', { params: request }).then(p => p.data);
    }

    classes(request: RelatorioRequest): Promise<RelatorioClasseResponse> {
        return api.get('/api/relatorios/classe', { params: request }).then(p => p.data);
    }
}

const relatorioService = new RelatorioService();

export default relatorioService;