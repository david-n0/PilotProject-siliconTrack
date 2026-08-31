import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Ako korisnik nije ulogovan, prebaci ga na /login
// Ako jeste, prikazi stranicu normalno (children)
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    // Dok proveravamo token pri startu - ne radi nista
    if (loading) {
        return <div className="card" style={{ textAlign: 'center' }}>Loading...</div>;
    }

    // Nema korisnika → idi na login stranicu
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Korisnik postoji → prikazi stranicu
    return children;
}
