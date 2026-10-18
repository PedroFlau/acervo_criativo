// ==========================================
// CARREGAMENTO PRINCIPAL DE DADOS
// ==========================================
async function carregarDados() {
    try {
        const [resEstante, resCartas, resJogos, resIlustracoes] = await Promise.all([
            fetch("http://localhost:3000/estante"),
            fetch("http://localhost:3000/cartas"),
            fetch("http://localhost:3000/jogos"),
            fetch("http://localhost:3000/ilustracoes")
        ]);

        // Verifica cada um individualmente para não quebrar tudo de uma vez
        if (!resEstante.ok) console.error("Erro ao buscar Estante");
        if (!resCartas.ok) console.error("Erro ao buscar Cartas");
        if (!resJogos.ok) console.error("Erro ao buscar Jogos");
        if (!resIlustracoes.ok) console.error("Erro ao buscar Ilustrações");

        // Extraindo os dados
        const estante = resEstante.ok ? await resEstante.json() : null;
        const cartas = resCartas.ok ? await resCartas.json() : null;
        const jogos = resJogos.ok ? await resJogos.json() : null;
        const ilustracoes = resIlustracoes.ok ? await resIlustracoes.json() : null;

        // Só chama a função se os dados existirem
        if (estante) carregarEstante(estante);
        if (cartas) carregarBarraTcg(cartas);
        if (jogos) {
            carregarCarrossel(jogos);  
            carregarJogos(jogos);
        }
        if (ilustracoes) carregarIlustracoes(ilustracoes);

    } catch (erro) {
        console.error("Erro crítico ao carregar os dados:", erro);
    }
}

// ==========================================
// ESTANTE VIRTUAL
// ==========================================
function preencherLista(elementoUl, arrayLivros) {
    if (!elementoUl) return;
    elementoUl.innerHTML = '';

    arrayLivros.forEach(element => {
        const li = document.createElement('li');
        li.textContent = element.nome;
        elementoUl.appendChild(li);
    });
}

function carregarEstante(estante) {
    const listaLendo = document.getElementById('lista-lendo');
    const listaLidos = document.getElementById('lista-lidos');
    const listaQueroLer = document.getElementById('lista-quero-ler');

    preencherLista(listaLendo, estante.categoria.lendo);
    preencherLista(listaLidos, estante.categoria.lidos);
    preencherLista(listaQueroLer, estante.categoria.quero_ler);
}

// ==========================================
// COLEÇÕES TCG
// ==========================================
function calcularPorcentagem(atual, maximo) {
    return (atual / maximo) * 100;
}

function carregarBarraTcg(cartas) {
    const container = document.getElementById('container-barras-tcg');
    if (!container) return;

    let htmlGerado = '';
    const categorias = cartas.categoria;

    for (const nomeCategoria in categorias) {
        const arrayColecoes = categorias[nomeCategoria];
        
        if (arrayColecoes.length > 0) {
            const info = arrayColecoes[0];
            const nomeFormatado = nomeCategoria
                .replace('_', ' ')
                .replace(/\b\w/g, letra => letra.toUpperCase());

            const porcentagem = calcularPorcentagem(info.atual, info.maximo);

            htmlGerado += `
                <div class="barra-progresso">
                    <span>${nomeFormatado}</span>
                    <div class="fundo-barra">
                        <div class="preenchimento" style="width: ${porcentagem}%;"></div>
                    </div>
                </div>
            `;
        }
    }
    container.innerHTML = htmlGerado;
}

// ==========================================
// LOG DE GAMES (CARDS)
// ==========================================
function carregarJogos(jogos) {
    const container = document.getElementById('container-jogos');
    if (!container) return;

    let htmlGerado = '';

    jogos.jogo.forEach(jogo => {
        const porcentagem = calcularPorcentagem(jogo.conquistas, jogo.conquistas_totais);

        htmlGerado += `
            <a href="games.html?id=${jogo.id}" class="card-jogo">
                <div class="foto-jogo">
                    <img src="${jogo.foto}" alt="${jogo.nome}">
                </div>
                <h3>${jogo.nome}</h3>
                <div class="fundo-barra">
                    <div class="preenchimento" style="width: ${porcentagem}%;"></div>
                </div>
            </a>
        `;
    });

    container.innerHTML = htmlGerado;
}

