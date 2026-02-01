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

    const handleGo = () => {
        const trimmed = String(inputPage).trim();
        if (!trimmed) return;

        const num = parseInt(trimmed, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= totalPages) {
            onPageChange(num);
            setInputPage("");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: 20, width: "100%" }}>
            {/* Contenedor de botones con flex-wrap y gap */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px", // espacio horizontal y vertical uniforme
                }}
            >
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
                        }}
                        aria-label="Página anterior"
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
                                }}
                                aria-current={p === page ? "page" : undefined}
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
                        }}
                        aria-label="Página siguiente"
                    >
                        »
                    </button>
                )}
            </div>

            {/* Info y salto directo */}
            <div style={{ marginTop: 12, color: "#f0f0f0" }}>
                Página {page} de {totalPages}
            </div>

            <div style={{ marginTop: 8 }}>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputPage}
                    onChange={(e) => {
                        const value = e.target.value;

                        // 🔹 Solo permitir dígitos
                        if (/^\d*$/.test(value)) {
                            const num = parseInt(value, 10);

                            // 🔹 Permitir vacío (para borrar) o valores dentro del rango
                            if (value === "" || (num >= 1 && num <= totalPages)) {
                                setInputPage(value);
                            }
                        }
                    }}
                    placeholder="Ir a página..."
                    style={{
                        padding: "6px",
                        borderRadius: "4px",
                        width: "90px",
                        border: "1px solid #444",
                        backgroundColor: "#1c1c1c",
                        color: "#f0f0f0",
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleGo();
                        }
                    }}
                    aria-label="Ingresar número de página"
                />
                <button
                    onClick={handleGo}
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
