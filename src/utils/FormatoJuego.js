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
    if (nombre.toLowerCase().includes("[online]")) {
        return new Date().getFullYear();
    }
    if (!annoAct || annoAct === 0) {
        return "No disponible";
    }
    return annoAct;
}

export function limpiarNombreParaBusqueda(nombre) {
    let limpio = nombre;

    limpio = limpio.replace(/\(build.*?\)/gi, "");
    limpio = limpio.replace(/\bv+\s*\d+(\.\d+)*\b/gi, "");
    limpio = limpio.replace(/\bv+\s*[a-z]+/gi, "");
    limpio = limpio.replace(/\bvv+\b/gi, "");
    limpio = limpio.replace(/\[\d{4}\]/g, "");
    limpio = limpio.replace(/[-_](gog|fitgirl|elamigos|repack|steam|pc)/gi, "");
    limpio = limpio.replace(/\s{2,}/g, " ");

    return limpio.trim();
}