// ==========================================
// ILUSTRAÇÕES
// ==========================================
function carregarIlustracoes(ilustracoes) {
    const container = document.getElementById('container-ilustracoes');
    if (!container) return;

    let htmlGerado = '';

    ilustracoes.forEach(ilustracao => {
        htmlGerado += `
            <article class="card-ilustracao">
                <img src="${ilustracao.foto}" alt="${ilustracao.nome}">
                <span class="titulo-hover">${ilustracao.nome}</span>
            </article>
        `;
    });

    container.innerHTML = htmlGerado;
}

// ==========================================
// LÓGICA DO TEMA CLARO/ESCURO
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const iconSun = themeToggle.querySelector('.icon-sun');
const iconMoon = themeToggle.querySelector('.icon-moon');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    
    iconSun.style.display = isDark ? 'none' : 'block';
    iconMoon.style.display = isDark ? 'block' : 'none';
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ==========================================
// CARROSSEL DE DESTAQUES
// ==========================================
let indiceAtual = 0;
let totalSlides = 0;

function carregarCarrossel(jogos) {
    const trilha = document.getElementById('carrossel-trilha');
    const indicadores = document.getElementById('carrossel-indicadores');
    if (!trilha) return;

    // Filtra ESTRITAMENTE os jogos com a flag booleana "destaque: true"
    const destaques = jogos.jogo.filter(j => j.destaque === true);
    
    // Se nenhum jogo estiver em destaque, exibe um aviso
    if (destaques.length === 0) {
        trilha.innerHTML = '<p style="padding: 20px; text-align: center; width: 100%; color: var(--text-muted);">Nenhum jogo em destaque no momento.</p>';
        if (indicadores) indicadores.innerHTML = '';
        return;
    }

    totalSlides = destaques.length;

    // Monta os slides
    trilha.innerHTML = destaques.map(jogo => `
        <article class="slide">
            <a href="games.html?id=${jogo.id}">
                <div class="slide-foto">
                    <img src="${jogo.foto}" alt="${jogo.nome}">
                </div>
                <div class="slide-info">
                    <h3>${jogo.nome}</h3>
                    <p>${jogo.descrição}</p>
                    <span class="slide-cta">Ver detalhes →</span>
                </div>
            </a>
        </article>
    `).join('');

    // Monta os indicadores
    indicadores.innerHTML = destaques
        .map((_, i) => `<span data-index="${i}" class="${i === 0 ? 'ativo' : ''}"></span>`)
        .join('');

    // Eventos dos botões de navegação
    document.getElementById('btn-proximo').onclick = () => mover(1);
    document.getElementById('btn-anterior').onclick = () => mover(-1);

    // Eventos dos indicadores (bolinhas)
    indicadores.querySelectorAll('span').forEach(bolinha => {
        bolinha.onclick = () => {
            indiceAtual = Number(bolinha.dataset.index);
            atualizarCarrossel();
        };
    });

    // Reseta o índice ao carregar
    indiceAtual = 0;
    atualizarCarrossel();
}

function mover(passo) {
    indiceAtual = (indiceAtual + passo + totalSlides) % totalSlides;
    atualizarCarrossel();
}

function atualizarCarrossel() {
    const trilha = document.getElementById('carrossel-trilha');
    if (!trilha) return;
    
    trilha.style.transform = `translateX(-${indiceAtual * 100}%)`;

    document.querySelectorAll('.carrossel-indicadores span').forEach((b, i) => {
        b.classList.toggle('ativo', i === indiceAtual);
    });
}

// Inicializa a aplicação
carregarDados();