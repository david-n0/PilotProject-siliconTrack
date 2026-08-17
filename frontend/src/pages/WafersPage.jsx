import {useState, useEffect} from 'react';
import {waferService} from '../services/waferService';
import {lotService} from '../services/lotService';
import WaferForm from '../components/waferComponents/WaferForm';
import WaferList from '../components/waferComponents/WaferList';

export default function WafersPage() {
    const [wafers, setWafers] = useState([]);
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [wafersData, lotsData] = await Promise.all([
                waferService.getAll(),
                lotService.getAll()
            ]);
            setWafers(wafersData);
            setLots(lotsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            {/* Forma za dodavanje */}
            <WaferForm lots={lots} onWaferAdded={loadData}/>

            {/* Tabela svih pločica */}
            <div className="card">
                <h2 className="card-title">Sve Pločice u Proizvodnji</h2>
                {loading ? (
                    <p style={{color: '#0284c7'}}>Učitavanje pločica...</p>
                ) : (
                    <WaferList wafers={wafers} onRefresh={loadData}/>
                )}
            </div>
        </div>
    );
}
