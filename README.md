# 🎨 Meu Acervo Criativo

> Trabalho Pratico 1 — Desenvolvimento de Interfaces Web (PUC Minas)

## 📖 Sobre o Projeto

O **Meu Acervo Criativo** é uma aplicação web front-end que funciona como um portfólio pessoal e acervo de interesses. O site reúne, de forma dinâmica, informações sobre ilustrações autorais, progresso de leitura, coleções de cartas TCG e um log de games zerados ou em andamento.

A aplicação consome dados de uma API simulada (JSON Server) e conta com duas telas principais: uma **home-page** com visão geral e um **carrossel de destaques**, e uma **página de detalhes** que exibe informações aprofundadas sobre um jogo específico, incluindo ficha técnica, conquistas e galeria de fotos.

## ✨ Funcionalidades

- **Página Inicial (`index.html`)**
  - Menu de navegação com âncoras para as seções.
  - Carrossel de destaques com navegação (próximo/anterior) e indicadores.
  - Grade de ilustrações em efeito mosaico.
  - Estante virtual dividida em "Lendo", "Lidos" e "Quero Ler".
  - Barras de progresso para coleções TCG (Pokémon e One Piece).
  - Cards de jogos com barra de conquistas e link para a página de detalhes.
  - Alternância entre tema claro e escuro (persistida via `localStorage`).
  - Seção "Sobre o Desenvolvedor" com links para GitHub, LinkedIn e portfólio.

- **Página de Detalhes (`games.html`)**
  - Leitura do `id` do jogo via query string (`?id=X`).
  - Banner de capa, título e descrição completa.
  - Ficha técnica com **desenvolvedora**, **gênero**, **data de lançamento** e **nota**.
  - Barra de progresso de conquistas com ícone de troféu.
  - Galeria de fotos vinculadas ao jogo (screenshots).

## 🛠️ Tecnologias Utilizadas

- **HTML5** — estrutura semântica.
- **CSS3** — estilização responsiva, variáveis CSS (temas claro/escuro), Flexbox e Grid Layout.
- **JavaScript (Vanilla)** — manipulação do DOM, consumo de API com `fetch`, lógica do carrossel e persistência de tema.
- **JSON Server** — API fake para simular o back-end e fornecer os dados do arquivo `db.json`.


## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 14 ou superior).
- Navegador web moderno.

### Passo a passo

1. **Baixe o zip.**

2. **Abra o arquivo**

3. **Abra o terminal**

4. **Rode:**
`npm start`

5. **Ative o Live Serve ou em outro terminal rode:**
`npx serve ./public/src`

    - **Se tiver rodado o npx, copie o localhost gerado e cole no navegador**
