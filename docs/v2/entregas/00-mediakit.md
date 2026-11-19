# V2-00A — mediakit para validar a linguagem visual

Branch: `feat/v2-00-mediakit`, derivada de `feat/v2-01-hero` em `fedf803`.

**Estado: mediakit aprovado pelo operador, incluindo a tipografia.** O operador aprovou os botões e definiu círculos expansíveis para ações, camadas para serviços e seções de identidade. Após avaliar Offside nos títulos, escolheu Poppins para títulos e textos, reservando Offside à marca, botões e chapéus curtos. Os links mantêm ponto à direita, expansão à esquerda e padding equilibrado. A aplicação à home está na [entrega seguinte](01-home-mediakit.md). O agente não testa em navegador.

## Abrir o estudo

Executar `pnpm dev` e acrescentar ao endereço local do Vite:

- Português: `/?view=mediakit`.
- Inglês: `/en/?view=mediakit`.
- Referência direta de botões: `/?view=mediakit#kit-buttons`.
- Home com mediakit aplicado: `/` ou `/en/`, também disponível pelo rodapé do mediakit.

Não é uma nova home publicada. O estudo não entra no sitemap e aplica `noindex, nofollow` no bootstrap e no SEO em execução.

## O que avaliar

1. **Cor:** branco `#ffffff`, preto `#111111`, vermelho original `#e50914` e cinzas. `#d00b15` é o fundo de ação para texto branco; links vermelhos têm variantes legíveis em fundo claro e escuro.
2. **Tipografia:** Poppins nos títulos/subtítulos em peso 600 e nos textos em peso regular; Offside regular na marca, botões, links expansíveis e chapéus curtos. Escala responsiva preservada.
3. **Links:** ponto vermelho à direita em repouso; cresce para a esquerda até envolver o texto em hover/foco, com padding horizontal simétrico de 20px. Uma amostra fica aberta para comparação, com destinos reais dentro da página.
4. **Botão circular:** ícone em repouso; expansão lateral com rótulo. Variações principal, neutra, contorno e desabilitada.
5. **Botão em camadas:** frente neutra e fundo vermelho que se desloca/gira ao revelar. Releitura da referência enviada no Uiverse; comparável com o botão circular.
6. **White label:** peça maior mostra a marca da agência à frente e a operação por trás. Clique fixa/recolhe o estado; hover/foco permitem inspecionar.
7. **Ícones:** direção animada definida, com Lordicon prioritário e Lotties autorais para conceitos específicos. As seis amostras de Phosphor continuam estáticas e provisórias; o conteúdo identifica explicitamente que as animações ainda não estão integradas.
8. **Composição:** os elementos juntos em branco e preto. É uma aplicação de linguagem, não uma nova proposta de hero.

## Comportamentos implementados

- Claro padrão; preferência manual persistida, independente do navegador/OS.
- PT/EN preservam tema, âncora, variante dos ícones e estado das amostras.
- Botões usam nome acessível mesmo com texto recolhido. Foco por teclado revela o mesmo conteúdo.
- Em toque ou ponteiro sem hover, o texto dos botões fica visível. O primeiro toque executa a ação local, sem exigir descobrir um hover.
- Movimento reduzido remove transições; os estados continuam disponíveis.
- Checkbox mantém rótulos/camadas abertos para comparação. Recomeçar limpa a confirmação, restaura o duotone e recolhe os estados fixados.
- Ações dos botões são demonstrações locais, identificadas na interface, com confirmação e contagem. Não enviam mensagens nem fingem iniciar contato externo.
- Links internos têm destinos; links das referências abrem as fontes oficiais em nova aba.

## Implementação e origem

- `src/components/MediakitPage.vue`: página de estudo carregada sob demanda.
- `src/components/design/DotLink.vue` e `RevealButton.vue`: componentes compartilhados com a home.
- `src/styles/mediakit.less`: composição do estudo; fontes e tokens compartilhados em `fonts.less` e `design-tokens.less` após aprovação.
- `src/i18n/mediakitContent.mjs`: conteúdo completo PT/EN.
- Poppins: `@fontsource/poppins`, WOFF2 Latin nos pesos 400, 500, 600 e 700 servido localmente; [licença OFL](../../../public/licenses/poppins-OFL.txt). Pacote e licença de Manrope removidos após a substituição.
- Phosphor: `@phosphor-icons/vue`, imports individuais, sem registro global; [licença MIT](../../../public/licenses/phosphor-MIT.txt).
- A fonte Offside existente da marca continua carregada pelo Google Fonts; fallback tipográfico permanece disponível.
- [Referência de botão, vinodjangid07 / Uiverse](https://uiverse.io/vinodjangid07/great-ape-33). A animação candidata foi escrita localmente a partir da ideia descrita pelo operador. Não foi copiado HTML/CSS da referência nem comprovada equivalência visual ao exemplo.
- [Phosphor Vue](https://github.com/phosphor-icons/vue) é provisório; [animação Lordicon](https://lordicon.com/docs/animation) é a direção prioritária, complementada por Lotties autorais. Seleção de assets/licenças e integração do player serão feitas no próximo recorte.

## Verificações sem navegador

- `pnpm build`: gera os dois HTMLs localizados, chunk separado do mediakit e fonte local.
- Conferência de paridade estrutural PT/EN, destinos locais e presença dos arquivos de licença.
- Verificação em Node do bootstrap e da troca de tema com preferência ausente, inválida, válida e armazenamento bloqueado, tanto no hero quanto no mediakit.
- Cálculo de contraste das combinações de texto e fundo usadas nos controles.
- `git diff --check` para integridade do diff.

Nenhum navegador foi aberto. Build, cálculo de contraste e verificações de lógica não validam layout, leitura real, foco ou movimento.

## Roteiro do operador

1. Abrir PT e EN, alternar os dois temas, recarregar e conferir a preferência manual.
2. Comparar paleta, hierarquia dos títulos, pesos e Offside da marca.
3. Passar o mouse e usar Tab nos links: conferir ponto, expansão, foco e leitura em ambos os fundos.
4. Comparar as duas famílias de botões, seus estados fixados e a confirmação local. Conferir se o espaço ao redor acomoda a expansão.
5. Usar a peça white label com mouse, Enter/Espaço e toque; avaliar se o movimento comunica agência/frente e operação/bastidores.
6. Em mobile, conferir rótulos visíveis, nenhum corte ou scroll horizontal e ações no primeiro toque.
7. Alternar os três tratamentos das amostras provisórias para avaliar contraste; no próximo recorte, validar Lordicon/Lotties autorais com movimento, temas e alternativa estática.
8. Ativar movimento reduzido; conferir que a informação e os controles continuam disponíveis.
9. Abrir a âncora direta de botões, trocar idioma e usar voltar/avançar; conferir posição e URL.
10. Retornar à home pelo rodapé para conferir a aplicação da linguagem aprovada.
