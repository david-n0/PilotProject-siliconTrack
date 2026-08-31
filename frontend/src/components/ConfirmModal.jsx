export default function ConfirmModal({isOpen, title, message, confirmLabel = 'Potvrdi', onClose, onConfirm}) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 41, 74, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{maxWidth: '420px', width: '90%', margin: 0}}>
                <h3 className="card-title">{title}</h3>
                <p style={{color: '#64748b', fontSize: '14px', margin: '0 0 20px'}}>{message}</p>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">Otkaži</button>
                    <button type="button" onClick={onConfirm} className="btn btn-danger">{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}