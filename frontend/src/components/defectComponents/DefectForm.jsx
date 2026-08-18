import {useState} from 'react';
import {defectService} from '../../services/defectService.js';

export default function DefectForm({waferId, onDefectLogged}) {
    const [form, setForm] = useState({
        type: 'scratch',
        severity: 'minor',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await defectService.log({...form, waferId});
            setForm({type: 'scratch', severity: 'minor', description: ''});
            onDefectLogged();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="card-title">Log Defect</h3>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label className="form-label">Defect Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="select-control">
                        <option value="scratch">Scratch</option>
                        <option value="crack">Crack</option>
                        <option value="contamination">Contamination</option>
                        <option value="particle">Particle</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Severity</label>
                    <select name="severity" value={form.severity} onChange={handleChange} className="select-control">
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Description (optional)</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="input-control"
                        rows={3}
                        placeholder="Describe the defect..."
                    />
                </div>

                <div className="form-group ">
                    <button type="submit" className="btn btn-danger" disabled={loading} style={{height:"50px"}}>
                        {loading ? 'Logging...' : 'Log Defect'}
                    </button>
                </div>
            </form>
        </div>
    );
}
