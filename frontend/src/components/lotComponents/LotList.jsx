import {lotService} from "../../services/lotService.js";

export default function LotList({lots, onLotDeleted}) {

    const handleDelete = async (id) => {
        if (window.confirm('Da li ste sigurni da želite obrisati ovaj Lot?')) {
            try {
                await lotService.delete(id);
                onLotDeleted(); // Osvežavamo listu
            } catch (err) {
                alert(err.message);
            }
        }
    };

    // Pomocna funkcija za lepsu boju status taga
    const getStatusBadge = (status) => {
        const colors = {
            pending: '#ffc107',
            in_production: '#17a2b8',
            completed: '#28a745',
            rejected: '#dc3545',
        };
        return (
            <span style={{
                background: colors[status] || '#6c757d',
                color: '#fff',
                padding: '3px 8px',
                borderRadius: '12px',
                fontSize: '0.85em',
                textTransform: 'uppercase'
            }}>
                {status}
            </span>
        );
    };

    return (
        <table border="1" cellPadding="10" style={{borderCollapse: 'collapse', width: '100%', marginTop: '10px'}}>
            <thead>
            <tr style={{backgroundColor: '#f4f4f4', textAlign: 'left'}}>
                <th>ID</th>
                <th>Broj Serije</th>
                <th>Proizvod</th>
                <th>Pločica (Wafers)</th>
                <th>Status</th>
                <th>Pokrenuto</th>
                <th>Akcija</th>
            </tr>
            </thead>
            <tbody>
            {lots.length > 0 ? (
                lots.map((lot) => (
                    <tr key={lot.id}>
                        <td>{lot.id}</td>
                        <td><strong>{lot.lotNumber}</strong></td>
                        <td>{lot.product}</td>
                        <td>{lot.waferCount}</td>
                        <td>{getStatusBadge(lot.status)}</td>
                        <td>{lot.startAt}</td>
                        <td>
                            <button onClick={() => handleDelete(lot.id)} style={{color: 'red', cursor: 'pointer'}}>
                                Obriši
                            </button>
                        </td>
                    </tr>
                ))
            ) : (

                <tr>
                    <td colSpan="7" style={{textAlign: 'center', color: '#666'}}>Nema kreiranih serija.</td>
                </tr>
            )}
            </tbody>
        </table>
    )
}
