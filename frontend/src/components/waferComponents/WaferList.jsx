import {waferService} from '../../services/waferService.js';
import {useNavigate} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";
import {useState} from "react";
import WaferStatusModal from "./WaferStatusModal.jsx";

export default function WaferList({wafers, onRefresh}) {
    const navigate = useNavigate();
    const {user} = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    const canEdit = isAdmin || user?.roles?.includes('ROLE_ENGINEER');

    // Stanje za modal popup
    const [modal, setModal] = useState({open: false, waferId: null, waferSerial: '', newStatus: '', reason: ''});
    const openStatusModal = (waferId, waferSerial, newStatus) => {
        setModal({open: true, waferId, waferSerial, newStatus, reason: ''});
    };
    const closeModal = () => {
        setModal({open: false, waferId: null, waferSerial: '', newStatus: '', reason: ''});
    };
    const confirmStatusChange = async () => {
        if (!modal.reason.trim()) return;
        try {
            await waferService.updateStatus(modal.waferId, modal.newStatus);
            closeModal();
            onRefresh();
        } catch (err) {
            alert(err.message);
        }
    };

    // const handleStatusChange = async (id, newStatus) => {
    //     try {
    //         await waferService.updateStatus(id, newStatus);
    //         onRefresh();
    //     } catch (err) {
    //         alert(err.message);
    //     }
    // };

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
        <div>
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
                                {canEdit ? (
                                    /* Inženjer i Admin mogu menjati status kroz dropdown */
                                    <select
                                        value={w.status}
                                        onChange={(e) => {
                                            if (e.target.value !== w.status) {
                                                openStatusModal(w.id, w.serialNumber, e.target.value);
                                                // Vrati dropdown na staru vrednost dok modal ne potvrdi
                                                e.target.value = w.status;
                                            }
                                        }}

                                        className={`badge badge-${w.status}`}
                                        style={{border: 'none', cursor: 'pointer', outline: 'none'}}
                                    >
                                        <option value="ok">OK</option>
                                        <option value="defective">DEFECTIVE</option>
                                        <option value="scrapped">SCRAPPED</option>
                                    </select>) : (
                                    /* Viewer samo gleda status */
                                    <span className={`badge badge-${w.status}`}>
                                        {w.status.toUpperCase()}
                                    </span>
                                )}
                            </td>
                            <td style={{textAlign: 'right'}}>
                                <button
                                    onClick={() => navigate(`/wafers/${w.id}`)}
                                    className="btn btn-secondary"
                                    style={{marginRight: '8px'}}
                                >
                                    Detalji →
                                </button>
                                {/* Samo Admin ima pravo na brisanje */}
                                {isAdmin && (<button onClick={() => handleDelete(w.id)} className="btn btn-danger">
                                    Obriši
                                </button>)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Izdvojeni Modal Komponent */}
            <WaferStatusModal
                isOpen={modal.open}
                waferSerial={modal.waferSerial}
                newStatus={modal.newStatus}
                reason={modal.reason}
                onReasonChange={(val) => setModal((prev) => ({...prev, reason: val}))}
                onClose={closeModal}
                onConfirm={confirmStatusChange}
            />
        </div>
    );
}
