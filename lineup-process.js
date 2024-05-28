function generarNuevoHTML(tactica, alineacion) {
    let numDefensas, numCentrocampistas, numDelanteros;

    // Extraer el número de defensas, centrocampistas y delanteros de la táctica
    [numDefensas, numCentrocampistas, numDelanteros] = tactica.split('').map(Number);

    // Colocar a los jugadores en sus posiciones correspondientes
    const portero = alineacion[0];
    const defensas = alineacion.slice(1, numDefensas + 1);
    const centrocampistas = alineacion.slice(numDefensas + 1, numDefensas + numCentrocampistas + 1);
    const delanteros = alineacion.slice(numDefensas + numCentrocampistas + 1);

    // Generar el nuevo HTML con los jugadores en sus posiciones
    return `
    <div class="field" style="width:500px;height:500px;background-image:url('${chrome.runtime.getURL('images/campo.png')}');background-size:cover;background-repeat:no-repeat;position:relative;z-index:1">
      <div class="background" style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(255,255,255,0.5);z-index:-1;"></div>
      <div class="formation" style="text-align:center;color:darkred;opacity:1;z-index:1">
        <div class="line goalkeeper" style="padding-top:65px;margin-bottom:60px">${portero}</div>
        <div class="line defenders" style="margin-bottom:50px">${defensas.join(',')}</div>
        <div class="line midfielders" style="margin-bottom:70px">${centrocampistas.join(',')}</div>
        <div class="line forwards">${delanteros.join(',')}</div>
      </div>
    </div>`;
}


// Expresión regular para encontrar el patrón [lineup tactica=... alineacion=...][/lineup]
const regex = /\[lineup\s+tactica=(\d+)\s+alineacion=([^\]]+)\]\[\/lineup\]/gi;

// Buscar todos los elementos con la clase 'panel-body'
document.querySelectorAll('.panel-body').forEach(element => {
    let htmlContent = element.innerHTML;

    // Reemplazar caracteres extraños como &nbsp;
    htmlContent = htmlContent.replace(/&nbsp;/g, ' ');

    // Buscar todas las apariciones del patrón [lineup
    const matches = htmlContent.match(regex);
    if (matches) {
        matches.forEach(match => {
            const [, tactica, alineacionStr] = match.match(/\[lineup\s+tactica=(\d+)\s+alineacion=(.+?)\]\[\/lineup\]/i);
            const alineacion = alineacionStr.split(',').map(player => player.trim());
            const nuevoHTML = generarNuevoHTML(tactica, alineacion);

            // Reemplazar el texto encontrado por el nuevo HTML
            try {
                htmlContent = htmlContent.replace(match, nuevoHTML);
            } catch (error) {
            }

        });
    }

    // Actualizar el contenido del elemento con el nuevo HTML
    element.innerHTML = htmlContent;
});
