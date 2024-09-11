import { DateTime } from "luxon";

export type Periodo = 'hoje' | 'esta_semana' | 'este_mes';

export function obterDataCadastroInicio(periodo: Periodo) {
  let inicio: DateTime<true>;

  switch (periodo) {
    case 'este_mes':
      inicio = DateTime.now().startOf('month');
      break;

    case 'esta_semana':
      inicio = DateTime.now().startOf('week');
      break;

    default:
      inicio = DateTime.now().startOf('day');
      break;
  }

  const fim = DateTime.now();

  return inicio.toJSDate();
}
