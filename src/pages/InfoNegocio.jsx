export default function InfoNegocio() {
    const coords = "23.102008,-82.435992";
    const mapsUrl = `https://www.google.com/maps?q=${coords}`;
    const whatsappUrl = "https://wa.me/5352524842";

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
            <h2 style={{ marginBottom: 20, textAlign: 'center' }}>📋 Información del negocio</h2>

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
                <h2 style={{ marginTop: 0, marginBottom: 10 }}>📍 Contacto</h2>
                <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ margin: 0 }}>
                        <strong>Dirección:</strong> 80 # 1103 / 11 y 13 Playa
                    </p>
                    {/* Pin Google Maps con SVG */}
                    <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Buscar en Google Maps"
                        className="map-pin"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="red"
                        >
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 
                            0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                    </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 20 }}>
                    <p style={{ margin: 0 }}>
                        <strong>Teléfonos:</strong> 52524842 y 72021641
                    </p>
                    {/* Icono WhatsApp */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Chatear por WhatsApp"
                        className="whatsapp-icon"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            width="24"
                            height="24"
                            fill="#25D366"
                        >
                            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.34 7.1L4 29l7.1-2.34A11.9 11.9 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-2.2 0-4.25-.72-5.9-1.94l-.42-.3-4.2 1.38 1.38-4.2-.3-.42A9.9 9.9 0 0 1 6 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.1-7.3c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.27-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.43-2.25-1.37-.83-.74-1.37-1.65-1.53-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.27.28-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.46-.16 0-.34-.02-.52-.02-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.83c.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.58.65.21 1.24.18 1.7.11.52-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.52-.32z" />
                        </svg>
                    </a>
                </div>

                {/* PRECIOS */}
                <h2 style={{ marginTop: 20, marginBottom: 10 }}>💰 Precios de juegos offline</h2>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginBottom: 20,
                    backgroundColor: '#1e1e1e',
                    borderRadius: 6,
                    overflow: 'hidden'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#333' }}>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Tamaño</th>
                            <th style={{ padding: '8px', textAlign: 'left' }}>Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td style={{ padding: '6px' }}>0 Gb – 1 Gb</td><td>100 MN</td></tr>
                        <tr><td style={{ padding: '6px' }}>1 Gb – 10 Gb</td><td>200 MN</td></tr>
                        <tr><td style={{ padding: '6px' }}>10 Gb – 30 Gb</td><td>400 MN</td></tr>
                        <tr><td style={{ padding: '6px' }}>30 Gb – 60 Gb</td><td>600 MN</td></tr>
                        <tr><td style={{ padding: '6px' }}>60 Gb – 80 Gb</td><td>800 MN</td></tr>
                        <tr><td style={{ padding: '6px' }}>Más de 80 Gb</td><td>1000 MN</td></tr>
                    </tbody>
                </table>
                <p style={{ fontSize: '0.95em', color: '#ccc' }}>
                    🎮 Todos los juegos <em>online</em> cuestan 1000 MN y siempre se entregan actualizados.
                </p>

                {/* OFERTAS */}
                <h2 style={{ marginTop: 20, marginBottom: 10 }}>💿 Ofertas llenado de discos</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px',
                    marginBottom: 20
                }}>
                    {[

                        "HDD de 1 TB — 10 USD", "HDD de 2 TB — 20 USD", "HDD de 3 TB — 30 USD",
                        "HDD de 4 TB — 40 USD", "HDD de 5 TB — 50 USD", "HDD de 6 TB — 60 USD",
                        "HDD de 8 TB — 80 USD", "HDD de 10 TB — 100 USD", "HDD de 12 TB — 120 USD",
                        "HDD de 14 TB — 140 USD", "HDD de 16 TB — 160 USD", "HDD de 18 TB — 180 USD",
                        "HDD de 20 TB — 200 USD"
                    ].map((oferta, idx) => (
                        <div key={idx} style={{
                            backgroundColor: '#1e1e1e',
                            padding: '8px',
                            borderRadius: 6,
                            textAlign: 'center'
                        }}>
                            {oferta}
                        </div>
                    ))}
                </div>
                <p style={{ fontSize: '0.95em', color: '#ccc' }}>
                    📦 Entregas a domicilio por un costo adicional siempre y cuando sea una compra mínima de 1000 MN dependiendo de la lejanía.<br />
                    🔄 Si usted desea algún juego que no aparezca en el listado pregunte, constantemente entran nuevos juegos que aún no aparecerán en el listado.
                </p>
            </div>
        </div>
    );
}