export default function validarCpf(value: string) {
  /* istanbul ignore next */
  if (typeof value !== 'string') {
    return false;
  }

  value = value.replace(/[^\d]+/g, '');

  /* istanbul ignore next */
  if (value.length !== 11 || !!value.match(/(\d)\1{10}/)) {
    return false;
  }

  const values = value.split('').map(el => +el);
  const rest = (count: number) =>
    ((values
      .slice(0, count - 12)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;

  return rest(10) === values[9] && rest(11) === values[10];
}
