import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

export default function LoginPage() {
    const {login, loginWithGoogle} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            // Uspesan login → idi na Dashboard
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError(null);
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (<div style={{maxWidth: '420px', margin: '80px auto'}}>
            <div className="card">
                <h1 className="page-title" style={{marginBottom: '6px'}}>SiliconTrack</h1>
                <p className="page-subtitle" style={{marginBottom: '24px'}}>
                    Sign in to your account
                </p>

                {error && <div className="alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginBottom: '16px'}}>
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input-control"
                            placeholder="engineer@silicontrack.com"
                            required
                        />
                    </div>

                    <div className="form-group" style={{marginBottom: '24px'}}>
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input-control"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{width: '100%'}}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="divider-or"><span>ili</span></div>

                <button type="button" onClick={handleGoogle} className="btn-google" disabled={loading}>
                    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#4285F4"
                              d="M45 24c0-1.6-.1-2.7-.4-4H24v7.5h12c-.2 2-1.5 5-4.4 7l6.7 5.2C42.2 36 45 30.6 45 24z"/>
                        <path fill="#34A853"
                              d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4C29.7 36.6 27.1 37.5 24 37.5c-5.7 0-10.6-3.8-12.3-9l-7.1 5.5C8.1 41.2 15.5 46 24 46z"/>
                        <path fill="#FBBC05"
                              d="M11.7 28.5c-.5-1.4-.7-2.9-.7-4.5s.3-3.1.7-4.5l-7.1-5.5C3 16.9 2 20.3 2 24s1 7.1 2.6 10l7.1-5.5z"/>
                        <path fill="#EA4335"
                              d="M24 10.5c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4 29.9 2 24 2 15.5 2 8.1 6.8 4.6 14l7.1 5.5c1.7-5.2 6.6-9 12.3-9z"/>
                    </svg>
                    Nastavi sa Google nalogom
                </button>

                <p style={{textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748b'}}>
                    No account?{' '}
                    <Link to="/register" style={{color: '#0284c7', fontWeight: '600'}}>
                        Register here
                    </Link>
                </p>
            </div>
        </div>);
}
