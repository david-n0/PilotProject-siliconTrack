import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {waferService} from '../services/waferService.js';
import {defectService} from '../services/defectService.js';
import DefectForm from '../components/defectComponents/DefectForm.jsx';
import DefectList from '../components/defectComponents/DefectList.jsx';
import {useAuth} from "../context/AuthContext.jsx";

export default function WaferDetailPage() {
    const {id} = useParams();   // grabs :id from the URL /wafers/3
    const {user} = useAuth();
    const canEdit = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ENGINEER');
    const navigate = useNavigate();

    const [wafer, setWafer] = useState(null);
    const [defects, setDefects] = useState([]);

    const [loading, setLoading] = useState(true);
    const loadData = async () => {
        try {
            const [allWafers, defectsData] = await Promise.all([
                waferService.getById(id),
                defectService.getByWafer(id)
            ]);
            setWafer(allWafers);
            setDefects(defectsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        loadData();
    }, [id]);

    if (loading) return <div className="card">Loading...</div>;
    if (!wafer) return <div className="card">Wafer not found.</div>;


    return (
        <div>
            {/* Header */}
            <div className="page-header"
                 style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    ← Nazad na Plocice
                </button>
                <div>
                    <h1 className="page-title">Wafer: {wafer.serialNumber}</h1>
                    <p className="page-subtitle">Lot: <strong>{wafer.lotNumber}</strong> &bull; Slot #{wafer.position}</p>
                </div>
                <span className={`badge badge-${wafer.status}`}>
                    {wafer.status.toUpperCase()}
                </span>
            </div>

            {/* Defect Form — logs a new defect */}
            {/* Forma za prijavljivanje defekta - samo za Admina i Inzenjera */}
            {canEdit && (
                <DefectForm waferId={parseInt(id)} onDefectLogged={loadData}/>
            )}
            {/* Defect List*/}
            <div className="card" style={{marginTop: '20px'}}>
                <h2 className="card-title">Istorija defekata ({defects.length})</h2>
                <DefectList defects={defects} onRefresh={loadData}/>
            </div>
        </div>
    );
}
