async function carregarDados() {
    try {
        const [resEstante, resCartas, resJogos] = await Promise.all([
            fetch("http://localhost:3000/estante"),
            fetch("http://localhost:3000/cartas"),
            fetch("http://localhost:3000/jogos")
        ]);

        if (!resEstante.ok || !resCartas.ok || !resJogos.ok) {
            throw new Error("Erro ao buscar dados do servidor");
        }

        // Extraindo os dados de TODAS as requisições
        const estante = await resEstante.json();
        const cartas = await resCartas.json();
        const jogos = await resJogos.json();

        // Chamando as funções para exibir os dados
        carregarEstante(estante);
        carregarBarraTcg(cartas);
        carregarJogos(jogos);

    } catch (erro) {
        console.error("Erro ao carregar os dados:", erro);
    }
}

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

// Função utilitária para calcular porcentagem
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

            // Formata o nome: "one_piece" vira "One Piece"
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

function carregarJogos(jogos) {
    const container = document.getElementById('container-jogos');
    if (!container) return;

    let htmlGerado = '';

    jogos.jogo.forEach(jogo => {
        // Calcula a porcentagem de conquistas
        const porcentagem = calcularPorcentagem(jogo.conquistas, jogo.conquistas_totais);

        htmlGerado += `
            <article class="card-jogo">
                <div class="foto-jogo">
                    <img src="${jogo.foto}" alt="${jogo.nome}">
                </div>
                <h3>${jogo.nome}</h3>
                <div class="fundo-barra">
                    <div class="preenchimento" style="width: ${porcentagem}%;"></div>
                </div>
            </article>
        `;
    });

    container.innerHTML = htmlGerado;
}

carregarDados();