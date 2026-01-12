export function formatoTamano(tamano, nombre = "") {
    const mb = Number(tamano);

    if (mb === 0 || nombre.toLowerCase().includes("[online]")) {
        return "Variable";
    }
    if (isNaN(mb)) return "Desconocido";
    if (mb < 1024) return `${mb} MB`;

    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
}

export function formatoAnno(nombre = "", annoAct) {
    // Si es online → siempre año actual
    if (nombre.toLowerCase().includes("[online]")) {
        return new Date().getFullYear();
    }
    // Si viene 0 o inválido → "No disponible"
    if (!annoAct || annoAct === 0) {
        return "No disponible";
    }
    return annoAct;
}

// ---------------------------------------------------------
// 🔵 Limpieza de nombre para búsquedas externas (Google)
// ---------------------------------------------------------
export function limpiarNombreParaBusqueda(nombre) {
    let limpio = nombre;

    // Quitar "(build ...)"
    limpio = limpio.replace(/\(build.*?\)/gi, "");

    // Quitar versiones tipo v1, v1.2, v 1.2.3, vFinal, vBeta, vv, etc.
    limpio = limpio.replace(/\bv+\s*\d+(\.\d+)*\b/gi, "");   // v1.2.3
    limpio = limpio.replace(/\bv+\s*[a-z]+/gi, "");          // vFinal, vBeta
    limpio = limpio.replace(/\bvv+\b/gi, "");                // vv

    // Quitar corchetes de año [2017]
    limpio = limpio.replace(/\[\d{4}\]/g, "");

    // Quitar sufijos comunes de releases
    limpio = limpio.replace(/[-_](gog|fitgirl|elamigos|repack|steam|pc)/gi, "");

    // Quitar dobles espacios
    limpio = limpio.replace(/\s{2,}/g, " ");

    return limpio.trim();
}