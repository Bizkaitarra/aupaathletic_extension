try {
    const postForm = document.querySelector('form[name="frm"]');
    const textarea = postForm ? postForm.querySelector('#Mensaje') : null;
    if (postForm && textarea) {

        const mainTable = postForm.querySelector('table');
        if (mainTable) {
            mainTable.children[0].children[0].children[1].style.display = 'none';
        } else {
            console.log('No se encontró la tabla principal dentro del formulario');
        }


        // Ocultar el textarea original y crear un nuevo contenedor para el editor
        textarea.style.display = 'none';

        const editorContainer = document.createElement('div');
        editorContainer.id = 'wysiwyg-editor';
        editorContainer.contentEditable = true;
        editorContainer.style.border = '1px solid #ccc';
        editorContainer.style.padding = '10px';
        editorContainer.style.minHeight = '150px';
        editorContainer.className = 'form-control';
        textarea.parentNode.insertBefore(editorContainer, textarea.nextSibling);

        // Copiar el contenido del textarea original al editor WYSIWYG
        editorContainer.innerHTML = convertForumFormatToHtml(textarea.value);

        // Crear barra de herramientas
        const toolbar = document.createElement('div');
        toolbar.className = 'toolbar';
        toolbar.id = 'ce-toolbar';
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

        // Añadir el botón de subrayado a la barra de herramientas
        const underlineButton = document.createElement('button');
        underlineButton.innerHTML = '<u>U</u>';
        underlineButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleUnderline();
        };
        toolbar.appendChild(underlineButton);


// Crear contenedor para los botones de emoji
        const emojiButtonsContainer = document.createElement('div');
        emojiButtonsContainer.id = 'emoji-buttons-container';
        emojiButtonsContainer.style.marginBottom = '10px'; // Ajusta el margen según sea necesario

// Arrays de emojis y rutas de imágenes
        const emojis = [':)', ':(', ';)', '8)', ':´(', ':D', ':P', ':|', ':/'];
        const emojiImages = ['imagenes/alegre.gif', 'imagenes/triste.gif', 'imagenes/guinyo.gif', 'imagenes/gafas.gif', 'imagenes/llorar.gif', 'imagenes/risa.gif', 'imagenes/lengua.gif', 'imagenes/serio.gif', 'imagenes/pensativo.gif', 'imagenes/enfadado.gif'];

// Crear botones de emoji y agregarlos al contenedor
        emojis.forEach((emoji, index) => {
            const emojiButton = document.createElement('button');
            const img = document.createElement('img');
            img.src = emojiImages[index];
            img.alt = emoji;
            emojiButton.appendChild(img);
            emojiButton.style.cursor = 'pointer';
            emojiButton.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                addEmoji('[' + emoji + ']');
            };
            emojiButtonsContainer.appendChild(emojiButton);
        });

// Agregar el contenedor de botones de emoji al toolbar
        toolbar.appendChild(emojiButtonsContainer);



        // Actualizar el contenido del textarea original al enviar el formulario

        postForm.addEventListener('submit', (event) => {
            const htmlContent = editorContainer.innerHTML;
            textarea.value = convertHtmlToForumFormat(htmlContent);
        });

        // Añadir estilos CSS al documento
        const style = document.createElement('style');
        style.textContent = `
            #ce-toolbar {
                margin-bottom: 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            #ce-toolbar button {
                background-color: #f0f0f0;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            #ce-toolbar button:hover {
                background-color: #e0e0e0;
            }
            #ce-toolbar button img {
                width: 10px;
                height: 10px;
            }
            #ce-toolbar button b,
            #ce-toolbar button i,
            #ce-toolbar button u {
                font-size: 16px;
            }
            #ce-toolbar button:first-of-type {
                margin-left: 10px;
            }
            #emoji-buttons-container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 10px;
                width: 100%;
            }
        `;
        document.head.appendChild(style);

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
        .replace(/<u>(.*?)<\/u>/g, '[u]$1[/u]')
        .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[web] $2 [separador] $1 [/web]')
        .replace(/<br>/g, '\n')
        .replace(/<div>/g, '\n')
        .replace(/<\/div>/g, '');
}

function convertForumFormatToHtml(forumText) {
    return forumText
        .replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>')
        .replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
        .replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
        .replace(/\[web\] (.*?) \[separador\] (.*?) \[\/web\]/g, '<a href="$2">$1</a>')
        .replace(/\n/g, '<br>')
        .replace(/<\/br>/g, '<div>')
        .replace(/<\/br>/g, '</div>');
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
// Función para alternar el subrayado
function toggleUnderline() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    const parentNode = range.commonAncestorContainer.parentNode;

    if (parentNode.nodeName === 'U') {
        // Quitar subrayado
        const textNode = document.createTextNode(selectedText);
        parentNode.parentNode.replaceChild(textNode, parentNode);
    } else {
        // Añadir subrayado
        const underlineNode = document.createElement('u');
        underlineNode.appendChild(document.createTextNode(selectedText));
        range.deleteContents();
        range.insertNode(underlineNode);
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

    let url = prompt('Ingrese la URL del enlace:');
    if (!url) return;

    // Asegurarse de que la URL tenga el prefijo https:// si no es un correo electrónico o una imagen
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (isValidEmail(url)) {
            url = 'mailto:' + url;
        } else if (!isValidImageUrl(url)) {
            url = 'https://' + url;
        }
    }

    // Si no hay texto seleccionado, usamos la URL como texto del enlace
    let linkText = selectedText || url;

    const linkNode = document.createTextNode(`[web] ${url} [separador] ${linkText} [/web]`);
    range.deleteContents();
    range.insertNode(linkNode);

    // Re-seleccionar el texto
    selection.removeAllRanges();
    selection.addRange(range);
}

function isValidEmail(string) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(string);
}

function isValidImageUrl(url) {
    const imgExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imgExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

function isValidUrl(url) {
    const urlRegex = /^(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]$/i;
    return urlRegex.test(url);
}


function addEmoji(emoji) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const emojiNode = document.createTextNode(emoji);
    range.deleteContents();
    range.insertNode(emojiNode);

    // Re-seleccionar el texto
    selection.removeAllRanges();
    selection.addRange(range);
}

