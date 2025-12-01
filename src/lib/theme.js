import { writable } from 'svelte/store';

export const darkMode = writable(true);

export function toggleTheme() {
  darkMode.update(v => !v);
}