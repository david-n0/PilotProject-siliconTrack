import {lotService} from "../../services/lotService.js";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

export default function LotList({lots, onLotDeleted}) {
    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovaj Lot?')) {
            try {
                await lotService.delete(id);
                onLotDeleted(); // Osvežavamo listu
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const { user } = useAuth();
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    return (
        <div className="table-responsive">
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
                            <td style={{color: '#64748b',}}>{lot.startedAt}</td>

                            <td style={{textAlign: 'right'}}>
                                <button onClick={() => navigate('/wafers')} className="btn btn-secondary"
                                        style={{marginRight: '8px'}}>
                                    Pločice
                                </button>

                                {isAdmin && (<button onClick={() => handleDelete(lot.id)} className="btn btn-danger">
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

        </div>
    );
}
