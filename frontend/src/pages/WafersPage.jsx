import {useState, useEffect} from 'react';
import {waferService} from '../services/waferService';
import {lotService} from '../services/lotService';
import WaferForm from '../components/waferComponents/WaferForm';
import WaferList from '../components/waferComponents/WaferList';
import {useAuth} from "../context/AuthContext.jsx";

export default function WafersPage() {
    const [wafers, setWafers] = useState([]);
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);

    // Stanja za filtere
    const [selectedLot, setSelectedLot] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const {user} = useAuth();
    const canEdit = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ROLE_ENGINEER');

    // Filtriranje plocica u realnom vremenu
    const filteredWafers = wafers.filter(w => {
        const matchesLot = selectedLot === 'all' || w.lotNumber === selectedLot || w.lotId === parseInt(selectedLot);
        const matchesStatus = selectedStatus === 'all' || w.status === selectedStatus;
        const matchesSearch = w.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesLot && matchesStatus && matchesSearch;
    });

    return (
        <div>
            {/* Forma za dodavanje novih pločica */}
            {canEdit && <WaferForm lots={lots} onWaferAdded={loadData}/>}
            {/* Tabela svih pločica sa filter trakom */}
            <div className="card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    <h2 className="card-title" style={{margin: 0}}>
                        Evidencija Pločica ({filteredWafers.length})
                    </h2>
                    {/* Filter traka */}
                    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center'}}>
                        {/* Brza pretraga */}
                        <input
                            type="text"
                            className="input-control"
                            placeholder="Pretraži serijski broj..."
                            style={{width: '180px', padding: '6px 10px', fontSize: '13px'}}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {/* Filter po seriji (Lot) */}
                        <select
                            className="input-control"
                            style={{width: '160px', padding: '6px 10px', fontSize: '13px'}}
                            value={selectedLot}
                            onChange={(e) => setSelectedLot(e.target.value)}
                        >
                            <option value="all">Sve Serije (Lots)</option>
                            {lots.map(l => (
                                <option key={l.id} value={l.lotNumber}>{l.lotNumber}</option>
                            ))}
                        </select>
                        {/* Filter po statusu */}
                        <select
                            className="input-control"
                            style={{width: '130px', padding: '6px 10px', fontSize: '13px'}}
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="all">Svi Statusi</option>
                            <option value="ok">OK</option>
                            <option value="defective">DEFECTIVE</option>
                            <option value="scrapped">SCRAPPED</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                    <p style={{color: '#0284c7'}}>Učitavanje pločica...</p>
                ) : (
                    <WaferList wafers={filteredWafers} onRefresh={loadData}/>
                )}
            </div>
        </div>
    );
}
