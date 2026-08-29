import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {lotService} from '../services/lotService.js';
import {waferService} from '../services/waferService.js';
import {useAuth} from '../context/AuthContext.jsx';

const STATUS_LABELS = {
    pending: 'PENDING (Na cekanju)',
    in_production: 'IN PRODUCTION (U proizvodnji)',
    hold: 'HOLD (SPC Zaustavljanje)',
    completed: 'COMPLETED (Zavrseno)',
    rejected: 'REJECTED (Odbijeno)',
};

export default function LotDetailPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const canEdit = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ENGINEER');

    const [lot, setLot] = useState(null);
    const [history, setHistory] = useState([]);
    const [wafers, setWafers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newStatus, setNewStatus] = useState('');
    const [note, setNote] = useState('');
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const [lotData, lotWafers] = await Promise.all([
                lotService.getById(id),
                waferService.getByLot(id),
            ]);
            setLot(lotData);
            setWafers(lotWafers);

            // Istoriju ucitavamo bezbedno
            try {
                const historyData = await lotService.getHistory(id);
                setHistory(historyData);
            } catch (histErr) {
                console.warn('Istorija trenutno nije dostupna:', histErr);
                setHistory([]);
            }

            // Postavi prvi dozvoljeni status kao default
            const allowed = lotData.allowedNext ?? [];
            setNewStatus(allowed.length > 0 ? allowed[0] : '');
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
        if (!note.trim()) {
            setError('Morate uneti razlog promene statusa (inženjersku napomenu)!');
            return;
        }
        if (!newStatus) {
            setError('Morate izabrati novi status.');
            return;
        }

        setUpdating(true);
        setError('');
        try {
            await lotService.updateStatus(id, newStatus, note.trim());
            setNote('');
            await loadData();
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="card"><p style={{color: '#0284c7'}}>Ucitavanje detalja serije...</p></div>;
    if (!lot) return <div className="card"><p>Serija nije pronadjena.</p></div>;

    const okWafers = wafers.filter(w => w.status === 'ok').length;
    const defectiveWafers = wafers.filter(w => w.status === 'defective').length;
    const scrappedWafers = wafers.filter(w => w.status === 'scrapped').length;

    const yieldNum = wafers.length > 0 ? (okWafers / wafers.length) * 100 : -1;
    const yieldRate = yieldNum >= 0 ? yieldNum.toFixed(1) : 'N/A';

    const getYieldMeta = (num) => {
        if (num < 0) return {
            cssClass: 'stat-card-yield-empty',
            color: '#64748b',
            bg: '#e2e8f0',
            label: 'NEMA PODATAKA'
        };
        if (num >= 90) return {
            cssClass: 'stat-card-yield-optimal',
            color: '#16a34a',
            bg: '#dcfce7',
            label: 'OPTIMALNO'
        };
        if (num >= 75) return {
            cssClass: 'stat-card-yield-warning',
            color: '#ca8a04',
            bg: '#fef9c3',
            label: 'UPOZORENJE'
        };
        return {cssClass: 'stat-card-yield-critical', color: '#dc2626', bg: '#fee2e2', label: 'KRITICNO'};
    };
    const yieldMeta = getYieldMeta(yieldNum);

    // Dozvoljeni prelazi iz trenutnog statusa
    const allowedNext = lot.allowedNext ?? [];
    const isFinished = allowedNext.length === 0;

    return (
        <div>
            {/* Header */}
            <div className="page-header"
                 style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <button onClick={() => navigate('/lots')} className="btn btn-secondary">← Nazad</button>
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
                <div className={`stat-card stat-card-yield ${yieldMeta.cssClass}`}>
                    <div className="yield-header">
                        <span className="stat-card-title"
                              style={{margin: 0, color: yieldMeta.color}}>Yield Serije</span>
                        <span className="yield-badge-pill"
                              style={{background: yieldMeta.bg, color: yieldMeta.color}}>{yieldMeta.label}</span>
                    </div>
                    <div className="stat-card-value" style={{color: yieldMeta.color, margin: '6px 0 2px'}}>
                        {yieldRate}{yieldNum >= 0 ? '%' : ''}
                    </div>
                    {yieldNum >= 0 && (
                        <>
                            <div className="yield-progress-track">
                                <div className="yield-progress-fill"
                                     style={{width: `${Math.min(yieldNum, 100)}%`, backgroundColor: yieldMeta.color}}/>
                            </div>
                            <span style={{fontSize: '11px', color: '#64748b', marginTop: '4px'}}>
                                {okWafers} od {wafers.length} plocica ispravno
                            </span>
                        </>
                    )}
                </div>
                <div className="stat-card stat-card-blue">
                    <p className="stat-card-title">Evidentirano / Planirano</p>
                    <p className="stat-card-value" style={{color: '#0284c7'}}>{wafers.length} / {lot.waferCount}</p>
                </div>
                <div className="stat-card stat-card-green">
                    <p className="stat-card-title">Ispravne (OK)</p>
                    <p className="stat-card-value" style={{color: '#16a34a'}}>{okWafers}</p>
                </div>
                <div className="stat-card stat-card-yellow">
                    <p className="stat-card-title">Defektne</p>
                    <p className="stat-card-value" style={{color: '#ca8a04'}}>{defectiveWafers}</p>
                </div>
                <div className="stat-card stat-card-red">
                    <p className="stat-card-title">Skart</p>
                    <p className="stat-card-value" style={{color: '#dc2626'}}>{scrappedWafers}</p>
                </div>
            </div>

            {/* Forma za promenu statusa */}
            {canEdit && !isFinished && (
                <div className="card">
                    <h3 className="card-title">Azuriranje Statusa Serije</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <form onSubmit={handleStatusChange} className="form-grid"
                          style={{gridTemplateColumns: '220px 1fr auto'}}>
                        <div className="form-group">
                            <label className="form-label">Novi Status</label>
                            <select className="input-control" value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}>
                                {allowedNext.map(s => (
                                    <option key={s} value={s}>{STATUS_LABELS[s] || s.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Razlog Promene (obavezno)</label>
                            <input
                                type="text"
                                className="input-control"
                                placeholder="Unesite razlog promene statusa..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary" disabled={updating}>
                                {updating ? 'Cuvanje...' : 'Sacuvaj'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Finalni status — nema dalje */}
            {isFinished && (
                <div className="card"
                     style={{border: '2px solid ' + (lot.status === 'completed' ? '#16a34a' : '#dc2626')}}>
                    <p style={{
                        margin: 0,
                        fontWeight: '500',
                        color: lot.status === 'completed' ? '#16a34a' : '#dc2626'
                    }}>
                        {lot.status === 'completed' ? 'Serija je uspesno zavrsena.' : 'Serija je odbijena.'} Dalji
                        prelazi statusa nisu mogući.
                    </p>
                </div>
            )}

            {/* Dva stupca: Audit Trail i Plocice */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(320px, 1fr) 2fr',
                gap: '20px',
                marginTop: '20px'
            }}>
                {/* Timeline */}
                <div className="card">
                    <h2 className="card-title">Sledljivost & Istorija Promena</h2>
                    {history.length === 0 ? (
                        <div className="empty-state">
                            <p style={{margin: 0}}>Nema zabelezenih promena.</p>
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
                                            <span className={`badge badge-${h.fromStatus}`}
                                                  style={{fontSize: '11px'}}>{h.fromStatus.replace('_', ' ').toUpperCase()}</span>
                                            <span style={{color: '#94a3b8', fontWeight: '700'}}>&rarr;</span>
                                            <span className={`badge badge-${h.toStatus}`}
                                                  style={{fontSize: '11px'}}>{h.toStatus.replace('_', ' ').toUpperCase()}</span>
                                            {h.changedByEmail === 'system@silicontrack' && (
                                                <span className="badge"
                                                      style={{
                                                          background: '#fee2e2',
                                                          color: '#dc2626',
                                                          fontSize: '10px'
                                                      }}>
                                                    AUTO
                                                </span>
                                            )}
                                        </div>
                                        <p style={{margin: '4px 0 2px', fontSize: '12px', color: '#64748b'}}>
                                            Izmenio: <strong>{h.changedByEmail}</strong>
                                        </p>
                                        <p style={{
                                            margin: '2px 0',
                                            fontSize: '11px',
                                            color: '#94a3b8'
                                        }}>{h.changedAt}</p>
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

                {/* Tabela plocica */}
                <div className="card">
                    <h2 className="card-title">Plocice u seriji ({wafers.length})</h2>
                    {wafers.length === 0 ? (
                        <div className="empty-state"><p style={{margin: 0}}>Nema kreiranih plocica za ovu seriju.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                <tr>
                                    <th>Serijski Broj</th>
                                    <th>Pozicija</th>
                                    <th>Status</th>
                                    <th>Kreirano</th>
                                    <th style={{textAlign: 'right'}}>Akcija</th>
                                </tr>
                                </thead>
                                <tbody>
                                {wafers.map((w) => (
                                    <tr key={w.id} className="row-item">
                                        <td style={{fontWeight: '700', color: '#0f294a'}}>{w.serialNumber}</td>
                                        <td>#{w.position}</td>
                                        <td><span className={`badge badge-${w.status}`}>{w.status.toUpperCase()}</span>
                                        </td>
                                        <td style={{color: '#64748b', fontSize: '13px'}}>{w.createdAt}</td>
                                        <td style={{textAlign: 'right'}}>
                                            <button onClick={() => navigate(`/wafers/${w.id}`)}
                                                    className="btn btn-secondary"
                                                    style={{padding: '6px 12px', fontSize: '12px'}}>
                                                Defekti &rarr;
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
