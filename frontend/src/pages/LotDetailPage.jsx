import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {lotService} from '../services/lotService.js';
import {waferService} from '../services/waferService.js';
import {useAuth} from '../context/AuthContext.jsx';

export default function LotDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const canEdit = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ENGINEER');

    const [lot, setLot] = useState(null);
    const [history, setHistory] = useState([]);
    const [wafers, setWafers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stanja za formu promene statusa
    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const [updating, setUpdating] = useState(false);

    const loadData = async () => {
        try {
            const [lotData, historyData, lotWafers] = await Promise.all([
                lotService.getById(id),
                lotService.getHistory(id),
                waferService.getByLot(id),
            ]);
            setLot(lotData);
            setHistory(historyData);
            setWafers(lotWafers);
            setNewStatus(lotData.status);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const handleStatusChange = async (e) => {
        e.preventDefault();
        if (newStatus === lot.status && !note) return;

        setUpdating(true);
        try {
            await lotService.updateStatus(id, newStatus, note);
            setNote('');
            await loadData();
        } catch (err) {
            alert(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="card"><p style={{color: '#0284c7'}}>Ucitavanje detalja serije...</p></div>;
    if (!lot) return <div className="card"><p>Serija nije pronadjena.</p></div>;

    // Proracun fabrickog Yield-a
    const okWafers = wafers.filter(w => w.status === 'ok').length;
    const defectiveWafers = wafers.filter(w => w.status === 'defective').length;
    const scrappedWafers = wafers.filter(w => w.status === 'scrapped').length;

    const yieldNum = wafers.length > 0 ? (okWafers / wafers.length) * 100 : 0;
    const yieldRate = yieldNum.toFixed(1);
    // Dinamicki meta podaci za Yield
    const getYieldMeta = (num, total) => {
        if (total === 0) {
            return {
                cssClass: 'stat-card-yield-empty',
                color: '#64748b',
                bg: '#e2e8f0',
                label: 'NEMA PLOČICA',
                hint: 'Unesite prve pločice'
            };
        }
        if (num >= 90) {
            return {
                cssClass: 'stat-card-yield-optimal',
                color: '#16a34a',
                bg: '#dcfce7',
                label: 'OPTIMALNO (≥90%)',
                hint: 'Odličan kvalitet serije'
            };
        }
        if (num >= 75) {
            return {
                cssClass: 'stat-card-yield-warning',
                color: '#ca8a04',
                bg: '#fef9c3',
                label: 'UPOZORENJE (75-90%)',
                hint: 'Povećan udeo defekata'
            };
        }
        return {
            cssClass: 'stat-card-yield-critical',
            color: '#dc2626',
            bg: '#fee2e2',
            label: 'KRITIČNO (<75%)',
            hint: 'Visok rizik od škarta'
        };
    };
    const yieldMeta = getYieldMeta(yieldNum, wafers.length);

    return (
        <div>
            {/* Header sa navigacijom nazad */}
            <div className="page-header"
                 style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <button onClick={() => navigate('/lots')} className="btn btn-secondary">
                        Nazad
                    </button>
                    <div>
                        <h1 className="page-title" style={{margin: 0}}>Serija: {lot.lotNumber}</h1>
                        <p className="page-subtitle" style={{margin: '4px 0 0'}}>
                            Proizvod: <strong>{lot.product}</strong> &bull; Pokrenuto: {lot.startedAt}
                        </p>
                    </div>
                </div>
                <span className={`badge badge-${lot.status}`} style={{fontSize: '14px', padding: '8px 16px'}}>
                    {lot.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            {/* KPI Statistika */}
            <div className="stats-grid">

                {/* Dinamicka Yield Kartica za ovaj Lot */}
                <div className={`stat-card stat-card-yield ${yieldMeta.cssClass}`}>
                    <div className="yield-header">
                        <span className="stat-card-title"
                              style={{margin: 0, color: yieldMeta.color}}>Yield Serije</span>
                        <span className="yield-badge-pill" style={{background: yieldMeta.bg, color: yieldMeta.color}}>
                            {yieldMeta.label}
                        </span>
                    </div>
                    <div className="stat-card-value" style={{color: yieldMeta.color, margin: '6px 0 2px'}}>
                        {wafers.length > 0 ? `${yieldRate}%` : 'N/A'}
                    </div>
                    <div className="yield-progress-track">
                        <div
                            className="yield-progress-fill"
                            style={{width: `${Math.min(yieldNum, 100)}%`, backgroundColor: yieldMeta.color}}
                        />
                    </div>
                    <span style={{fontSize: '11px', color: yieldMeta.color, fontWeight: '600', marginTop: '4px'}}>
                        {yieldMeta.hint}
                    </span>
                </div>

                <div className="stat-card stat-card-blue">
                    <p className="stat-card-title">Planirano / Evidentirano</p>
                    <p className="stat-card-value" style={{color: '#0284c7'}}>{wafers.length} / {lot.waferCount}</p>
                </div>

                <div className="stat-card stat-card-green">
                    <p className="stat-card-title">OK Plocice</p>
                    <p className="stat-card-value" style={{color: '#16a34a'}}>{okWafers}</p>
                </div>

                <div className="stat-card stat-card-yellow">
                    <p className="stat-card-title">Defektne</p>
                    <p className="stat-card-value" style={{color: '#ca8a04'}}>{defectiveWafers}</p>
                </div>

                <div className="stat-card stat-card-red">
                    <p className="stat-card-title">Skart (Scrap)</p>
                    <p className="stat-card-value" style={{color: '#dc2626'}}>{scrappedWafers}</p>
                </div>
            </div>

            {/* Forma za promenu statusa */}
            {canEdit && (
                <div className="card">
                    <h3 className="card-title">Azuriranje Statusa Serije</h3>
                    <form onSubmit={handleStatusChange} className="form-grid"
                          style={{gridTemplateColumns: '200px 1fr auto'}}>
                        <div className="form-group">
                            <label className="form-label">Novi Status</label>
                            <select
                                className="input-control"
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="pending">PENDING</option>
                                <option value="in_production">IN PRODUCTION</option>
                                <option value="hold">HOLD (SPC Zaustavljanje)</option>
                                <option value="completed">COMPLETED</option>
                                <option value="rejected">REJECTED</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Inzenjerska Napomena (opciono)</label>
                            <input
                                type="text"
                                className="input-control"
                                placeholder="Npr. Stavljeno na Hold zbog SPC alarma na plocici #SN-1042..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">&nbsp;</label>
                            <button type="submit" className="btn btn-primary" disabled={updating}>
                                {updating ? 'Cuvanje...' : 'Sacuvaj Status'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Dva stupca: Audit Trail i Plocice */}
            <div style={{display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '20px'}}>

                {/* Vremenska linija (Lot History Timeline) */}
                <div className="card">
                    <h2 className="card-title">Sledljivost - Istorija Promena</h2>

                    {history.length === 0 ? (
                        <div className="empty-state">
                            <p>Nema zabelezenih promena statusa za ovu seriju.</p>
                            <p style={{fontSize: '12px'}}>Promenite status iznad da zapocnete audit trail.</p>
                        </div>
                    ) : (
                        <div className="timeline">
                            {history.map((h) => (
                                <div key={h.id} className="timeline-item">
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            marginBottom: '4px',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span className={`badge badge-${h.fromStatus}`} style={{fontSize: '11px'}}>
                                                {h.fromStatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span style={{color: '#94a3b8', fontWeight: '700'}}>&rarr;</span>
                                            <span className={`badge badge-${h.toStatus}`} style={{fontSize: '11px'}}>
                                                {h.toStatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{margin: '4px 0 2px', fontSize: '12px', color: '#64748b'}}>
                                            Izmenio: <strong>{h.changedByEmail}</strong>
                                        </p>
                                        <p style={{margin: '2px 0', fontSize: '11px', color: '#94a3b8'}}>
                                            {h.changedAt}
                                        </p>
                                        {h.note && (
                                            <p style={{
                                                margin: '6px 0 0',
                                                fontSize: '13px',
                                                color: '#0f294a',
                                                background: '#f0f9ff',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                borderLeft: '3px solid #0284c7'
                                            }}>
                                                <em>"{h.note}"</em>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tabela plocica u ovoj seriji */}
                <div className="card">
                    <h2 className="card-title">Plocice u ovoj seriji ({wafers.length})</h2>

                    {wafers.length === 0 ? (
                        <div className="empty-state">
                            <p>Nema kreiranih plocica za ovu seriju.</p>
                            <p style={{fontSize: '12px'}}>Idite na stranicu Plocice da dodate nove.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                <tr>
                                    <th>Serijski Broj</th>
                                    <th>Slot #</th>
                                    <th>Status</th>
                                    <th>Kreirano</th>
                                    <th style={{textAlign: 'right'}}>Akcija</th>
                                </tr>
                                </thead>
                                <tbody>
                                {wafers.map((w) => (
                                    <tr key={w.id} className="row-item">
                                        <td style={{fontWeight: '700', color: '#0f294a'}}>{w.serialNumber}</td>
                                        <td><span className="tag-lot">Slot #{w.position}</span></td>
                                        <td>
                                                <span className={`badge badge-${w.status}`}>
                                                    {w.status.toUpperCase()}
                                                </span>
                                        </td>
                                        <td style={{color: '#64748b', fontSize: '13px'}}>{w.createdAt}</td>
                                        <td style={{textAlign: 'right'}}>
                                            <button
                                                onClick={() => navigate(`/wafers/${w.id}`)}
                                                className="btn btn-secondary"
                                                style={{padding: '6px 12px', fontSize: '12px'}}
                                            >
                                                Defekti
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
