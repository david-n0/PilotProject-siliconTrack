const API_BASE_URL = '/api';

export const waferService = {

    // Dohvata sve pločice (ili filtrirano po lotId ako se prosledi)

    async getAll(lotId = null) {
        const url = lotId ? `${API_BASE_URL}/wafers?lotId=${lotId}` : `${API_BASE_URL}/wafers`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Neuspešno dohvatanje pločica');
        return res.json();
    },

    // Dohvata sve pločice za određeni Lot
    async getByLot(lotId) {
        const res = await fetch(`${API_BASE_URL}/lots/${lotId}/wafers`);
        if (!res.ok) throw new Error(`Neuspešno dohvatanje pločica za Lot #${lotId}`);
        return res.json();
    },

    // Kreira novu pločicu
    async create(data) {
        const res = await fetch(`${API_BASE_URL}/wafers`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Neuspešno kreiranje pločice');
        return json;
    },

    // Menja status pločice ('ok' | 'defective' | 'scrapped')
    async updateStatus(id, status) {
        const res = await fetch(`${API_BASE_URL}/wafers/${id}/status`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({status})
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Neuspešna promena statusa');
        return json;
    },

    // Briše pločicu
    async delete(id) {
        const res = await fetch(`${API_BASE_URL}/wafers/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Neuspešno brisanje pločice');
        return res.json();
    }
};