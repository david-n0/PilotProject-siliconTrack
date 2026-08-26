import {useState, useEffect} from 'react';
import {waferService} from '../../services/waferService.js';

export default function WaferForm({lots, onWaferAdded}) {
    const [serialNumber, setSerialNumber] = useState('');
    const [position, setPosition] = useState('');
    const [selectedLotId, setSelectedLotId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Automatski selektuj prvi lot iz liste ako nije izabran
    useEffect(() => {
        if (lots.length > 0 && !selectedLotId) {
            setSelectedLotId(lots[0].id);
        }
    }, [lots, selectedLotId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await waferService.create({
                serialNumber: serialNumber.trim(),
                position: parseInt(position, 10),
                lotId: parseInt(selectedLotId, 10)
            });

            // Reset polja
            setSerialNumber('');
            setPosition('');

            // Obaveštavamo roditelja da osveži podatke
            onWaferAdded();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="card-title">Dodaj Novu Pločicu (Wafer)</h3>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label className="form-label">Pripada Seriji (Lot):</label>
                    <select
                        value={selectedLotId}
                        onChange={(e) => setSelectedLotId(e.target.value)}
                        required
                        className="select-control"
                    >
                        {lots.map(lot => (
                            <option key={lot.id} value={lot.id}>
                                {lot.lotNumber} ({lot.product})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Serijski Broj:</label>
                    <input
                        type="text"
                        placeholder="npr. WFR-001-01"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        required
                        className="input-control"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Pozicija u kaseti (1-25):</label>
                    <input
                        type="number"
                        placeholder="npr. 1"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                        min="1"
                        max="25"
                        className="input-control"
                    />
                </div>

                <button type="submit" disabled={loading || lots.length === 0} className="btn btn-primary">
                    {loading ? 'Čuvanje...' : 'Sačuvaj Pločicu'}
                </button>
            </form>
        </div>
    );
}
