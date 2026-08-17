import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {lotService} from '../services/lotService';
import {waferService} from '../services/waferService';

export default function DashboardPage() {
    const [lots, setLots] = useState([]);
    const [wafers, setWafers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Zbog navigate()

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [lotsData, wafersData] = await Promise.all([
                    lotService.getAll(),
                    waferService.getAll()
                ]);
                setLots(lotsData);
                setWafers(wafersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const defectiveWafers = wafers.filter(w => w.status === 'defective').length;
    const scrappedWafers = wafers.filter(w => w.status === 'scrapped').length;
    const okWafers = wafers.filter(w => w.status === 'ok').length;

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Pregled Proizvodnje</h2>
                <p className="page-subtitle">Kliknite na bilo koju karticu za direktan pregled podataka</p>
            </div>
            <div className="stats-grid">
                <div onClick={() => navigate('/lots')} className="stat-card stat-card-blue">
                    <div className="stat-card-title">Ukupno Serija (Lots)</div>
                    <div className="stat-card-value" style={{color: '#0284c7'}}>{loading ? '...' : lots.length}</div>
                    <div className="stat-card-hint">Pregled serija →</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-gray">
                    <div className="stat-card-title">Ukupno Pločica (Wafers)</div>
                    <div className="stat-card-value" style={{color: '#0f294a'}}>{loading ? '...' : wafers.length}</div>
                    <div className="stat-card-hint">Pregled pločica →</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-green">
                    <div className="stat-card-title">Ispravne Pločice (OK)</div>
                    <div className="stat-card-value" style={{color: '#16a34a'}}>{loading ? '...' : okWafers}</div>
                    <div className="stat-card-hint">Detalji →</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-yellow">
                    <div className="stat-card-title">Defektne Pločice</div>
                    <div className="stat-card-value"
                         style={{color: '#eab308'}}>{loading ? '...' : defectiveWafers}</div>
                    <div className="stat-card-hint">Detalji →</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-red">
                    <div className="stat-card-title">Odbačene (Scrapped)</div>
                    <div className="stat-card-value" style={{color: '#dc2626'}}>{loading ? '...' : scrappedWafers}</div>
                    <div className="stat-card-hint">Detalji →</div>
                </div>
            </div>
            <div className="card">

            </div>
        </div>
    );
}
