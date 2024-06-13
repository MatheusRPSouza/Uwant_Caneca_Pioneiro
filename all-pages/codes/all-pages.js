// Variável de controle: ajuste para true ou false conforme necessário
var adjustLayout = true;

/*--  header --------------------------------------------------------------------------------------
----- Tradução: Cabeçalho - Área no topo da página onde geralmente fica a logo e a navegação.
-------------------------------------------------------------------------------------------------*/
function loadPage(tagSelect, pageImport) {
    var importPage = new XMLHttpRequest();
    importPage.onreadystatechange = function () {
        if (importPage.readyState === 4 && importPage.status === 200) {
            var content = importPage.responseText;

            // Verifica se a tag já existe no documento
            var existingTag = document.querySelector(tagSelect);

            // Extrai o conteúdo da tag importada
            var importedContent = document.createElement('div');
            importedContent.innerHTML = content;
            var importedTagContent = importedContent.querySelector(tagSelect);

            // 1° Condicional: Arquivo: Com Tag, Externo: Sem Tag
            if (existingTag && !importedTagContent) {
                existingTag.innerHTML += content;
            }
            // 2° Condicional: Arquivo: Sem Tag, Externo: Com Tag
            else if (!existingTag && importedTagContent) {
                existingTag = document.createElement(tagSelect);
                if (tagSelect === 'header') {
                    document.body.insertBefore(existingTag, document.body.firstChild);
                } else if (tagSelect === 'footer') {
                    document.body.appendChild(existingTag);
                } else {
                    var footerTag = document.querySelector('footer');
                    if (footerTag) {
                        document.body.insertBefore(existingTag, footerTag);
                    } else {
                        document.body.appendChild(existingTag);
                    }
                }
                existingTag.innerHTML = importedTagContent.innerHTML;
            }
            // 3° Condicional: Arquivo: Com Tag, Externo: Com Tag
            else if (existingTag && importedTagContent) {
                existingTag.innerHTML += importedTagContent.innerHTML;
            }
            // 4° Condicional: Arquivo: Sem Tag, Externo: Sem Tag
            else if (!existingTag && !importedTagContent) {
                existingTag = document.createElement(tagSelect);
                if (tagSelect === 'header') {
                    document.body.insertBefore(existingTag, document.body.firstChild);
                } else if (tagSelect === 'footer') {
                    document.body.appendChild(existingTag);
                } else {
                    var footerTag = document.querySelector('footer');
                    if (footerTag) {
                        document.body.insertBefore(existingTag, footerTag);
                    } else {
                        document.body.appendChild(existingTag);
                    }
                }
                existingTag.innerHTML = content;
            }

            // Ajuste de layout se adjustLayout for true
            if (adjustLayout && tagSelect === 'header') {
                // Carrega o conteúdo do navbar.html e obtém a altura da página B
                calcularAlturaTotal(content);
            }
        }
    };

    importPage.open("GET", "all-pages/" + pageImport, true);
    importPage.send();
}

// Função para calcular a altura total dos elementos no navbar.html
function calcularAlturaTotal(content) {
    // Cria um contêiner invisível para calcular a altura dos elementos
    var container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.style.width = '100%'; // Garante que a largura seja considerada
    container.innerHTML = content;
    document.body.appendChild(container);

    // Calcula a altura total dos elementos dentro do contêiner
    var totalHeight = 0;
    Array.from(container.children).forEach(child => {
        var style = window.getComputedStyle(child);
        var marginHeight = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        totalHeight += child.offsetHeight + marginHeight;
    });

    console.log('Altura total do navbar.html: ' + totalHeight + ' pixels');

    // Remove o contêiner
    document.body.removeChild(container);

    // Define o padding-top do primeiro elemento filho do body com a altura obtida
    var firstChild = document.body.firstElementChild;
    if (firstChild) {
        firstChild.style.paddingTop = totalHeight + 'px';
        console.log('Ajuste de layout: padding-top de ' + totalHeight + 'px no primeiro elemento do body');
    }
}

// Exemplo de uso
loadPage("header", "navbar.html");
loadPage("footer", "footer.html");
// loadPage("customTag", "customContent.html");
