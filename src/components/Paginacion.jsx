export default function Paginacion({ page, onPrev, onNext }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 20,
            width: '100%'
        }}>
            <button
                onClick={onPrev}
                disabled={page <= 1}
                style={{
                    borderRadius: 6,
                    border: '1px solid #444',
                    padding: '8px 16px',
                    backgroundColor: '#2b2b2b',
                    color: '#f0f0f0',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer'
                }}
            >
                Anterior
            </button>
            <span style={{ alignSelf: 'center', color: '#f0f0f0' }}>
                Página {page}
            </span>
            <button
                onClick={onNext}
                style={{
                    borderRadius: 6,
                    border: '1px solid #444',
                    padding: '8px 16px',
                    backgroundColor: '#2b2b2b',
                    color: '#f0f0f0',
                    cursor: 'pointer'
                }}
            >
                Siguiente
            </button>
        </div>
    );
}