import {lotService} from "../../services/lotService.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {formatDateTime} from "../../utils/format.js";
import {useState} from "react";
import ConfirmModal from "../ConfirmModal.jsx";

export default function LotList({lots, onLotDeleted}) {
    const [pendingId, setPendingId] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const confirmDelete = async () => {
        try {
            await lotService.delete(pendingId);
            setPendingId(null);
            onLotDeleted(); // Osvežavamo listu
        } catch (err) {
            setPendingId(null);
            setError(err.message);
        }
    };

    const {user} = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <div className="table-responsive">

            {error && <div className="alert-error">{error}</div>}

            <table className="table-custom">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Broj Serije</th>
                    <th>Proizvod</th>
                    <th>Pločica (Wafers)</th>
                    <th>Status</th>
                    <th>Pokrenuto</th>
                    <th>Akcija</th>
                </tr>
                </thead>
                <tbody>
                {lots.length > 0 ? (
                    lots.map((lot) => (
                        <tr key={lot.id} className="row-item">
                            <td style={{fontWeight: '600', color: '#94a3b8'}}>#{lot.id}</td>
                            <td style={{fontWeight: '700', color: '#0f294a'}}>{lot.lotNumber}</td>
                            <td>{lot.product}</td>
                            <td><span className="tag-lot">{lot.waferCount} komada</span></td>
                            <td>
                                <span className={`badge badge-${lot.status}`}>
                                    {lot.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </td>
                            <td style={{color: '#64748b',}}>{formatDateTime(lot.startedAt)}</td>

                            <td style={{textAlign: 'right'}}>
                                <button onClick={() => navigate(`/lots/${lot.id}`)} className="btn btn-secondary"
                                        style={{marginRight: '8px'}}>
                                    Detalji →
                                </button>

                                {isAdmin && (<button onClick={() => setPendingId(lot.id)} className="btn btn-danger">
                                    Obriši
                                </button>)}
                            </td>

                        </tr>
                    ))
                ) : (

                    <tr>
                        <td colSpan="7" style={{textAlign: 'center'}}>Nema kreiranih serija.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={pendingId !== null}
                title="Brisanje serije"
                message="Ova serija će biti trajno obrisana. Nastaviti?"
                confirmLabel="Obriši"
                onClose={() => setPendingId(null)}
                onConfirm={confirmDelete}
            />

        </div>
    );
}
