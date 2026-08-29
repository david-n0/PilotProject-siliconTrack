import {useState} from 'react';
import {defectService} from '../../services/defectService.js';

export default function DefectForm({waferId, onDefectLogged}) {
    const [form, setForm] = useState({
        type: 'scratch', severity: 'minor', dieRow: '', dieCol: '', description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Provera: Opis ne sme biti prazan
        if (!form.description.trim()) {
            setError('Opis i lokacija defekta su obavezni.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await defectService.log({...form, waferId});
            setForm({type: 'scratch', severity: 'minor', dieRow: '', dieCol: '', description: ''});
            onDefectLogged(res.autoHold ?? null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (<div className="card" style={{gridTemplateColumns: '160px 160px 1fr 90px 90px auto'}}>
        <h3 className="card-title" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            Prijavi Novi Defekt na Pločici
        </h3>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid"
              style={{gridTemplateColumns: '180px 180px 1fr auto', alignItems: 'flex-end'}}>
            <div className="form-group">
                <label className="form-label">Tip Defekta</label>
                <select name="type" value={form.type} onChange={handleChange} className="select-control">
                    <option value="scratch">Scratch (Ogrebotina)</option>
                    <option value="crack">Crack (Pukotina)</option>
                    <option value="contamination">Contamination (Kontaminacija)</option>
                    <option value="particle">Particle (Čestica prašine)</option>
                    <option value="other">Other (Ostalo)</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Ozbiljnost (Severity)</label>
                <select name="severity" value={form.severity} onChange={handleChange} className="select-control">
                    <option value="minor">Minor (Nizak rizik)</option>
                    <option value="major">Major (Srednji rizik)</option>
                    <option value="critical">Critical (Kritičan kvar)</option>
                </select>
            </div>
            <div className="form-group">
                <label className="form-label">Opis i lokacija defekta (opciono)</label>
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="input-control"
                    placeholder="Npr. Vidljiva ogrebotina na die #12 blizu ivice..."
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Die Red (Y) *</label>
                <input type="number" name="dieRow" value={form.dieRow} onChange={handleChange}
                       className="input-control" min="0" max="20" placeholder="0-20" required/>
            </div>
            <div className="form-group">
                <label className="form-label">Die Kolona (X) *</label>
                <input type="number" name="dieCol" value={form.dieCol} onChange={handleChange}
                       className="input-control" min="0" max="20" placeholder="0-20" required/>
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-danger" disabled={loading || !form.description.trim()}
                        style={{padding: '10px 20px'}}>
                    {loading ? 'Beleženje...' : 'Evidentiraj Defekt'}
                </button>
            </div>
        </form>
    </div>);
}
