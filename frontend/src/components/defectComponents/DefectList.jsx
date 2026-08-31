import {useState} from 'react';
import {defectService} from '../../services/defectService.js';
import {useAuth} from "../../context/AuthContext.jsx";
import {formatDateTime} from '../../utils/format.js';
import ConfirmModal from "../ConfirmModal.jsx";

// minor → green (badge-ok), major → yellow (badge-defective), critical → red (badge-rejected)
const severityClass = {
    minor: 'badge badge-ok',
    major: 'badge badge-in_production',
    critical: 'badge badge-rejected'
};

export default function DefectList({defects, onRefresh}) {
    const {user} = useAuth();
    const [pendingId, setPendingId] = useState(null);
    const [error, setError] = useState(null);

    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    const confirmDelete = async () => {
        try {
            await defectService.delete(pendingId);
            setPendingId(null);
            onRefresh();
        } catch (err) {
            setPendingId(null);
            setError(err.message);
        }
    };

    if (defects.length === 0) {
        return <div className="empty-state">Nema zabeleženih defekata za ovu pločicu.</div>;
    }

    return (
        <div className="table-responsive">

            {error && <div className="alert-error">{error}</div>}

            <table className="table-custom">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tip</th>
                    <th>Ozbiljnost</th>
                    <th>Opis</th>
                    <th>Vreme</th>
                    <th style={{textAlign: 'right'}}>Akcija</th>
                </tr>
                </thead>
                <tbody>
                {defects.map((d) => (
                    <tr key={d.id} className="row-item">
                        <td style={{fontWeight: '600', color: '#94a3b8'}}>#{d.id}</td>
                        <td style={{fontWeight: '600', color: '#0f294a'}}>{d.type}</td>
                        <td>
                                <span className={severityClass[d.severity] || 'badge'}>
                                    {d.severity.toUpperCase()}
                                </span>
                        </td>
                        <td style={{color: '#64748b', maxWidth: '200px'}}>{d.description || '-'}
                        </td>
                        <td style={{color: '#64748b'}}>{formatDateTime(d.detectedAt)}</td>
                        <td style={{textAlign: 'right'}}>
                            {/* Samo Admin moze brisati defekte */}
                            {isAdmin && (
                                <button onClick={() => setPendingId(d.id)} className="btn btn-danger">
                                    Obriši
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <ConfirmModal
                isOpen={pendingId !== null}
                title="Brisanje defekta"
                message="Ovaj defekt će biti trajno obrisan. Nastaviti?"
                confirmLabel="Obriši"
                onClose={() => setPendingId(null)}
                onConfirm={confirmDelete}
            />

        </div>
    );
}
