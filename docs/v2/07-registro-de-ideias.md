# Registro de ideias e decisões

Planejamento vivo iniciado em 15/11/2026. Registrar intenção, interpretação atual, estado e documentos afetados. Uma ideia não equivale automaticamente a implementação ou aprovação de todas as alternativas.

## I-001 — Provar os serviços dentro do site

- **Origem:** pedido inicial do operador.
- **Intenção:** ampliar o site, manter identidade e 3D e demonstrar capacidade white label para agências.
- **Exemplos pedidos:** jogo funcional, gráficos D3 complexos e interativos, planta de empresa com equipamentos e rede conectada à cloud.
- **Estado:** requisito confirmado; temas e mecânicas específicos são propostas.
- **Aplicação:** seis capítulos de capacidade, com demos e composições próprias.
- **Documentos:** [arquitetura da informação](02-arquitetura-da-informacao.md), [demonstrações](03-secoes-e-demonstracoes.md).

## I-002 — Planejamento antes do desenvolvimento

- **Origem:** resposta “Planejamento detalhado primeiro”.
- **Estado:** decisão confirmada.
- **Aplicação:** esta branch contém documentação; implementação será uma etapa posterior.
- **Documentos:** [índice](README.md), [roadmap](05-roadmap-e-git.md).

## I-003 — Assinatura que assume a identidade da agência

- **Origem:** ideia de explicar white label com uma assinatura de e-mail de Mario que muda cargo, e-mail e layout, possivelmente em 3D.
- **Intenção:** tornar visível a integração do profissional à equipe da agência.
- **Primeira correção:** o visitante não precisa escolher cargo ou nome; podem existir identidades fictícias transformadas por uma interação.
- **Estado:** conceito confirmado, refinado pela I-004.
- **Descartado:** formulário de nome, cargo, domínio ou e-mail; preenchimento manual de identidade.
- **Alternativa anterior:** arrastar/virar a assinatura para alternar identidades. Pode sobreviver como gesto secundário de inspeção, mas a seleção de serviços e direção visual da I-004 passa a conduzir a transformação.

## I-004 — Serviços e direção visual compõem a assinatura

- **Origem:** refinamento do operador: oferecer a gama de serviços e paletas/tipografias abstratas como “Moderna” e “Casual”; escolhas alteram forma, fontes, cargo e componentes da assinatura.
- **Estado:** versão ativa da ideia de white label. A implementação detalhada abaixo é proposta para revisão.
- **Controles:** seleção múltipla de serviços; escolha de direção visual; escolha de paleta compatível.
- **Derivados:** cargo, fontes, alinhamento, estrutura, módulos e acentos. Sem campo para editar cargo, nome ou e-mail.
- **Identidade:** nome do profissional fixo; marca e e-mail de agência vêm de fixtures fictícias, identificadas como demonstração.
- **Comportamento:** a peça 3D se recompõe conforme as escolhas e apresenta uma assinatura HTML legível. A mudança de estilo transforma a composição, não apenas a cor.
- **Mensagem inicial:** “A sua agência assina. Eu desenvolvo.” Evoluída pela I-005 para comunicar operação com equipe própria e liderança técnica, mantendo a assinatura como representação do interlocutor.
- **Aplicação:** primeira demo completa sugerida no roadmap; a I-006 define seu lugar como desfecho da narrativa de abertura.
- **Documentos:** S02 em [demonstrações](03-secoes-e-demonstracoes.md), contrato e regras em [arquitetura técnica](04-arquitetura-tecnica.md), V2-03 em [roadmap](05-roadmap-e-git.md).

## I-005 — Empresa com equipe própria e uma frente técnica

- **Origem:** pedido para transmitir porte e capacidade operacional, com Mário à frente de reuniões e decisões e desenvolvimento/TI nos bastidores.
- **Esclarecimento do operador:** “eu tenho minha própria equipe, que não aparece, mas é quem garante as entregas... e eu sou só a frente. Eu participo das reuniões, explico decisões e faço as entregas, enquanto a equipe por trás é operacional para garantir múltiplos clientes.”
- **Estado:** modelo operacional confirmado pelo operador. Não é uma equipe hipotética ou uma rede de parceiros presumida.
- **Posicionamento ativo:** operação técnica white label com equipe própria e um único interlocutor técnico integrado à agência.
- **Voz:** empresa/operação, com “nossa equipe”, “desenvolvemos” e “coordenamos”; Mário aparece como liderança e responsável pela interlocução.
- **Proposta visual:** assinatura na frente e frentes de entrega por trás; em Parceria, decisões seguem para a equipe e retornam como entregas coordenadas. Representar disciplinas e processo, sem expor integrantes.
- **Escala:** comunicar atendimento a múltiplos clientes conforme relato, sem inventar quantidades, capacidade ilimitada ou SLA.
- **Substitui:** direção anterior centrada na execução individual do profissional.
- **Documentos afetados:** índice, direção, arquitetura da informação, S02, S09 e respectivas tarefas do roadmap.

