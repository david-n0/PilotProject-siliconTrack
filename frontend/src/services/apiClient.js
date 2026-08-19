import { authService } from './authService.js';

// Ova funkcija je "zamena" za fetch() — automatski dodaje JWT token
// Koristi je umesto fetch() u svim servisima
export async function apiFetch(url, options = {}) {
    const token = authService.getToken();

    const headers = {
        'Content-Type': 'application/json',
        // Ako token postoji, dodaj ga — ako ne, salji bez njega
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
}
