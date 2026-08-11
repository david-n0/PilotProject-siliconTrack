import {lotService} from "../../services/lotService.js";

export default function LotList({ lots, onLotDeleted }) {
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

    return (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
                <th>ID</th>
                <th>Kod Serije</th>
                <th>Količina</th>
                <th>Akcija</th>
            </tr>
            </thead>
            <tbody>
            {lots.length > 0 ? (
                lots.map((lot) => (
                    <tr key={lot.id}>
                        <td>{lot.id}</td>
                        <td>{lot.code}</td>
                        <td>{lot.quantity}</td>
                        <td>
                            <button onClick={() => handleDelete(lot.id)} style={{ color: 'red', cursor: 'pointer' }}>
                                Obriši
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="4">Nema kreiranih serija.</td>
                </tr>
            )}
            </tbody>
        </table>
    );
}