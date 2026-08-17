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

            // Obavestavamo roditeljsku komponentu da osvezi listu
            onLotAdded();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="card-title">
                Nova Proizvodna Serija (Lot)
            </h3>
            {error && (
                <div className="alert-error">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="form-grid">

                <div className="form-group">
                    <label className="form-label">
                        Broj Serije (Lot Number)
                    </label>
                    <input
                        type="text"
                        value={lotNumber}
                        onChange={(e) => setLotNumber(e.target.value)}
                        required
                        placeholder="npr. LOT-2026-001"
                        className="input-control"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Proizvod (Product)
                    </label>
                    <input
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        required
                        placeholder="npr. STM32-ARM-CORTEX"
                        className="input-control"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Broj Pločica (Wafer Count)
                    </label>
                    <input
                        type="number"
                        value={waferCount}
                        onChange={(e) => setWaferCount(e.target.value)}
                        required
                        min="1"
                        placeholder="npr. 25"
                        className="input-control"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Čuvanje...' : 'Sačuvaj Seriju'}
                    </button>
                </div>
            </form>
        </div>
    );
}