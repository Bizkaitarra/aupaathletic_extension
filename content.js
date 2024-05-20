console.log('cargando extensión 1');

console.log('cargando extensión 2');
try {
    const postForm = document.querySelector('form[name="frm"]');
    const textarea = postForm ? postForm.querySelector('#Mensaje') : null;
    if (postForm && textarea) {
        console.log('Formulario y textarea encontrados');
        // Ocultar el textarea original y crear un nuevo contenedor para el editor
        textarea.style.display = 'none';

        const editorContainer = document.createElement('div');
        editorContainer.id = 'wysiwyg-editor';
        editorContainer.contentEditable = true;
        editorContainer.style.border = '1px solid #ccc';
        editorContainer.style.padding = '10px';
        editorContainer.style.minHeight = '150px';
        textarea.parentNode.insertBefore(editorContainer, textarea.nextSibling);

        // Copiar el contenido del textarea original al editor WYSIWYG
        editorContainer.innerHTML = textarea.value;

        // Crear barra de herramientas
        const toolbar = document.createElement('div');
        toolbar.style.marginBottom = '10px';
        textarea.parentNode.insertBefore(toolbar, editorContainer);

        // Crear botones
        const boldButton = document.createElement('button');
        boldButton.innerHTML = '<b>B</b>';
        boldButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleBold();
        };
        toolbar.appendChild(boldButton);

        const italicButton = document.createElement('button');
        italicButton.innerHTML = '<i>I</i>';
        italicButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleItalic();
        };
        toolbar.appendChild(italicButton);

        const linkButton = document.createElement('button');
        linkButton.innerHTML = 'Link';
        linkButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            addLink();
        };
        toolbar.appendChild(linkButton);

        // Actualizar el contenido del textarea original al enviar el formulario
        postForm.addEventListener('submit', (event) => {
            const htmlContent = editorContainer.innerHTML;
            textarea.value = convertHtmlToForumFormat(htmlContent);
        });
    } else {
        console.log('Formulario o textarea no encontrados');
    }
} catch (error) {
    console.error('Error inicializando la extensión:', error);
}

function convertHtmlToForumFormat(html) {
    return html
        .replace(/<b>(.*?)<\/b>/g, '[b]$1[/b]')
        .replace(/<i>(.*?)<\/i>/g, '[i]$1[/i]')
        .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[web] $2 [separador] $1 [/web]')
        .replace(/<br>/g, '\n');
}

function toggleBold() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    const parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName === 'B' || parentNode.nodeName === 'STRONG') {
        // Quitar negrita
        const textNode = document.createTextNode(selectedText);
        parentNode.parentNode.replaceChild(textNode, parentNode);
    } else {
        // Añadir negrita
        const boldNode = document.createElement('b');
        boldNode.appendChild(document.createTextNode(selectedText));
        range.deleteContents();
        range.insertNode(boldNode);
    }

    // Re-seleccionar el texto
    selection.removeAllRanges();
    selection.addRange(range);
}

function toggleItalic() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    const parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName === 'I' || parentNode.nodeName === 'EM') {
        // Quitar cursiva
        const textNode = document.createTextNode(selectedText);
        parentNode.parentNode.replaceChild(textNode, parentNode);
    } else {
        // Añadir cursiva
        const italicNode = document.createElement('i');
        italicNode.appendChild(document.createTextNode(selectedText));
        range.deleteContents();
        range.insertNode(italicNode);
    }

    // Re-seleccionar el texto
    selection.removeAllRanges();
    selection.addRange(range);
}

function addLink() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    let url = prompt('Enter the link URL:');
    if (!url) return;

    // Asegurarse de que la URL tenga el prefijo https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    let linkText = selectedText;
    if (!linkText) {
        linkText = url;
    } else if (!isValidUrl(linkText)) {
        linkText = url + ' [separador] ' + linkText;
    } else {
        linkText = linkText + ' [separador] ' + url;
    }

    const linkNode = document.createTextNode(`[web] ${linkText} [/web]`);
    range.deleteContents();
    range.insertNode(linkNode);

    // Re-seleccionar el texto
    selection.removeAllRanges();
    selection.addRange(range);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
