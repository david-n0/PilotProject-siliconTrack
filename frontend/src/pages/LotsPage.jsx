import {useState, useEffect} from 'react';
import {lotService} from '../services/lotService';
import LotForm from '../components/lotComponents/LotForm';
import LotList from '../components/lotComponents/LotList';
import {useAuth} from "../context/AuthContext.jsx";

export default function LotsPage() {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadLots = async () => {
        try {
            const data = await lotService.getAll();
            setLots(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLots();
    }, []);

    const { user } = useAuth();
    const canEdit = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ENGINEER');

    return (
        <div>
            {canEdit && <LotForm onLotAdded={loadLots} />}

            <div className="card">
                <h2 className="card-title">
                    Evidencija Serija (Lots)
                </h2>
                {loading ? <p style={{color: '#0284c7'}}>Učitavanje...</p> :
                    <LotList lots={lots} onLotDeleted={loadLots}/>}
            </div>
        </div>
    );
}