## I-006 — Assinatura como desfecho da abertura

- **Origem:** conversa sobre o hero; o operador observou que começar diretamente na assinatura poderia deixar a proposta pouco clara e sugeriu colocá-la no fim do storyboard.
- **Estado:** posição narrativa alinhada. Composição e transições específicas continuam propostas para revisão.
- **Aplicação:** S01 apresenta oferta, liderança técnica e equipe própria; S02 conclui o primeiro capítulo com adaptação à agência e assinatura interativa. As demonstrações de capacidade aprofundam a narrativa depois.
- **Proposta visual atual:** uma entrega digital reconhecível revela a estrutura que a sustenta. Ordem exata dos enquadramentos e ritmo ainda serão desenhados.
- **Condições:** primeira tela com mensagem e CTAs completos; navegação livre; nenhuma introdução obrigatória. Acesso direto à assinatura recebe contexto curto.
- **Substitui:** assinatura já interativa na primeira tela ou abertura integrada com seus controles visíveis desde o início.
- **Documentos:** arquitetura da informação, S01/S02, carregamento, roadmap e validação.

## I-007 — Identidade mais suave e hero sem máscara

- **Origem:** o operador gosta da máscara, mas a considera possivelmente agressiva para o posicionamento desejado e avalia sua retirada para fortalecer a marca profissional.
- **Estado:** intenção de suavizar confirmada; retirar definitivamente a máscara é uma possibilidade em avaliação. A proposta principal de hero passa a explorar uma composição sem o símbolo.
- **Direção proposta:** marca tipográfica Borderline.Dev, bordas e enquadramentos como linguagem, mais espaço, iluminação difusa, materiais suaves e movimento preciso. Paleta e tipografia finais serão revisadas.
- **Preservar:** personalidade autoral, domínio do 3D, riqueza das interações e posicionamento de operação técnica com equipe própria.
- **Mudança de requisito:** a máscara deixa de ser elemento obrigatório. A agressividade visual precisa ser revista também em contrastes, iluminação, pontas, saturação e ritmo, mantendo legibilidade.
- **Hero proposto:** entrega digital e camadas da operação, coerentes com a I-006. Não substituir a máscara por outro símbolo abstrato sem relação com o serviço.
- **Aplicação nesta etapa:** apenas planejamento; revisão da marca e implementação ocorrerão em etapas próprias.
- **Documentos:** índice, direção de arte, S01, assets, roadmap e avaliação criativa.

## I-008 — Claro por padrão, tema escolhido pelo visitante

- **Origem:** operador propôs versões clara e escura, clara como padrão e seletor explícito, sem acompanhar navegador ou OS.
- **Estado:** requisito confirmado e incluído no primeiro recorte de implementação.
- **Aplicação:** preferência manual persistida localmente, claro quando não existir valor válido; troca de idioma preserva a escolha. Seções podem ter atmosfera escura mesmo no tema claro.
- **Direção:** a base clara abre espaço para suavidade, com contraste entre capítulos conforme a narrativa.
- **Documentos:** direção, navegação, arquitetura técnica, V2-01 e roteiro de validação.

## I-009 — Começar pelo hero e menu

- **Origem:** “pode fazer o hero com o menu e a gente valida a partir dali”.
- **Estado:** recorte implementado em `fedf803`; direção visual rejeitada pelo operador, com reformulação adiada até validar a I-010.
- **Aplicação:** entrada sem máscara, mensagem de operação white label, composição em camadas, menu responsivo, PT/EN e seletor manual de tema.
- **Limite:** a assinatura e o storyboard completo permanecem para as próximas entregas. O primeiro hero explora a relação entre entrega e operação por controle explícito, usando CSS 3D/HTML/SVG.
- **Git:** branch `feat/v2-01-hero`, baseada em `v2`; merge e publicação não executados nesta entrega.

## I-010 — Mediakit antes da entrada

