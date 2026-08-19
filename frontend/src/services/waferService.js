import {apiFetch} from "./apiClient.js";

const API_BASE_URL = '/api';

export const waferService = {

    // Dohvata sve plocice (ili filtrirano po lotId ako se prosledi)

    async getAll(lotId = null) {
        const url = lotId ? `${API_BASE_URL}/wafers?lotId=${lotId}` : `${API_BASE_URL}/wafers`;
        const res = await apiFetch(url);
        if (!res.ok) throw new Error('Neuspešno dohvatanje pločica');
        return res.json();
    },

    // Dohvata sve plocice za određeni Lot
    async getByLot(lotId) {
        const res = await apiFetch(`${API_BASE_URL}/lots/${lotId}/wafers`);
        if (!res.ok) throw new Error(`Neuspešno dohvatanje pločica za Lot #${lotId}`);
        return res.json();
    },

    // Kreira novu plocicu
    async create(data) {
        const res = await apiFetch(`${API_BASE_URL}/wafers`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Neuspešno kreiranje pločice');
        return json;
    },

    // Menja status plocice ('ok' | 'defective' | 'scrapped')
    async updateStatus(id, status) {
        const res = await apiFetch(`${API_BASE_URL}/wafers/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({status})
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Neuspešna promena statusa');
        return json;
    },

    // Brise plocicu
    async delete(id) {
        const res = await apiFetch(`${API_BASE_URL}/wafers/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Neuspešno brisanje pločice');
        return res.json();
    }
};