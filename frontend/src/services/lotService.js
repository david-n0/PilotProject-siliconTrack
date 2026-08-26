import {apiFetch} from "./apiClient.js";

const API_BASE_URL = '/api';

export const lotService = {
    // Dohvatanje svih lot-ova
    async getAll() {
        const response = await apiFetch(`${API_BASE_URL}/lots`);
        if (!response.ok) throw new Error('Neuspešno preuzimanje Lot-ova');
        return response.json();
    },

    // Dohvatanje jednog specificnog lot-a po id-ju
    async getById(id) {
        const response = await apiFetch(`${API_BASE_URL}/lots/${id}`);
        if (!response.ok) throw new Error('Neuspešno preuzimanje detalja Lot-a');
        return response.json();
    },

    // Dohvatanje istorije promena statusa (Audit Trail)
    async getHistory(id) {
        const response = await apiFetch(`${API_BASE_URL}/lots/${id}/history`);
        if (!response.ok) throw new Error('Neuspešno preuzimanje istorije Lot-a');
        return response.json();
    },
    // Promena statusa sa opcionim komentarom inzenjera
    async updateStatus(id, status, note = null) {
        const response = await apiFetch(`${API_BASE_URL}/lots/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status, note}),
        });
        if (!response.ok) throw new Error('Neuspešna promena statusa');
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