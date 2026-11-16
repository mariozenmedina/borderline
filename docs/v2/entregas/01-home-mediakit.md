# V2-01 — home com mediakit e operação em camadas

Branch: `feat/v2-01-home`, derivada de `feat/v2-00-mediakit` em `3bed5ba`.

**Estado: implementado, aguardando validação visual do operador.** O mediakit foi aprovado explicitamente e o operador autorizou sua aplicação à home. Este recorte substitui o primeiro hero rejeitado; não encerra todas as seções da V2.

## Comportamento

- Chapéu em Offside, título e texto em Poppins. Preto, vermelho, branco e cinzas nos temas claro e escuro.
- Dois botões circulares expansíveis do mediakit: serviços e contato, com destinos reais na página. Menu reutiliza links com ponto à direita e expansão à esquerda.
- Card da agência à frente. Slider abre gradualmente seis cards: desenvolvimento, infraestrutura, games, dados, experiências 3D e integrações.
- Abertura completa dispõe os serviços em duas colunas e três linhas, mantendo a agência visível em primeiro plano. O fechamento recompõe a pilha.
- Controle nativo por arraste e teclado, atalhos para fechar/abrir tudo e texto equivalente para tecnologias assistivas. Sem autoplay ou rolagem controlada.
- Tema claro inicial, preferência manual persistida e PT/EN. Troca de tema e idioma preserva a abertura durante a visita.
- Ícones com microanimações autorais em SVG/CSS, disparadas pela abertura, hover ou foco. Movimento reduzido desativa essas animações. Fonte editável em `MotionIcon.vue`; não há integração Lordicon/Lottie neste recorte.

Fontes e tokens foram compartilhados entre home e mediakit. A composição usa HTML/SVG e perspectiva CSS, sem WebGL ou dependências adicionais. Conteúdo das seções abaixo recebe a base visual global; as demos detalhadas e a assinatura ainda não foram implementadas.

## Verificações sem navegador

- `pnpm build`: aprovado; gera português e inglês com fontes locais.
- `node tests/operation-layout.test.mjs`: cinco testes aprovados. Cobrem normalização, todas as 101 posições, ausência de sobreposição na abertura completa, interpolação/reversibilidade e paridade PT/EN.
- `git diff --check`: aprovado.
- Dez cenários de bootstrap/tema verificados em Node, incluindo preferência ausente, inválida e armazenamento bloqueado; referências a assets e fontes conferidas nos dois HTMLs gerados.
- Nenhum navegador aberto. Testes de geometria verificam os dados do layout; não substituem a revisão de legibilidade, recortes e aparência pelo operador.

## Roteiro do operador

Executar `pnpm dev`; abrir `/` e `/en/` no endereço informado pelo Vite. O mediakit continua em `/?view=mediakit` e `/en/?view=mediakit`.

1. Conferir menu, chapéu, título, texto e os dois botões contra o mediakit aprovado.
2. Arrastar o slider lentamente em ambos os sentidos; conferir a relação agência/operação e a leitura dos seis serviços em 100%.
3. Usar atalhos de fechar/abrir e teclado no slider (setas, Home e End). Conferir foco e navegação aos serviços/contato.
4. Trocar PT/EN e tema com a composição parcialmente aberta; conferir preservação da posição, textos e contraste.
5. Revisar desktop, tablet e celular, incluindo 320/360/390px, sem cortes nos cards e sem rolagem horizontal. No toque, conferir rótulos visíveis nos botões.
6. Conferir preferência de movimento reduzido, sem animação dos ícones; o slider deve continuar funcional.
7. Conferir menu móvel, navegação por hash, voltar/avançar e retorno entre home e mediakit.

Sem push, merge em `v2` ou publicação nesta entrega.
