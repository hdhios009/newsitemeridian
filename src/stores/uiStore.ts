type Listener = () => void;

type UiState = {
  notifOpen: boolean;
  userMenuOpen: boolean;
};

let state: UiState = { notifOpen: false, userMenuOpen: false };
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const uiStore = {
  getSnapshot(): UiState {
    return state;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  set(partial: Partial<UiState>) {
    state = { ...state, ...partial };
    emit();
  },
  toggleNotif() {
    state = { ...state, notifOpen: !state.notifOpen, userMenuOpen: false };
    emit();
  },
  toggleUserMenu() {
    state = { ...state, userMenuOpen: !state.userMenuOpen, notifOpen: false };
    emit();
  },
  closeMenus() {
    state = { ...state, notifOpen: false, userMenuOpen: false };
    emit();
  },
};
