/** Session prefs keyed like the prototype localStorage. Domain data comes later. */
const KEYS = {
  firstBooking: 'meridian.firstBooking',
  setupHidden: 'meridian.setupHidden',
  draftBooking: 'meridian.draftBooking',
  lastService: 'meridian.lastService',
  integrations: 'meridian.integrations',
} as const;

export const sessionPreferencesStore = {
  keys: KEYS,
  get(key: keyof typeof KEYS): string | null {
    try {
      return localStorage.getItem(KEYS[key]);
    } catch {
      return null;
    }
  },
  set(key: keyof typeof KEYS, value: string) {
    try {
      localStorage.setItem(KEYS[key], value);
    } catch {
      /* ignore */
    }
  },
  remove(key: keyof typeof KEYS) {
    try {
      localStorage.removeItem(KEYS[key]);
    } catch {
      /* ignore */
    }
  },
};
