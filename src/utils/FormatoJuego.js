import { datetime } from "luxon"; // o usa Date nativo

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