export default function WaferStatusModal({isOpen, waferSerial, newStatus, reason, onReasonChange, onClose, onConfirm}) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 41, 74, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card"
                 style={{maxWidth: '480px', width: '90%', margin: 0, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'}}>
                <h3 className="card-title">Razlog Promene Statusa</h3>

                <p style={{color: '#64748b', fontSize: '14px', marginBottom: '16px'}}>
                    Pločica <strong>{waferSerial}</strong>: status se menja u{' '}
                    <span className={`badge badge-${newStatus}`} style={{fontSize: '11px'}}>
                        {newStatus.toUpperCase()}
                    </span>
                </p>

                <div className="form-group" style={{marginBottom: '16px'}}>
                    <label className="form-label">Razlog promene (obavezno)</label>
                    <textarea
                        className="input-control"
                        rows={3}
                        placeholder="Npr. Uočen površinski defekt tokom optičke inspekcije..."
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        autoFocus
                    />
                </div>

                <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Otkaži
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="btn btn-primary"
                        disabled={!reason.trim()}
                    >
                        Potvrdi Promenu
                    </button>
                </div>
            </div>
        </div>
    );
}