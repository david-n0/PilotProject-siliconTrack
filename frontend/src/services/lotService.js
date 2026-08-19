import {apiFetch} from "./apiClient.js";

const API_BASE_URL = '/api';

export const lotService = {
    // Dohvatanje svih lot-ova
    async getAll() {
        const response = await apiFetch(`${API_BASE_URL}/lots`);
        if (!response.ok) throw new Error('Neuspešno preuzimanje Lot-ova');
        return response.json();
    },

    // Kreiranje novog lot-a (POST)
    async create(lotData) {
        const response = await apiFetch(`${API_BASE_URL}/lots`, {
            method: 'POST',
            body: JSON.stringify(lotData),
        });

        if (!response.ok) throw new Error('Neuspešno kreiranje Lot-a');
        return response.json();
    },

    // Brisanje lot-a
    async delete(id) {
        const response = await apiFetch(`${API_BASE_URL}/lots/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Neuspešno brisanje Lot-a');
        return response.json();
    }
};