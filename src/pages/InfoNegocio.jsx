export default function InfoNegocio() {
    return (
        <div style={{
            backgroundColor: '#1e1e1e',
            color: '#f0f0f0',
            minHeight: '100vh',
            width: '100%',
            padding: '20px',
            boxSizing: 'border-box',
            fontFamily: 'Segoe UI, sans-serif',
            lineHeight: 1.6
        }}>
            <h1 style={{ marginBottom: 20 }}>Información del negocio</h1>

            <div style={{
                background: '#2b2b2b',
                borderRadius: 8,
                padding: 20,
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                width: '100%',
                maxWidth: 900,
                margin: '0 auto',
                boxSizing: 'border-box'
            }}>
                {/* CONTACTO */}
                <h2 style={{ marginTop: 0, marginBottom: 10 }}>Contacto</h2>
                <p><strong>Dirección:</strong> 80 # 1103 / 11 y 13 Playa</p>
                <p><strong>Teléfonos:</strong> 52524842 y 72021641</p>

                {/* PRECIOS */}
                <h2 style={{ marginTop: 20, marginBottom: 10 }}>Precios</h2>
                <p>Estos precios son de cada juego "offline" por separado según su tamaño:</p>
                <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                    <li>Entre 0 Gb y 1 Gb — 100 MN</li>
                    <li>Entre 1 Gb y 10 Gb — 200 MN</li>
                    <li>Entre 10 Gb y 30 Gb — 400 MN</li>
                    <li>Entre 30 Gb y 60 Gb — 600 MN</li>
                    <li>Entre 60 Gb y 80 Gb — 800 MN</li>
                    <li>Mayores de 80 Gb — 1000 MN</li>
                </ul>
                <p style={{ fontSize: '0.95em', color: '#ccc' }}>
                    *Todos los juegos "online" cuestan 1000 MN y siempre se darán actualizados.<br />
                    *En el listado se verá el precio de cada juego entre paréntesis. Ejemplo (100.00)
                </p>

                {/* OFERTAS */}
                <h2 style={{ marginTop: 20, marginBottom: 10 }}>Ofertas llenado de discos</h2>
                <p>Llenado de discos (estas ofertas no son a domicilio).<br />
                    Cada TB cuesta 10 USD al cambio vigente. Ejemplos:</p>
                <ul style={{ paddingLeft: 20 }}>
                    <li>HDD de 1 TB — 10 USD</li>
                    <li>HDD de 2 TB — 20 USD</li>
                    <li>HDD de 3 TB — 30 USD</li>
                    <li>HDD de 4 TB — 40 USD</li>
                    <li>HDD de 5 TB — 50 USD</li>
                    <li>HDD de 6 TB — 60 USD</li>
                    <li>HDD de 8 TB — 80 USD</li>
                    <li>HDD de 10 TB — 100 USD</li>
                    <li>HDD de 12 TB — 120 USD</li>
                    <li>HDD de 14 TB — 140 USD</li>
                    <li>HDD de 16 TB — 160 USD</li>
                    <li>HDD de 18 TB — 180 USD</li>
                    <li>HDD de 20 TB — 200 USD</li>
                </ul>
                <p style={{ fontSize: '0.95em', color: '#ccc' }}>
                    *Entregas a domicilio por un costo adicional siempre y cuando sea una compra mínima de 1000 MN dependiendo de la lejanía.<br />
                    *Si usted desea algún juego que no aparezca en el listado pregunte, constantemente entran nuevos juegos que aún no aparecerán en el listado.
                </p>
            </div>
        </div>
    );
}