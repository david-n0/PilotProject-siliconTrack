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

    return (
        <div className="card">
            <h3 className="card-title">Prijava defekta</h3>
            <p style={{fontSize: '13px', color: '#64748b', margin: '-8px 0 16px'}}>
                Pločica se automatski prebacuje u status <strong>DEFECTIVE</strong>, a serija ide na HOLD
                ako yield padne ispod kontrolne granice.
            </p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="defect-form-top">
                    <div className="form-group">
                        <label className="form-label">Tip defekta</label>
                        <select name="type" value={form.type} onChange={handleChange} className="select-control">
                            <option value="scratch">Scratch — ogrebotina</option>
                            <option value="crack">Crack — pukotina</option>
                            <option value="contamination">Contamination — kontaminacija</option>
                            <option value="particle">Particle — čestica</option>
                            <option value="other">Other — ostalo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ozbiljnost</label>
                        <select name="severity" value={form.severity} onChange={handleChange}
                                className="select-control">
                            <option value="minor">Minor — nizak rizik</option>
                            <option value="major">Major — srednji rizik</option>
                            <option value="critical">Critical — kritičan kvar</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Die red</label>
                        <input type="number" name="dieRow" value={form.dieRow} onChange={handleChange}
                               className="input-control" min="0" max="20" placeholder="0–20" required/>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Die kolona</label>
                        <input type="number" name="dieCol" value={form.dieCol} onChange={handleChange}
                               className="input-control" min="0" max="20" placeholder="0–20" required/>
                    </div>
                </div>

                <div className="defect-form-bottom">
                    <div className="form-group">
                        <label className="form-label">Opis nalaza</label>
                        <input type="text" name="description" value={form.description} onChange={handleChange}
                               className="input-control"
                               placeholder="Npr. vidljiva ogrebotina blizu ivice pločice"
                               required/>
                        <span className="field-hint">
                            Koordinate se odnose na die mapu 21×21 (0–20). Obavezno uz svaki nalaz — ulazi u audit zapis.
                        </span>
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn btn-danger"
                                disabled={loading || !form.description.trim()}
                                style={{padding: '10px 22px'}}>
                            {loading ? 'Beleženje…' : 'Evidentiraj defekt'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
