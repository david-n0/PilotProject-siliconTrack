import { useState } from 'react';
import {lotService} from "../../services/lotService.js";


export default function LotForm({ onLotAdded }) {
    const [code, setCode] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Šaljemo podatak ka backendu
            await lotService.create({
                code: code,
                quantity: parseInt(quantity, 10)
            });

            // Resetujemo formu
            setCode('');
            setQuantity('');

            // Obaveštavamo roditeljsku komponentu da osveži listu
            onLotAdded();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h3>Kreiraj Novi Lot</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '10px' }}>
                <label>Kod Serije (Code): </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="npr. LOT-2026-001"
                    style={{ padding: '5px', width: '200px' }}
                />
            </div>

            <div style={{ marginBottom: '10px' }}>
                <label>Količina (Quantity): </label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="npr. 100"
                    style={{ padding: '5px', width: '200px' }}
                />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '8px 15px', cursor: 'pointer' }}>
                {loading ? 'Sačuvavam...' : 'Sačuvaj Lot'}
            </button>
        </form>
    );
}