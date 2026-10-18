async function carregarDados() {
    try {
        // 1. Pega o id da URL (ex: games.html?id=2)
        const params = new URLSearchParams(window.location.search);
        const idJogo = params.get('id');

        if (!idJogo) {
            document.getElementById('titulo-jogo').textContent = 'Jogo não especificado';
            return;
        }

        // 2. Busca todos os jogos no json-server
        const resJogos = await fetch("http://localhost:3000/jogos");
        if (!resJogos.ok) throw new Error("Erro ao buscar jogos");

        const dados = await resJogos.json();

        // 3. Encontra o jogo pelo id da URL
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


function carregarBanner(jogo) {
    const banner = document.getElementById('banner');
    if (!banner) return;

    banner.innerHTML = `<img src="${jogo.foto}" alt="${jogo.nome}">`;
}


function carregarInfoJogo(jogo) {
    const titulo = document.getElementById('titulo-jogo');
    const descricao = document.getElementById('descricao-jogo');
    const detalhes = document.getElementById('detalhes-jogo');
    const progresso = document.getElementById('progresso-jogo');

    // Título e Descrição
    if (titulo) titulo.textContent = jogo.nome;
    if (descricao) descricao.textContent = jogo.descrição;

    // Ficha Técnica (Desenvolvedora, Gênero, Lançamento, Nota)
    if (detalhes) {
        // Transforma o array ["Ação", "RPG"] em "Ação, RPG"
        const generosFormatados = Array.isArray(jogo.genero) ? jogo.genero.join(', ') : jogo.genero;
        
        // Se a nota for maior que 0, mostra a estrela, senão mostra "Não avaliado"
        const notaFormatada = jogo.nota > 0 ? `⭐ ${jogo.nota} / 5` : 'Não avaliado';

        detalhes.innerHTML = `
            <div class="item-detalhe">
                <span class="label">Desenvolvedora</span>
                <span class="valor">${jogo.desenvolvedora || 'Não informada'}</span>
            </div>
            <div class="item-detalhe">
                <span class="label">Gênero</span>
                <span class="valor">${generosFormatados || 'Não informado'}</span>
            </div>
            <div class="item-detalhe">
                <span class="label">Lançamento</span>
                <span class="valor">${jogo.data_lancamento || 'Não informado'}</span>
            </div>
            <div class="item-detalhe">
                <span class="label">Nota</span>
                <span class="valor">${notaFormatada}</span>
            </div>
        `;
    }

    // Barra de Conquistas
    if (progresso) {
        const porcentagem = (jogo.conquistas / jogo.conquistas_totais) * 100;

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
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');

    iconSun.style.display = isDark ? 'none' : 'block';
    iconMoon.style.display = isDark ? 'block' : 'none';

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Inicializa a página
carregarDados();