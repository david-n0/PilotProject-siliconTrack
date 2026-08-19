import {apiFetch} from "./apiClient.js";

const API_BASE_URL = '/api';

export const defectService = {

    // Svi defekti u sistemu
    async getAll() {
        const res = await apiFetch(`${API_BASE_URL}/defects`);
        if (!res.ok) throw new Error('Neuspešno dohvatanje defekata');
        return res.json();
    },

    // Defekti za konkretnu plocicu (Wafer)
    async getByWafer(waferId) {
        const res = await apiFetch(`${API_BASE_URL}/wafers/${waferId}/defects`);
        if (!res.ok) throw new Error(`Greška pri dohvatanju defekata za pločicu #${waferId}`);
        return res.json();
    },

    // Prijava novog defekta
    async log(data) {
        const res = await apiFetch(`${API_BASE_URL}/defects`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Greška pri prijavi defekta');
        return json;
    },

    // Brisanje defekta
    async delete(id) {
        const res = await apiFetch(`${API_BASE_URL}/defects/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Neuspešno brisanje defekta');
        return res.json();
    }
};
