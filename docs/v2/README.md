# Borderline.Dev V2 — plano de evolução

Data: 15/11/2026. Base auditada: `main`, commit `16b9a54`. Branch: `docs/v2-plan`.

**Status: mediakit aprovado; home reformulada para validação visual.** A entrada aplica preto, vermelho, branco e cinzas, Poppins no conteúdo e Offside nos detalhes. Hover e scroll revelam seis serviços atrás do card da agência. Veja a [entrega da home](entregas/01-home-mediakit.md), a [referência do mediakit](entregas/00-mediakit.md) e o [histórico do primeiro hero](entregas/01-hero-menu.md). As demais experiências continuam propostas.

## Objetivo

Fazer a agência reconhecer capacidade de execução ao experimentar o próprio site. A V2 evolui a identidade autoral e tridimensional da Borderline.Dev para uma expressão mais suave e profissional e amplia a prova técnica: websites, 3D, jogos, dados, sistemas e infraestrutura. A proposta visual principal passa a explorar um hero sem máscara; a retirada definitiva do símbolo permanece em avaliação.

Mensagem central proposta: **“A operação técnica por trás da sua agência.”** A Borderline.Dev tem equipe própria de desenvolvimento e TI nos bastidores, enquanto Mário conduz reuniões, decisões técnicas e entregas como interlocutor integrado à agência. Cada demo precisa mostrar o que essa operação entrega sob a marca da agência.

## Direção proposta

A home será uma apresentação navegável com demonstrações funcionais. Cada capítulo tem uma ação evidente, uma consequência visual e uma aplicação comercial. O visitante pode percorrer a narrativa ou entrar diretamente no serviço que interessa.

| Capítulo | Experiência principal | O que a agência percebe |
| --- | --- | --- |
| Abertura | Card da agência em primeiro plano; hover/scroll revelam seis serviços da operação por trás | Clareza da oferta, estrutura e domínio de execução |
| White label | Desfecho da abertura: serviços e direções visuais transformam a assinatura de e-mail | Mário assume a frente técnica da agência, apoiado pela operação própria |
| Websites | Campanha navegável que se recompõe entre larguras e conteúdos | Fidelidade ao design, responsividade e acabamento |
| 3D e produto | Luminária modular com acabamentos, componentes e luz ajustáveis | Configuradores, lançamentos e experiências de produto |
| Jogos | Minijogo com três faixas, colisões, pontuação e reinício | Mecânicas reais para campanhas e ativações |
| Dados | Série temporal, Sankey e matriz conectados por filtros | Visualização com D3 além de gráficos decorativos |
| Sistemas | Um lead percorre validação, CRM e notificação, inclusive com erro e recuperação | Integrações, estados e consistência |
| Infraestrutura | Planta de escritório com equipamentos, rede, cloud e falhas simuladas | Planejamento e operação concretos |
| Parceria | Duas camadas: interlocução com Mário e frentes operacionais nos bastidores | Um ponto de contato coordenando uma equipe própria de entrega |
| Contato | Resumo de interesse que pode ser copiado para conversar no LinkedIn | Próximo passo claro, com contexto |

Jogo, D3 complexo, planta de infraestrutura e assinatura transformável vêm das ideias do operador. Os temas específicos das demais demos são propostas deste planejamento.

## Documentos

1. [Direção e auditoria](01-direcao-e-auditoria.md): o que existe e o que preservar ou evoluir.
2. [Arquitetura da informação](02-arquitetura-da-informacao.md): narrativa, navegação, URLs e PT/EN.
3. [Seções e demonstrações](03-secoes-e-demonstracoes.md): composição, interação, estados e aceite.
4. [Arquitetura técnica](04-arquitetura-tecnica.md): componentes, cenas, dados, desempenho e migração.
5. [Roadmap e Git](05-roadmap-e-git.md): entregas, dependências, branches e commits.
6. [Validação](06-validacao.md): verificações do agente e roteiro do operador.
7. [Registro de ideias](07-registro-de-ideias.md): sugestões, correções e decisões abertas.
8. [Workflow ativo no GitHub](08-github-workflow.md): milestones, issues, estados, PRs e verificações automáticas.

## Restrições confirmadas

- Português e inglês desde o início de cada entrega.
- Preservar reconhecimento da marca, presença do 3D e foco white label para agências, evoluindo para uma linguagem mais suave; a máscara deixa de ser requisito de preservação.
- Comunicar equipe própria operacional nos bastidores, liderança técnica de Mário e capacidade de atender múltiplos clientes, conforme confirmado pelo operador; não divulgar integrantes nem inventar porte numérico.
- Demonstrar serviços por experiências reconhecíveis e funcionais, com impacto próprio por seção.
- Nenhum teste em navegador pelo agente, inclusive automação e screenshots.
- Usar pnpm e Docker quando necessários; commits com a identidade indicada no README.
- Desenvolvimento local em branches da V2; a V1 em `main` permanece disponível. O mediakit foi aprovado e o operador autorizou sua aplicação à home com abertura dos cards por hover/scroll.
- Tema claro por padrão e escuro por escolha explícita. Persistir a escolha localmente; não seguir preferências de cor do navegador/OS. Seções escuras podem existir no tema claro como decisão editorial.
- Na assinatura, o visitante escolhe **serviços, direção visual e paleta**. Cargo, componentes, fontes e layout são derivados. O nome de Mário permanece fixo; agência e e-mail vêm de exemplos fictícios. Não há preenchimento desses dados.
- A assinatura conclui a narrativa de abertura, depois de explicar oferta, liderança e equipe. A primeira tela comunica a proposta antes de pedir interação.

## Ordem de construção sugerida

Mediakit e validação dos fundamentos visuais; reformulação do hero/menu; base de navegação e ciclo de vida; assinatura white label; laboratório D3; infraestrutura; jogo; websites; configurador de produto; sistemas e integrações; narrativa de parceria e contato; integração final. A ordem de construção difere da ordem de leitura da home.

Uma entrega completa inclui PT/EN, controles, resposta à interação, reset, alternativa sem animação e roteiro de validação. Uma cena bonita sozinha não encerra a entrega.

## Decisões abertas

| Tema | Proposta de partida | Momento de decisão |
| --- | --- | --- |
| Voz da marca | Voz de empresa/operação; Mário como liderança e interlocutor, equipe própria nos bastidores | Refinar texto sem reduzir a oferta a trabalho individual |
| Identidade | Mediakit aprovado: preto, vermelho `#e50914`, branco e cinzas; Poppins nos títulos e textos, Offside na marca, botões e chapéus curtos; círculos para ações e camadas para identidade | Validar aplicação na home; microanimações autorais presentes, seleção de Lordicon/Lotties ainda pendente |
| Assinatura | Três direções visuais e seis serviços; papel derivado por regras simples | Storyboard da primeira demo |
| Jogo | Percurso de 30 segundos e tema geométrico original | Antes de implementar o jogo |
| Produto 3D | Luminária modular autoral | Antes de implementar o configurador |
| Casos reais | Somente materiais e resultados autorizados; demos identificadas como autorais | Antes de adicionar portfólio |
| Publicação | Manter destino atual e confirmar procedimento de deploy | Preparação da versão final |

Novas ideias entram no registro e são refletidas nos documentos afetados. Nenhuma dessas propostas deve ser apresentada como funcionalidade já existente.
