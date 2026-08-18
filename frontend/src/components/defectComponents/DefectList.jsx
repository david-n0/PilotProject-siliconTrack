import { defectService } from '../../services/defectService.js';

// minor → green (badge-ok), major → yellow (badge-defective), critical → red (badge-rejected)
const severityClass = {
    minor: 'badge badge-ok',
    major: 'badge badge-in_production',
    critical: 'badge badge-rejected'
};

export default function DefectList({ defects, onRefresh }) {
    const handleDelete = async (id) => {
        if (window.confirm('Obrisati ovaj defekt?')) {
            try {
                await defectService.delete(id);
                onRefresh();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (defects.length === 0) {
        return <div className="empty-state">Nema zabeleženih defekata za ovu pločicu.</div>;
    }

    return (
        <div className="table-responsive">
            <table className="table-custom">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tip</th>
                    <th>Ozbiljnost</th>
                    <th>Opis</th>
                    <th>Vreme</th>
                    <th style={{ textAlign: 'right' }}>Akcija</th>
                </tr>
                </thead>
                <tbody>
                {defects.map((d) => (
                    <tr key={d.id} className="row-item">
                        <td style={{ fontWeight: '600', color: '#94a3b8' }}>#{d.id}</td>
                        <td style={{ fontWeight: '600', color: '#0f294a' }}>{d.type}</td>
                        <td>
                                <span className={severityClass[d.severity] || 'badge'}>
                                    {d.severity.toUpperCase()}
                                </span>
                        </td>
                        <td style={{ color: '#64748b', maxWidth: '200px' }}>{d.description || '—'}
                        </td>
                        <td style={{ color: '#64748b' }}>{d.detectedAt}</td>
                        <td style={{ textAlign: 'right' }}>
                            <button onClick={() => handleDelete(d.id)} className="btn btn-danger">
                                Obriši
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
