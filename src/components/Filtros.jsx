export default function Filtros({
    nombre, onNombre,
    tamanoMin, onTamanoMin,
    tamanoMax, onTamanoMax,
    annoMin, onAnnoMin,
    annoMax, onAnnoMax,
    precioMin, onPrecioMin,
    precioMax, onPrecioMax,
}) {
    const inputStyle = {
        padding: 6,
        border: '1px solid #444',
        borderRadius: 4,
        width: '100%',
        backgroundColor: '#1e1e1e',
        color: '#f0f0f0'
    };
    const groupStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginTop: 12,
        width: '100%'
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

            <div style={groupStyle}>
                <div>
                    <label>Tamaño mínimo (GB)</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="0.1"
                        value={tamanoMin}
                        onChange={(e) => onTamanoMin(e.target.value)}
                    />
                </div>
                <div>
                    <label>Tamaño máximo (GB)</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="0.1"
                        value={tamanoMax}
                        onChange={(e) => onTamanoMax(e.target.value)}
                    />
                </div>
                <div>
                    <label>Año mínimo</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="1980"
                        max="2100"
                        value={annoMin}
                        onChange={(e) => onAnnoMin(e.target.value)}
                    />
                </div>
                <div>
                    <label>Año máximo</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="1980"
                        max="2100"
                        value={annoMax}
                        onChange={(e) => onAnnoMax(e.target.value)}
                    />
                </div>
                <div>
                    <label>Precio mínimo (MN)</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="100"
                        value={precioMin}
                        onChange={(e) => onPrecioMin(e.target.value)}
                    />
                </div>
                <div>
                    <label>Precio máximo (MN)</label>
                    <input
                        style={inputStyle}
                        type="number"
                        min="0"
                        step="100"
                        value={precioMax}
                        onChange={(e) => onPrecioMax(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}