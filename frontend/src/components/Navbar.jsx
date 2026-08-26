import {NavLink, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";

export default function Navbar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const getRoleBadge = () => {
        if (user.roles?.includes('ROLE_ADMIN')) return 'Admin';
        if (user.roles?.includes('ROLE_ENGINEER')) return 'Engineer';
        return 'Viewer';
    };

    return (
        <div className="nav-container">
            {/* 1. GORNJA TRAKA: Logo + Korisnicki profil + Logout */}
            <div className="navbar-top">
                <div className="navbar-brand">
                    <span>SiliconTrack</span>
                </div>
                <div className="navbar-user-section">
                    <div className="user-profile-info">
                        <span className="user-name">{user.name}</span>
                        <br></br>
                        <span className="user-role-tag">{getRoleBadge()}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger ">
                        Logout
                    </button>
                </div>
            </div>
            {/* 2. DONJA TRAKA (TABS): Navigacija kroz sekcije */}
            <div className="navbar-sub">
                <NavLink to="/" className={({ isActive }) => `subnav-link ${isActive ? 'active' : ''}`}>
                    Dashboard
                </NavLink>
                <NavLink to="/lots" className={({ isActive }) => `subnav-link ${isActive ? 'active' : ''}`}>
                    Serije (Lots)
                </NavLink>
                <NavLink to="/wafers" className={({ isActive }) => `subnav-link ${isActive ? 'active' : ''}`}>
                    Pločice (Wafers)
                </NavLink>
            </div>
        </div>
    );
}
