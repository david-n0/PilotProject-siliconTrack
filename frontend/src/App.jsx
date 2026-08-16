import {useState, useEffect} from 'react';
import {lotService} from './services/lotService';
import LotForm from "./components/lotComponents/LotForm.jsx";
import LotList from "./components/lotComponents/LotList.jsx";


export default function App() {
    const [lots, setLots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLots();
    }, []);

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
    return (
        <div style={{padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto'}}>
            <h1>SiliconTrack Dashboard</h1>

            {/* Forma za dodavanje */}
            <LotForm onLotAdded={loadLots}/>

            {/* Tabela za prikaz */}
            <h2>Postojeće Serije</h2>
            {loading ? <p>Učitavanje...</p> : <LotList lots={lots} onLotDeleted={loadLots}/>}
        </div>
    );
}