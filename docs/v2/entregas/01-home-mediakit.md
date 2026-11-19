# V2-01 — home com mediakit e operação em camadas

Branch: `feat/v2-01-home`, derivada de `feat/v2-00-mediakit` em `3bed5ba`.

**Estado: implementado, aguardando validação visual do operador.** O mediakit foi aprovado explicitamente e o operador autorizou sua aplicação à home. Este recorte substitui o primeiro hero rejeitado; não encerra todas as seções da V2.

## Comportamento

- Chapéu em Offside, título e texto em Poppins. Preto, vermelho, branco e cinzas nos temas claro e escuro.
- Dois botões circulares expansíveis do mediakit: serviços e contato, com destinos reais na página. Menu reutiliza links com ponto à direita e expansão à esquerda.
- Card da agência à frente. Hover abre seis cards: desenvolvimento, infraestrutura, games, dados, experiências 3D e integrações. O agrupamento tem contornos cinza e vermelho, interrompidos pela marca `borderline.` maior no canto inferior direito. Ao sair com o mouse, a pilha se recompõe.
- Abertura completa dispõe os serviços em duas colunas e três linhas, mantendo a agência visível em primeiro plano. O fechamento recompõe a pilha.
- Em telas até 900px ou dispositivos com toque/sem hover, a figura começa compacta, com a pilha no topo e 48% da altura final. Durante o scroll ela cresce para abrir os cards, ficando sticky a 68px. O percurso adicional de 120svh é independente dessa altura variável: mantém a abertura nos primeiros 64svh e reserva os 56svh seguintes para leitura com os cards totalmente abertos. Subir recompõe a pilha. Não intercepta o scroll nem antecipa uma margem acima do card fechado.
- Foco por teclado também abre a composição; texto equivalente permanece para tecnologias assistivas. Com movimento reduzido ou altura inferior a 600px no modo de scroll, a operação aparece aberta, sem sticky nem espaço adicional.
- Tema claro inicial, preferência manual persistida e PT/EN. A abertura deriva do hover/foco ou da posição atual de scroll, recalculada ao trocar idioma ou tamanho de tela.
- Removidos slider, porcentagem, instruções, legendas ao redor da composição e faixa inferior de informações. Preservados chapéu, título, texto principal, dois botões e textos internos dos cards.
- Ícones com microanimações autorais em SVG/CSS, disparadas pela abertura, hover ou foco. Movimento reduzido desativa essas animações. Fonte editável em `MotionIcon.vue`; não há integração Lordicon/Lottie neste recorte.

Fontes e tokens foram compartilhados entre home e mediakit. Os cards usam HTML/SVG e perspectiva CSS. O fundo usa Three.js já presente no projeto, carregado separadamente, com SVG estático equivalente. Conteúdo das seções abaixo recebe a base visual global; as demos detalhadas e a assinatura ainda não foram implementadas.

## Verificações sem navegador

- `pnpm build`: aprovado; gera português e inglês com fontes locais.
- `node tests/operation-layout.test.mjs`: dez testes aprovados. Cobrem normalização, todas as 101 posições, ausência de sobreposição na abertura completa, interpolação/reversibilidade, paridade PT/EN, progresso do scroll e crescimento da cena mobile sem margem superior antecipada.
- `node tests/site-identity.test.mjs`: dois testes aprovados para marca, conteúdo institucional e ausência de vínculo pessoal nos metadados PT/EN.
- `node tests/circuit-layout.test.mjs`: cinco testes aprovados para conexão dos seis serviços, trechos ortogonais/45 graus, percurso dos pulsos, ativação reversível e projeção da alternativa estática.
- `git diff --check`: aprovado.
- Dez cenários de bootstrap/tema verificados em Node, incluindo preferência ausente, inválida e armazenamento bloqueado; referências a assets e fontes conferidas nos dois HTMLs gerados.
- Nenhum navegador aberto. Testes de geometria verificam os dados do layout; não substituem a revisão de legibilidade, recortes e aparência pelo operador.

## Roteiro do operador

Executar `pnpm dev`; abrir `/` e `/en/` no endereço informado pelo Vite. O mediakit continua em `/?view=mediakit` e `/en/?view=mediakit`.

