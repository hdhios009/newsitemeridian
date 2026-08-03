export const AUTH_ROUTES = ['login', 'register', 'forgot', 'onboarding'] as const;
export const APP_ROUTES = ['dashboard', 'bookings', 'clients', 'client', 'payments', 'settings', 'notfound'] as const;

export const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Главная',
  bookings: 'Записи',
  clients: 'Клиенты',
  client: 'Клиент',
  payments: 'Оплаты',
  settings: 'Настройки',
  notfound: 'Страница не найдена',
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Главная', icon: 'home' as const },
  { id: 'bookings', label: 'Записи', icon: 'book' as const },
  { id: 'clients', label: 'Клиенты', icon: 'users' as const },
  { id: 'payments', label: 'Оплаты', icon: 'wallet' as const },
  { id: 'settings', label: 'Настройки', icon: 'cog' as const },
] as const;

export function hashPath(path: string): string {
  return '#/' + path.replace(/^\/?/, '');
}
