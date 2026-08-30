import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {authService} from '../services/authService.js';

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await authService.register(form.name, form.email, form.password);
            // Registracija uspela → idi na login
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{maxWidth: '420px', margin: '60px auto'}}>
            <div className="card">
                <h1 className="page-title" style={{marginBottom: '6px'}}>Create Account</h1>
                <p className="page-subtitle" style={{marginBottom: '24px'}}>
                    Register a new SiliconTrack account
                </p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginBottom: '14px'}}>
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-control"
                            placeholder="Marko Petrović"
                            required
                        />
                    </div>

                    <div className="form-group" style={{marginBottom: '14px'}}>
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input-control"
                            placeholder="marko@silicontrack.com"
                            required
                        />
                    </div>

                    <div className="form-group" style={{marginBottom: '14px'}}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="input-control"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <p style={{fontSize: '13px', color: '#64748b', marginBottom: '20px'}}>
                        Novi nalozi dobijaju <strong>Viewer</strong> pristup. Vise privilegije dodeljuje administrator.
                    </p>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{width: '100%'}}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b'}}>
                    Already have an account?{' '}
                    <Link to="/login" style={{color: '#0284c7', fontWeight: '600'}}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
