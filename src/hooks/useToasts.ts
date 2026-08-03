
import { useSyncExternalStore } from 'react';
import { toastStore } from '../stores/toastStore';

export function useToasts() {
  const toasts = useSyncExternalStore(toastStore.subscribe, toastStore.getSnapshot, toastStore.getSnapshot);
  return {
    toasts,
    toast: toastStore.push,
    clear: toastStore.clear,
  };
}
