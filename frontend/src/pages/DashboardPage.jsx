import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {lotService} from '../services/lotService';
import {waferService} from '../services/waferService';
import {defectService} from "../services/defectService.js";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import SpcYieldChart from "../components/charts/SpcYieldChart.jsx";
import {formatDateTime} from "../utils/format.js";

const PIE_COLORS = ['#16a34a', '#eab308', '#dc2626'];
const BAR_COLORS = {
    scratch: '#0284c7',
    crack: '#dc2626',
    contamination: '#eab308',
    particle: '#8b5cf6',
    other: '#64748b'
};

export default function DashboardPage() {
    const [lots, setLots] = useState([]);
    const [wafers, setWafers] = useState([]);
    const [defects, setDefects] = useState([]);
    const [recentHistory, setRecentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [yieldTrend, setYieldTrend] = useState([]);
    const navigate = useNavigate(); // Zbog navigate()

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [lotsData, wafersData, defectsData] = await Promise.all([
                    lotService.getAll(),
                    waferService.getAll(),
                    defectService.getAll(),
                ]);
                setLots(lotsData);
                setWafers(wafersData);
                setDefects(defectsData);

                try {
                    const yieldData = await lotService.getYieldTrend();
                    setYieldTrend(yieldData);
                } catch (e) {
                    console.warn('Yield trend nedostupan:', e);
                }

                // Dohvati istoriju promena za poslednjih 5 aktivnosti (iz svih lotova)
                const allHistory = [];
                for (const lot of lotsData.slice(0, 10)) {
                    try {
                        const h = await lotService.getHistory(lot.id);
                        allHistory.push(...h.map(entry => ({...entry, lotNumber: lot.lotNumber, lotId: lot.id})));
                    } catch (e) {
                    }
                }
                // Sortiraj po datumu (najnovije prvo) i uzmi 5
                allHistory.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
                setRecentHistory(allHistory.slice(0, 5));
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

    // Proračun Yield-a
    const yieldNum = wafers.length > 0 ? (okWafers / wafers.length) * 100 : -1;
    const globalYield = yieldNum >= 0 ? yieldNum.toFixed(1) : 'N/A';

    // Dinamički meta podaci za Yield
    const getYieldMeta = (num, total) => {
        if (total === 0 || num < 0) {
            return {
                cssClass: 'stat-card-yield-empty',
                color: '#64748b',
                bg: '#e2e8f0',
                label: 'NEMA PLOČICA',
                hint: 'Nema unetih pločica'
            };
        }
        if (num >= 90) {
            return {
                cssClass: 'stat-card-yield-optimal',
                color: '#16a34a',
                bg: '#dcfce7',
                label: 'OPTIMALNO (≥90%)',
                hint: 'Proizvodni nivo u normi'
            };
        }
        if (num >= 75) {
            return {
                cssClass: 'stat-card-yield-warning',
                color: '#ca8a04',
                bg: '#fef9c3',
                label: 'UPOZORENJE (75-90%)',
                hint: 'Povećana stopa defekata'
            };
        }
        return {
            cssClass: 'stat-card-yield-critical',
            color: '#dc2626',
            bg: '#fee2e2',
            label: 'KRITIČNO (<75%)',
            hint: 'Zahteva hitnu proveru'
        };
    };
    const yieldMeta = getYieldMeta(yieldNum, wafers.length);

    // Podaci za Pie Chart (Status plocica)
    const pieData = [
        {name: 'OK', value: okWafers},
        {name: 'Defective', value: defectiveWafers},
        {name: 'Scrapped', value: scrappedWafers},
    ].filter(d => d.value > 0);

    // Podaci za Bar Chart (Defekti po tipu)
    const defectTypeCounts = {};
    defects.forEach(d => {
        defectTypeCounts[d.type] = (defectTypeCounts[d.type] || 0) + 1;
    });
    const barData = Object.entries(defectTypeCounts).map(([type, count]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        count,
        fill: BAR_COLORS[type] || BAR_COLORS.other,
    }));

    return (
        <div>
            <div className="page-header">
                <h2 className="page-title">Pregled Proizvodnje</h2>
                <p className="page-subtitle">Kliknite na bilo koju karticu za direktan pregled podataka</p>
            </div>
            <div className="stats-grid">
                {/* Yield */}
                <div className={`stat-card stat-card-yield ${yieldMeta.cssClass}`}>
                    <div className="yield-header">
                        <span className="stat-card-title"
                              style={{margin: 0, color: yieldMeta.color}}>Globalni Yield</span>
                        <span className="yield-badge-pill" style={{background: yieldMeta.bg, color: yieldMeta.color}}>
                            {yieldMeta.label}
                        </span>
                    </div>
                    <div className="stat-card-value" style={{color: yieldMeta.color, margin: '6px 0 2px'}}>
                        {loading ? '...' : wafers.length > 0 ? `${globalYield}%` : 'N/A'}
                    </div>
                    <div className="yield-progress-track">
                        <div
                            className="yield-progress-fill"
                            style={{width: `${Math.min(yieldNum, 100)}%`, backgroundColor: yieldMeta.color}}
                        />
                    </div>
                    {wafers.length > 0 && (
                        <span style={{fontSize: '11px', color: '#64748b', marginTop: '4px'}}>
                            {okWafers} od {wafers.length} pločica ispravno
                        </span>
                    )}
                    <span style={{fontSize: '11px', color: yieldMeta.color, fontWeight: '600', marginTop: '4px'}}>
                        {yieldMeta.hint}
                    </span>
                </div>
                <div onClick={() => navigate('/lots')} className="stat-card stat-card-blue">
                    <div className="stat-card-title">Ukupno Serija (Lots)</div>
                    <div className="stat-card-value" style={{color: '#0284c7'}}>{loading ? '...' : lots.length}</div>
                    <div className="stat-card-hint">Pregled serija</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-gray">
                    <div className="stat-card-title">Ukupno Plocica (Wafers)</div>
                    <div className="stat-card-value" style={{color: '#0f294a'}}>{loading ? '...' : wafers.length}</div>
                    <div className="stat-card-hint">Pregled plocica</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-green">
                    <div className="stat-card-title">Ispravne Plocice (OK)</div>
                    <div className="stat-card-value" style={{color: '#16a34a'}}>{loading ? '...' : okWafers}</div>
                    <div className="stat-card-hint">Detalji</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-yellow">
                    <div className="stat-card-title">Defektne Plocice</div>
                    <div className="stat-card-value"
                         style={{color: '#eab308'}}>{loading ? '...' : defectiveWafers}</div>
                    <div className="stat-card-hint">Detalji</div>
                </div>
                <div onClick={() => navigate('/wafers')} className="stat-card stat-card-red">
                    <div className="stat-card-title">Odbacene (Scrapped)</div>
                    <div className="stat-card-value" style={{color: '#dc2626'}}>{loading ? '...' : scrappedWafers}</div>
                    <div className="stat-card-hint">Detalji</div>
                </div>

            </div>

            {/* SPC Control Chart */}
            {!loading && yieldTrend.length > 0 && (
                <div style={{marginBottom: '24px'}}>
                    <SpcYieldChart data={yieldTrend}/>
                </div>
            )}

            {/* Grafikoni */}
            {!loading && (pieData.length > 0 || barData.length > 0) && (
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px'}}>
                    {/* Pie Chart - Status Plocica */}
                    {pieData.length > 0 && (
                        <div className="card">
                            <h3 className="card-title">Status Plocica</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {/* Bar Chart - Defekti po tipu */}
                    {barData.length > 0 && (
                        <div className="card">
                            <h3 className="card-title">Defekti po Tipu</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={barData} margin={{top: 5, right: 20, left: 0, bottom: 5}}>
                                    <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                    <YAxis allowDecimals={false} tick={{fontSize: 12}}/>
                                    <Tooltip/>
                                    <Bar dataKey="count" name="Broj defekata" radius={[6, 6, 0, 0]}>
                                        {barData.map((entry, index) => (
                                            <Cell key={`bar-${index}`} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}
            {/* Poslednje Aktivnosti (Recent Activity) */}
            {!loading && recentHistory.length > 0 && (
                <div className="card">
                    <h3 className="card-title">Poslednje Aktivnosti</h3>
                    <div className="table-responsive">
                        <table className="table-custom">
                            <thead>
                            <tr>
                                <th>Serija</th>
                                <th>Promena</th>
                                <th>Izmenio</th>
                                <th>Vreme</th>
                                <th>Napomena</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentHistory.map((h, i) => (
                                <tr key={i} className="row-item" style={{cursor: 'pointer'}}
                                    onClick={() => navigate(`/lots/${h.lotId}`)}>
                                    <td style={{fontWeight: '700', color: '#0f294a'}}>{h.lotNumber}</td>
                                    <td>
                                            <span className={`badge badge-${h.fromStatus}`} style={{fontSize: '11px'}}>
                                                {h.fromStatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                        <span style={{color: '#94a3b8', margin: '0 6px'}}>&rarr;</span>
                                        <span className={`badge badge-${h.toStatus}`} style={{fontSize: '11px'}}>
                                                {h.toStatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                    </td>
                                    <td style={{color: '#64748b', fontSize: '13px'}}>{h.changedByEmail}</td>
                                    <td style={{color: '#64748b', fontSize: '13px'}}>{formatDateTime(h.changedAt)}</td>
                                    <td style={{color: '#64748b', fontSize: '13px', maxWidth: '200px'}}>
                                        {h.note || '-'}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
