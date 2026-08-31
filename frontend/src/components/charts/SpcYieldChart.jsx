import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    CartesianGrid,
    Area,
    ComposedChart
} from 'recharts';

const UCL = 95;  // Upper Control Limit
const LCL = 75;  // Lower Control Limit

const CustomDot = (props) => {
    const {cx, cy, payload} = props;
    if (!payload) return null;
    const color = payload.yield < LCL ? '#ef4444' : payload.yield >= UCL ? '#16a34a' : '#0284c7';
    const r = payload.yield < LCL ? 6 : 4;
    return <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth="2"/>;
};

const CustomTooltip = ({active, payload}) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const color = d.yield < LCL ? '#ef4444' : d.yield >= UCL ? '#16a34a' : '#0284c7';
    return (
        <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
            <p style={{fontWeight: 700, color: '#0f294a', margin: '0 0 4px'}}>{d.lotNumber}</p>
            <p style={{margin: '2px 0', fontSize: 13, color}}><strong>Yield: {d.yield}%</strong></p>
            <p style={{margin: '2px 0', fontSize: 12, color: '#64748b'}}>{d.ok} od {d.total} OK - {d.product}</p>
            {d.yield < LCL &&
                <p style={{margin: '4px 0 0', fontSize: 11, color: '#ef4444', fontWeight: 700}}>⚠ ISPOD KONTROLNE
                    GRANICE</p>}
        </div>
    );
};

export default function SpcYieldChart({data = []}) {
    if (data.length === 0) return null;

    return (
        <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                <div>
                    <h3 className="card-title" style={{margin: 0}}>SPC Monitoring - Yield po Serijama</h3>
                    <p style={{fontSize: 12, color: '#64748b', margin: '4px 0 0'}}>
                        Kontrolne granice: UCL = {UCL}% (cilj) &bull; LCL = {LCL}% (alarm)
                    </p>
                </div>
                <div style={{display: 'flex', gap: '12px', fontSize: '11px'}}>
                    <span style={{color: '#16a34a'}}>● Optimalno (≥{UCL}%)</span>
                    <span style={{color: '#0284c7'}}>● U normi</span>
                    <span style={{color: '#ef4444'}}>● Alarm (&lt;{LCL}%)</span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data} margin={{top: 10, right: 20, left: -10, bottom: 5}}>
                    <defs>
                        <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                    <XAxis dataKey="lotNumber" tick={{fontSize: 11}} angle={-20} textAnchor="end" height={50}/>
                    <YAxis domain={[0, 100]} tick={{fontSize: 11}} tickFormatter={(v) => `${v}%`}/>
                    <Tooltip content={<CustomTooltip/>}/>

                    {/* Kontrolne granice */}
                    <ReferenceLine y={UCL} stroke="#16a34a" strokeDasharray="6 3" strokeWidth={1.5}
                                   label={{value: `UCL ${UCL}%`, position: 'right', fontSize: 10, fill: '#16a34a'}}/>
                    <ReferenceLine y={LCL} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5}
                                   label={{value: `LCL ${LCL}%`, position: 'right', fontSize: 10, fill: '#ef4444'}}/>

                    {/* Yield Area + Line */}
                    <Area type="monotone" dataKey="yield" fill="url(#yieldGrad)" stroke="none"/>
                    <Line type="monotone" dataKey="yield" stroke="#0284c7" strokeWidth={2.5}
                          dot={<CustomDot/>} activeDot={{r: 7, stroke: '#0284c7', strokeWidth: 2}}/>
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
