export async function onRequest(context) {
    // Obtenemos el archivo real desde los assets del deploy
    const response = await context.env.ASSETS.fetch(context.request);

    // Creamos una nueva respuesta con el mismo contenido
    const newResponse = new Response(response.body, response);

    // Forzamos el tipo MIME correcto para Google
    newResponse.headers.set("Content-Type", "application/xml; charset=utf-8");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");

    return newResponse;
}