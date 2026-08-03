export type ToastKind = 'info' | 'success' | 'warn' | 'error';

export type ToastItem = {
  id: number;
  msg: string;
  kind: ToastKind;
  icon: string;
};

type Listener = () => void;

let seq = 0;
let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const toastStore = {
  getSnapshot(): ToastItem[] {
    return toasts;
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  push(msg: string, kind: ToastKind = 'info', icon = 'check') {
    const id = ++seq;
    toasts = [...toasts, { id, msg, kind, icon }];
    emit();
    window.setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      emit();
    }, 3400);
  },
  clear() {
    toasts = [];
    emit();
  },
};
