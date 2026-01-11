import React, { useState } from "react";

export default function Paginacion({ page, totalPages, onPageChange }) {
    const [inputPage, setInputPage] = useState("");

    // Generar rango de páginas estilo Google con 10 números fijos
    const getPages = () => {
        const pages = [];

        // Siempre incluir primera página
        pages.push(1);

        let start = Math.max(2, page - 4);
        let end = Math.min(totalPages - 1, page + 4);

        // Ajustar para que siempre haya 10 números en total (incluyendo 1 y totalPages)
        const visibleCount = end - start + 1;
        if (visibleCount < 8) {
            const deficit = 8 - visibleCount;
            if (start > 2) {
                start = Math.max(2, start - deficit);
            } else {
                end = Math.min(totalPages - 1, end + deficit);
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Siempre incluir última página si hay más de una
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <div style={{ textAlign: "center", marginTop: 20, width: "100%" }}>
            {/* Flecha izquierda */}
            {page > 1 && (
                <button
                    onClick={() => onPageChange(page - 1)}
                    style={{
                        borderRadius: 6,
                        border: "1px solid #444",
                        padding: "8px 16px",
                        backgroundColor: "#2b2b2b",
                        color: "#f0f0f0",
                        cursor: "pointer",
                        marginRight: 8,
                    }}
                >
                    «
                </button>
            )}

            {/* Páginas con puntos suspensivos */}
            {pages.map((p, idx) => {
                const prev = pages[idx - 1];
                const showEllipsis = prev && p - prev > 1;
                return (
                    <React.Fragment key={p}>
                        {showEllipsis && (
                            <span style={{ color: "#f0f0f0", margin: "0 4px" }}>…</span>
                        )}
                        <button
                            onClick={() => onPageChange(p)}
                            style={{
                                borderRadius: 6,
                                border: "1px solid #444",
                                padding: "8px 16px",
                                backgroundColor: p === page ? "#444" : "#2b2b2b",
                                color: "#f0f0f0",
                                fontWeight: p === page ? "bold" : "normal",
                                cursor: "pointer",
                                margin: "0 4px",
                            }}
                        >
                            {p}
                        </button>
                    </React.Fragment>
                );
            })}

            {/* Flecha derecha */}
            {page < totalPages && (
                <button
                    onClick={() => onPageChange(page + 1)}
                    style={{
                        borderRadius: 6,
                        border: "1px solid #444",
                        padding: "8px 16px",
                        backgroundColor: "#2b2b2b",
                        color: "#f0f0f0",
                        cursor: "pointer",
                        marginLeft: 8,
                    }}
                >
                    »
                </button>
            )}

            {/* Info y salto directo */}
            <div style={{ marginTop: 12, color: "#f0f0f0" }}>
                Página {page} de {totalPages}
            </div>
            <div style={{ marginTop: 8 }}>
                <input
                    type="number"
                    value={inputPage}
                    onChange={(e) => setInputPage(e.target.value)}
                    placeholder="Ir a página..."
                    style={{
                        padding: "6px",
                        borderRadius: "4px",
                        width: "80px",
                        border: "1px solid #444",
                        backgroundColor: "#1c1c1c",
                        color: "#f0f0f0",
                    }}
                />
                <button
                    onClick={() => {
                        const num = parseInt(inputPage);
                        if (num >= 1 && num <= totalPages) {
                            onPageChange(num);
                            setInputPage("");
                        }
                    }}
                    style={{
                        marginLeft: "8px",
                        padding: "6px 12px",
                        backgroundColor: "#333",
                        color: "#f0f0f0",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Ir
                </button>
            </div>
        </div>
    );
}