1. Conferir menu, chapéu, título, texto e os dois botões contra o mediakit aprovado.
2. Entrar e sair com o mouse pela área dos cards, inclusive rapidamente; conferir abertura, recolhimento e leitura dos seis serviços. Usar Tab para conferir abertura por foco.
3. No celular, rolar nos dois sentidos: a cena deve fixar abaixo do menu, revelar gradualmente a operação e liberar a página após um breve trecho totalmente aberto.
4. Trocar PT/EN e tema durante o percurso; conferir atualização do progresso, textos e contraste. Girar o dispositivo e conferir o modo sem sticky em altura inferior a 600px.
5. Revisar desktop, tablet e celular, incluindo 320/360/390px, sem cortes nos cards e sem rolagem horizontal. No toque, conferir rótulos visíveis nos botões.
6. Conferir preferência de movimento reduzido: operação aberta, sem animação dos ícones ou percurso adicional de scroll.
7. Conferir menu móvel, navegação por hash, voltar/avançar e retorno entre home e mediakit.
8. Rolar além de 160px: a barra deve reduzir para 52px e a marca virar “b.”, com o ponto vermelho. Voltar até 80px do topo restaura o menu completo. Conferir links, idiomas, tema, contato e abertura do menu móvel no estado compacto, incluindo chegada direta por hash.
9. Conferir `borderline.dev.br`, sufixo menor e pontos vermelhos; marca agrupando serviços; alinhamento de chapéu/título/texto; mobile fechado junto ao topo e crescimento da figura durante a abertura.
10. Conferir o fundo de circuitos em claro/escuro: perspectiva, relevo, detalhe, contraste do texto e integração com os cards. Mover o mouse, sair do hero e abrir/fechar os cards para avaliar câmera, pulsos e ativação das conexões.
11. No mobile, conferir movimento discreto durante a abertura, leitura e rolagem livres. Validar alternativa SVG com movimento reduzido e sem WebGL; trocar a preferência durante a visita. Verificar pausa fora da tela/aba oculta e retomada, além de retorno ao SVG após perda do contexto.

Entrega enviada à branch remota e acompanhada no PR #16, ainda sem merge em `v2` ou publicação.

Revisão de 18/11/2026: hover/scroll e retirada dos textos periféricos substituem o slider da primeira versão (`cabf1ad`), por pedido do operador. Validação de build e lógica refeita; nenhuma validação em navegador pelo agente.

Revisão adicional de 18/11/2026: menu compacto após scroll, com altura de 52px e marca “b.”. Limites de 160px para recolher e 80px para expandir evitam alternância perto do ponto de mudança. Mantém navegação, preferência de movimento reduzido e nome acessível completo da marca. Listener passivo de scroll, sincronização na montagem/retorno à página e remoção dos listeners ao desmontar.

Revisão de 19/11/2026: marca completa com sufixo menor; agrupamento dos serviços identificado; comunicação institucional sem vincular interlocução ao proprietário; chapéu e conteúdo na mesma coluna, sem correção óptica por deslocamento; figura mobile compacta que cresce durante o scroll. Detalhes na I-019.

Contato institucional pendente de informação do operador: o link para LinkedIn pessoal foi retirado, inclusive dos metadados. A seção continua acessível pelas âncoras da home; seu link externo só aparece quando `contact.href` tem um destino confirmado. Nenhum e-mail, telefone ou perfil de empresa foi inventado. Pendência acompanhada em #13.

Revisão adicional de 19/11/2026: identificação do agrupamento substituída por `borderline.` maior, no canto inferior direito, com fundo interrompendo as bordas cinza e vermelha. Conferir a assinatura nos dois temas e nos cards totalmente abertos em desktop e mobile. Detalhes na I-020.

Revisão de leitura em 19/11/2026: acrescentados 40svh ao final do percurso sticky, mantendo a velocidade de abertura. A permanência totalmente aberta passa de 16svh para 56svh. Conferir tempo de leitura e liberação da próxima seção; movimento reduzido e telas baixas continuam sem percurso adicional.

Revisão do fundo em 19/11/2026: implementada a I-022 em `HeroCircuitBackdrop.vue`, `circuitLayout.mjs` e `createCircuitScene.mjs`. Cena própria da home com import dinâmico, instâncias, pausa e limpeza de recursos; não monta o runtime antigo nem carrega seus modelos. O chunk adicional de Three/cena mede aproximadamente 132 kB gzip no build desta entrega. Geometria e lógica verificadas em Node; renderização, sensação de movimento e desempenho real aguardam o operador.
