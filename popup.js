document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', () => {
        const editorContent = editor.innerHTML;
        const formattedContent = convertHtmlToForumFormat(editorContent);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: insertFormattedContent,
                args: [formattedContent]
            });
        });
    });
});

function insertFormattedContent(formattedContent) {
    const textarea = document.querySelector('textarea'); // Ajusta el selector según la estructura del foro

    if (textarea) {
        textarea.value = formattedContent;
    }
}

function convertHtmlToForumFormat(html) {
    return html
        .replace(/<b>(.*?)<\/b>/g, '[b]$1[/b]')
        .replace(/<i>(.*?)<\/i>/g, '[i]$1[/i]')
        .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[web] $2 [separador] $1 [/web]')
        .replace(/<br>/g, '\n');
}
