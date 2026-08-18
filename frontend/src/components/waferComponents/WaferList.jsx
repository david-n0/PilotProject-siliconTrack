import {waferService} from '../../services/waferService.js';
import {useNavigate} from 'react-router-dom';

export default function WaferList({wafers, onRefresh}) {
    const navigate = useNavigate();

    const handleStatusChange = async (id, newStatus) => {
        try {
            await waferService.updateStatus(id, newStatus);
            onRefresh();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovu pločicu?')) {
            try {
                await waferService.delete(id);
                onRefresh();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (wafers.length === 0) {
        return <div className="empty-state">Trenutno nema unetih pločica.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table-custom">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Serijski Broj</th>
                    <th>Pripada Seriji</th>
                    <th>Pozicija</th>
                    <th>Status</th>
                    <th style={{textAlign: 'right'}}>Akcije</th>
                </tr>
                </thead>
                <tbody>
                {wafers.map((w) => (
                    <tr key={w.id} className="row-item">
                        <td style={{fontWeight: '600', color: '#94a3b8'}}>#{w.id}</td>
                        <td style={{fontWeight: '700', color: '#0f294a'}}>{w.serialNumber}</td>
                        <td><span className="tag-lot">{w.lotNumber}</span></td>
                        <td>Slot #{w.position}</td>
                        <td>
                            <select
                                value={w.status}
                                onChange={(e) => handleStatusChange(w.id, e.target.value)}
                                className={`badge badge-${w.status}`}
                                style={{border: 'none', cursor: 'pointer', outline: 'none'}}
                            >
                                <option value="ok">OK</option>
                                <option value="defective">DEFECTIVE</option>
                                <option value="scrapped">SCRAPPED</option>
                            </select>
                        </td>
                        <td style={{textAlign: 'right'}}>
                            <button
                                onClick={() => navigate(`/wafers/${w.id}`)}
                                className="btn btn-secondary"
                                style={{marginRight: '8px'}}
                            >
                                Detalji
                            </button>
                            <button onClick={() => handleDelete(w.id)} className="btn btn-danger">
                                Obriši
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
