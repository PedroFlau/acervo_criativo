// ==========================================
// CARREGAMENTO DOS DADOS DO JOGO
// ==========================================
async function carregarDados() {
    try {
        // 1. Pega o id da URL (ex: games.html?id=2)
        const params = new URLSearchParams(window.location.search);
        const idJogo = params.get('id');

        if (!idJogo) {
            document.getElementById('titulo-jogo').textContent = 'Jogo não especificado';
            return;
        }

        // 2. Busca todos os jogos
        const resJogos = await fetch("http://localhost:3000/jogos");
        if (!resJogos.ok) throw new Error("Erro ao buscar jogos");

        const dados = await resJogos.json();

        // 3. Encontra o jogo pelo id
        const jogo = dados.jogo.find(j => j.id === Number(idJogo));

        if (!jogo) {
            document.getElementById('titulo-jogo').textContent = 'Jogo não encontrado';
            return;
        }

        // 4. Preenche a página
        carregarBanner(jogo);
        carregarInfoJogo(jogo);

    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        const titulo = document.getElementById('titulo-jogo');
        if (titulo) titulo.textContent = 'Erro ao carregar o jogo';
    }
}

// ==========================================
// PREENCHIMENTO DO BANNER (section #cabeçalho)
// ==========================================
function carregarBanner(jogo) {
    const banner = document.getElementById('banner');
    if (!banner) return;

    banner.innerHTML = `<img src="${jogo.foto}" alt="${jogo.nome}">`;
}

// ==========================================
// PREENCHIMENTO DAS INFORMAÇÕES (section #info-jogo)
// ==========================================
function carregarInfoJogo(jogo) {
    const titulo = document.getElementById('titulo-jogo');
    const descricao = document.getElementById('descricao-jogo');
    const progresso = document.getElementById('progresso-jogo');

    if (titulo) titulo.textContent = jogo.nome;
    if (descricao) descricao.textContent = jogo.descrição;

    if (progresso) {
        const porcentagem = (jogo.conquistas / jogo.conquistas_totais) * 100;

        // Layout: [🏆] [ Barra de Progresso ] [ 30/51 ]
        progresso.innerHTML = `
            <span class="icone-trofeu" title="Conquistas">🏆</span>
            <div class="fundo-barra">
                <div class="preenchimento" style="width: ${porcentagem}%;"></div>
            </div>
            <span class="texto-conquistas">${jogo.conquistas}/${jogo.conquistas_totais}</span>
        `;
    }
}

// ==========================================
// LÓGICA DO TEMA CLARO/ESCURO
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const iconSun = themeToggle.querySelector('.icon-sun');
const iconMoon = themeToggle.querySelector('.icon-moon');
const body = document.body;

// Verifica se o usuário já escolheu um tema anteriormente
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    iconSun.style.display = 'none';
    iconMoon.style.display = 'block';
}

// Adiciona o evento de clique no botão
themeToggle.addEventListener('click', () => {
    // Alterna a classe 'dark' no body
    body.classList.toggle('dark');

    // Verifica se o modo escuro está ativo agora
    const isDark = body.classList.contains('dark');

    // Atualiza os ícones
    iconSun.style.display = isDark ? 'none' : 'block';
    iconMoon.style.display = isDark ? 'block' : 'none';

    // Salva a preferência no navegador
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

carregarDados();