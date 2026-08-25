import React, { useState } from "react";

export default function Paginacion({ page, totalPages, onPageChange }) {
    const [inputPage, setInputPage] = useState("");

    const getPages = () => {
        const pages = [];

        pages.push(1);

        let start = Math.max(2, page - 4);
        let end = Math.min(totalPages - 1, page + 4);

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
        <div className="paginacion-container">
            <div className="paginacion-botones">
                {page > 1 && (
                    <button
                        className="btn-dark"
                        onClick={() => onPageChange(page - 1)}
                        aria-label="Página anterior"
                    >
                        «
                    </button>
                )}

                {pages.map((p, idx) => {
                    const prev = pages[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                        <React.Fragment key={p}>
                            {showEllipsis && (
                                <span className="paginacion-ellipsis">…</span>
                            )}
                            <button
                                className={`btn-dark ${p === page ? 'paginacion-btn-activo' : ''}`}
                                onClick={() => onPageChange(p)}
                                aria-current={p === page ? "page" : undefined}
                            >
                                {p}
                            </button>
                        </React.Fragment>
                    );
                })}

                {page < totalPages && (
                    <button
                        className="btn-dark"
                        onClick={() => onPageChange(page + 1)}
                        aria-label="Página siguiente"
                    >
                        »
                    </button>
                )}
            </div>

            <div className="paginacion-info">
                Página {page} de {totalPages}
            </div>

            <div className="paginacion-ir">
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputPage}
                    onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                            const num = parseInt(value, 10);

                            if (value === "" || (num >= 1 && num <= totalPages)) {
                                setInputPage(value);
                            }
                        }
                    }}
                    className="paginacion-input"
                    placeholder="Ir a página..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleGo();
                        }
                    }}
                    aria-label="Ingresar número de página"
                />
                <button
                    className="btn-dark"
                    onClick={handleGo}
                >
                    Ir
                </button>
            </div>
        </div>
    );
}
