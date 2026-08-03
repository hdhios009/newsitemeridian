export function formatMoney(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n) + ' ₽';
}
