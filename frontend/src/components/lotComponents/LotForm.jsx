import {useState} from 'react';
import {lotService} from "../../services/lotService.js";


export default function LotForm({onLotAdded}) {
    // Cuvamo stanje za sva polja koja backend trazi
    const [lotNumber, setLotNumber] = useState('');
    const [product, setProduct] = useState('');
    const [waferCount, setWaferCount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Saljemo JSON format koji ocekuje CreateLotCommand na backendu
            await lotService.create({
                lotNumber: lotNumber,
                product: product,
                waferCount: waferCount,
            });

            // Resetujemo formu
            setLotNumber('');
            setProduct('');
            setWaferCount('');

            // Obaveštavamo roditeljsku komponentu da osveži listu
            onLotAdded();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}
              style={{marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px'}}>
            <h3>Kreiraj Novi Lot</h3>
            {error && <p style={{color: 'red'}}>{error}</p>}

            <div style={{marginBottom: '10px'}}>
                <label>Broj serije (Lot Number): </label>
                <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    required
                    placeholder="npr. LOT-2026-001"
                    style={{padding: '8px', width: '100%', maxWidth: '300px', boxSizing: 'border-box'}}
                />
            </div>

            <div style={{marginBottom: '10px'}}>
                <label>Proizvod (Product): </label>
                <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    required
                    placeholder="npr. 100"
                    style={{padding: '8px', width: '100%', maxWidth: '300px', boxSizing: 'border-box'}}
                />
            </div>

            <div style={{marginBottom: '10px'}}>
                <label>Broj plocica (Wafer Count): </label>
                <input
                    type="number"
                    value={waferCount}
                    onChange={(e) => setWaferCount(e.target.value)}
                    required
                    placeholder="npr. 25"
                    style={{padding: '8px', width: '100%', maxWidth: '300px', boxSizing: 'border-box'}}
                />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
                {loading ? 'Čuvanje...' : 'Sačuvaj Lot'}
            </button>
        </form>
    );
}