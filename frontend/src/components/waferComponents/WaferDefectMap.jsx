const GRID_SIZE = 21;  // 21x21 die grid (standard za 300mm wafer)
const CELL_SIZE = 16;
const RADIUS = (GRID_SIZE * CELL_SIZE) / 2;
const CENTER = RADIUS + 2;

const SEVERITY_COLORS = {
    critical: '#ef4444',
    major: '#f97316',
    minor: '#eab308',
};

export default function WaferDefectMap({defects = []}) {
    // Pravi mapu defektnih die pozicija
    const defectMap = {};
    defects.forEach(d => {
        const key = `${d.dieRow}-${d.dieCol}`;
        // Čuvamo najgori severity za svaki die
        if (!defectMap[key] || severityRank(d.severity) > severityRank(defectMap[key].severity)) {
            defectMap[key] = d;
        }
    });

    function severityRank(s) {
        if (s === 'critical') return 3;
        if (s === 'major') return 2;
        return 1;
    }

    // Proveri da li je die unutar wafer kruga
    function isInsideWafer(row, col) {
        const cx = (col + 0.5) * CELL_SIZE - RADIUS;
        const cy = (row + 0.5) * CELL_SIZE - RADIUS;
        return Math.sqrt(cx * cx + cy * cy) <= RADIUS - 4;
    }

    const dies = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (!isInsideWafer(row, col)) continue;
            const key = `${row}-${col}`;
            const defect = defectMap[key];
            dies.push({row, col, defect});
        }
    }

    const totalDies = dies.length;
    const defectDies = Object.keys(defectMap).length;
    const goodDies = totalDies - defectDies;

    return (
        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <h3 className="card-title" style={{margin: 0}}>Wafer Defect Map</h3>
                <div style={{display: 'flex', gap: '12px', fontSize: '12px'}}>
                    <span><span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: '#dcfce7',
                        border: '1px solid #bbf7d0',
                        marginRight: 4
                    }}></span>OK ({goodDies})</span>
                    <span><span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: '#f97316',
                        marginRight: 4
                    }}></span>Minor</span>
                    <span><span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: '#eab308',
                        marginRight: 4
                    }}></span>Major</span>
                    <span><span style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: '#ef4444',
                        marginRight: 4
                    }}></span>Critical</span>
                </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'center'}}>
                <svg width={CENTER * 2} height={CENTER * 2} viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}>
                    {/* Pozadinski krug wafera */}
                    <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#f0f4f8" stroke="#cbd5e1" strokeWidth="2"/>

                    {/* Notch (oznaka orijentacije na dnu) */}
                    <rect x={CENTER - 6} y={CENTER + RADIUS - 3} width="12" height="6" rx="2" fill="#94a3b8"/>

                    {/* Die Grid */}
                    {dies.map(({row, col, defect}) => {
                        const x = col * CELL_SIZE + 2;
                        const y = row * CELL_SIZE + 2;
                        const fill = defect ? SEVERITY_COLORS[defect.severity] || '#f97316' : '#dcfce7';
                        const stroke = defect ? '#0f294a' : '#bbf7d0';

                        return (
                            <g key={`${row}-${col}`}>
                                <rect
                                    x={x} y={y}
                                    width={CELL_SIZE - 1}
                                    height={CELL_SIZE - 1}
                                    rx="2"
                                    fill={fill}
                                    stroke={stroke}
                                    strokeWidth="0.5"
                                    style={{cursor: defect ? 'pointer' : 'default'}}
                                >
                                    <title>
                                        {defect
                                            ? `Die [${row}, ${col}] - ${defect.type.toUpperCase()} (${defect.severity}) - ${defect.description || ''}`
                                            : `Die [${row}, ${col}] - OK`
                                        }
                                    </title>
                                </rect>
                                {defect && defect.severity === 'critical' && (
                                    <text x={x + CELL_SIZE / 2 - 1} y={y + CELL_SIZE / 2 + 1}
                                          fontSize="9" fill="white" textAnchor="middle" dominantBaseline="middle"
                                          style={{pointerEvents: 'none'}}>✕</text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            <p style={{textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '10px'}}>
                {defectDies > 0
                    ? `${defectDies} defektnih die pozicija od ukupno ${totalDies} - Die Yield: ${((goodDies / totalDies) * 100).toFixed(1)}%`
                    : `Svih ${totalDies} die pozicija ispravno - Die Yield: 100%`
                }
            </p>
        </div>
    );
}
