import {NavLink} from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span>
                    SiliconTrack
                </span>
            </div>

            <div className="navbar-links">
                <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                <NavLink to="/lots" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Serije (Lots)</NavLink>
                <NavLink to="/wafers" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Pločice (Wafers)</NavLink>
            </div>
        </nav>
    );
}
