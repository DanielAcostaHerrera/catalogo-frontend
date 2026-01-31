export default function FiltrosSeries({ nombre, onNombre }) {
    const inputStyle = {
        padding: 6,
        border: '1px solid #444',
        borderRadius: 4,
        width: '100%',
        backgroundColor: '#1e1e1e',
        color: '#f0f0f0'
    };

    return (
        <div style={{ marginBottom: 16, width: '100%' }}>
            <div>
                <label>Nombre</label>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="Buscar por nombre…"
                    value={nombre}
                    onChange={(e) => onNombre(e.target.value)}
                />
            </div>
        </div>
    );
}