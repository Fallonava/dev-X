import { writable } from 'svelte/store';

export const modal = writable({ open: false, content: null });

export function openModal(project) {
  modal.set({ open: true, content: project });
}

export function closeModal() {
  modal.set({ open: false, content: null });
}