import {createContext, useContext, useState, useEffect} from 'react';
import {authService} from '../services/authService.js';

// Kreira "globalni prostor" koji sve komponente mogu procitati
const AuthContext = createContext(null);

// AuthProvider "omota" celu aplikaciju i drzi korisnika u state-u
export function AuthProvider({children}) {
    const [user, setUser] = useState(null);       // { id, email, name, roles }
    const [loading, setLoading] = useState(true); // dok proveravamo token pri startu

    // Kada se app ucita - proveri da li postoji token u localStorage
    // Ako postoji, dohvati podatke o korisniku sa /api/me
    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            authService.getMe()
                .then(userData => setUser(userData))
                .catch(() => {
                    // Token je istekao ili neispravan - odjavi korisnika
                    authService.logout();
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Ova funkcija se poziva sa LoginPage - cuva korisnika u state
    const login = async (email, password) => {
        await authService.login(email, password);
        const userData = await authService.getMe();
        setUser(userData);
    };

    const loginWithGoogle = async () => {
        await authService.loginWithGoogle();
        const userData = await authService.getMe();
        setUser(userData);
    };

    // Ova funkcija se poziva sa Navbar dugmeta "Logout"
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Sve komponente unutar AuthProvider-a mogu zvati useAuth() i dobiti:
    // user, login, logout, loading
    return (
        <AuthContext.Provider value={{user, login, loginWithGoogle, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook - umesto import { useContext } + import { AuthContext }
// jednostavno pises: const { user, login, logout } = useAuth();
export function useAuth() {
    return useContext(AuthContext);
}