- **Origem:** operador considerou o visual distante do esperado e pediu validar elementos básicos antes de ajustar o hero.
- **Estado:** mudança de prioridade confirmada; primeira página de estudo implementada para revisão.
- **Paleta:** preto, vermelho original `#e50914`, branco e escala de cinza. A proposta quente/verde/terracota deixa de orientar a V2.
- **Links:** cor ou peso diferente e ponto vermelho da marca; experimentar expansão do ponto até envolver o texto.
- **Botões:** círculo com ícone em repouso; expansão para revelar texto no hover, com equivalente por foco e texto visível no toque.
- **Tipografia proposta:** Manrope no conteúdo, Offside preservada na marca. A família e os pesos ainda não estão aprovados.
- **Ícones:** operador quer mais complexidade que desenhos lineares simples. Phosphor Duotone integrado como amostra; Streamline Ultimate Duotone e Lordicon registrados como referências, sem aquisição de assets.
- **Aplicação:** `/?view=mediakit` e `/en/?view=mediakit`, independente do hero, com temas manuais e estados comparáveis.
- **Git:** `feat/v2-00-mediakit`, a partir de `feat/v2-01-hero` em `fedf803`; hero preservado em `/` e `/en/` para comparação.
- **Documentos:** direção, arquitetura técnica, roadmap e [entrega do mediakit](entregas/00-mediakit.md).

## I-011 — Superfície à frente, operação por trás

- **Origem:** [botão de vinodjangid07 no Uiverse](https://uiverse.io/vinodjangid07/great-ape-33), enviado pelo operador durante o desenvolvimento do mediakit.
- **Intenção:** associar a máscara/superfície frontal e a camada que aparece por trás ao conceito de white label.
- **Estado:** referência aceita para experimentação; implementação candidata, ainda sem aprovação visual.
- **Interpretação:** frente neutra representa a marca da agência; camada vermelha revela a estrutura técnica que a sustenta. É uma linguagem de superfícies e movimento, não decisão de recuperar a máscara facial da V1.
- **Aplicação:** segunda família de botões, comparação com o círculo expansível e peça maior com camadas que podem ficar abertas por clique.
- **Origem do código:** releitura própria em CSS. A página pública identifica o exemplo e sua licença MIT; o código HTML/CSS do exemplo não ficou acessível pela consulta HTTP. Não houve teste em navegador nem cópia de implementação.

## I-012 — Aprovação dos controles e ajuste de tipografia

- **Origem:** operador aprovou o mediakit e os botões, solicitando títulos com a mesma Offside da logo e ajustes nos links de bolinha.
- **Decisão:** Offside na marca, títulos e subtítulos; Manrope continua nos textos e controles. Offside usa peso regular, com espaçamento ajustado para seu desenho.
- **Links:** ponto à direita, expansão para a esquerda e padding horizontal simétrico, sem deslocar o texto durante a expansão.
- **Uso dos controles:** círculos expansíveis para ações; camadas/cartões que se revelam por trás para serviços e seções relacionadas à identidade.
- **Estado:** ajustes implementados no mediakit, em PT/EN, para conferência do operador. Hero permanece para a etapa seguinte.

## I-013 — Poppins para leitura, Offside nos detalhes

- **Origem:** operador avaliou que Offside não funcionou bem nos títulos e pediu Poppins para títulos e textos, reservando Offside a botões e chapéus curtos.
- **Decisão ativa:** Poppins no conteúdo, títulos e subtítulos; Offside regular na marca, botões, links expansíveis e chapéus curtos. Substitui a decisão tipográfica da I-012.
- **Implementação:** Poppins local nos pesos 400/500/600/700, títulos em 600; dependência e licença de Manrope removidas. Movimentos e espaçamentos dos controles preservados.
- **Estado:** aplicado ao mediakit PT/EN para conferência do operador, antes de retomar o hero.

## I-014 — Ícones animados, com Lordicon ou produção própria

- **Origem:** “vamos de lordicon ou pelo menos icones animados, nem que a gente produza nossos lotties”.
- **Decisão:** animação passa a ser requisito da linguagem de ícones da V2. Lordicon é a opção prioritária; Lotties autorais são aceitos para necessidades específicas. Phosphor atual permanece provisório.
- **Direção proposta:** sequências curtas que expliquem ações/serviços, integradas à revelação das camadas e à paleta preto/vermelho/branco; sem loop contínuo como padrão.
- **Interação:** hover, foco e toque; ação acessível sem aguardar animação, alternativa estática com movimento reduzido e em falha de carregamento.
- **Próximo recorte:** quatro amostras (contato, operação, dados e infraestrutura), seleção de assets/licenças, player e fonte editável dos autorais. Sem compra ou assinatura nesta etapa.
- **Estado:** decisão registrada no plano e no mediakit PT/EN; as animações ainda não foram implementadas.

## Como registrar novas contribuições

Adicionar um identificador com origem, intenção, estado e impacto. Quando houver correção, atualizar a especificação ativa e registrar aqui o que deixou de valer. Distinguir pedido do operador, proposta do agente, decisão e adiamento.

Se a ideia acrescentar assets, estado, dados ou interação, atualizar também o item de backlog e o roteiro de validação correspondente.
