# Arquitetura técnica proposta

## Decisões de base

Manter Vue 3, Vite, Less e Three.js. Adicionar somente os módulos D3 necessários quando começar o laboratório de dados. Manter JavaScript nesta evolução; não misturar migração geral de linguagem com a V2. Não introduzir backend, CMS, autenticação, ranking ou serviços externos para sustentar demonstrações locais.

Docker permanece disponível quando houver necessidade real de ambiente ou serviço. A V2 proposta pode ser servida como arquivos estáticos no destino atual. Publicação e configuração de hospedagem serão confirmadas antes do lançamento.

### Primeiro recorte e temas

O refinamento do hero está pausado para validar o mediakit em `/?view=mediakit` e `/en/?view=mediakit`. `MediakitPage.vue` é carregado por import dinâmico, com conteúdo PT/EN próprio. `components/design/DotLink.vue` e `RevealButton.vue` concentram os novos controles; `styles/mediakit.less` mantém os tokens candidatos isolados do hero anterior. `data-view="mediakit"` aplica fundo e metadados neutros desde o bootstrap, preservando a preferência manual de tema. A página de estudo recebe `noindex, nofollow` pelo bootstrap e pela atualização de SEO; não entra no sitemap.

Poppins é servida localmente pelo pacote Fontsource, em WOFF2 Latin nos pesos 400, 500, 600 e 700; substitui a Manrope anterior. Offside permanece na marca e nos detalhes curtos. Phosphor é importado por componentes, sem registro global. Licenças são incluídas em `public/licenses/`. Streamline e Lordicon aparecem apenas como links de referência. A releitura de camadas do botão Uiverse foi escrita localmente; nenhuma implementação do exemplo foi copiada. O estudo usa CSS, sem WebGL, timers ou player de animação.

O hero inicial usa HTML/SVG e transformações CSS 3D para revisar composição e linguagem visual antes do runtime Three completo. A entrada atual não monta `SceneBackdrop` nem pré-carrega a máscara. Os arquivos da V1 permanecem no repositório para migração posterior. Conteúdo editorial existente foi reaproveitado abaixo do hero para manter navegação funcional; as novas demos continuam planejadas.

O tema é um atributo `data-theme` no elemento raiz, com tokens CSS e dois valores: `light` e `dark`. Claro é sempre o padrão sem preferência válida salva. A chave `borderline-theme` armazena apenas escolha explícita; falha do armazenamento mantém a troca em memória. Um bootstrap pequeno no head aplica a preferência antes da primeira pintura, e `src/theme.mjs` gerencia as alterações da UI. Não consultar `prefers-color-scheme` nem oferecer modo automático. `prefers-reduced-motion` continua independente do tema.

`data-tone="dark"` permite uma seção editorial escura em ambos os temas. Troca de idioma preserva tema, âncora e estado da interação. Metadados de cor são controlados pelo tema, não pelo módulo de SEO. Favicons deixam de usar media queries de cor; o manifesto tem claro como cor inicial.

| Decisão | Motivo | Limite/contrapartida |
| --- | --- | --- |
| Home com capítulos e expansão inline | Permite narrativa e exploração sem multiplicar páginas vazias | Cada capítulo precisa controlar altura e histórico de navegação |
| Vue controla conteúdo e estado | UI, idioma e controles permanecem consistentes | Nenhuma geometria Three em reatividade profunda |
| Three controla renderização 3D | Reaproveita a linguagem e o conhecimento da V1 | Recursos precisam de ciclo de vida explícito |
| D3 calcula escalas, caminhos e layouts | Permite gráficos específicos e coordenados | Evitar Vue e D3 alterando os mesmos nós DOM |
| Lógica de demos em módulos puros | Testa regras sem navegador e separa apresentação | Adapters traduzem eventos da UI para comandos |
| Dados e integrações locais | Demos reproduzíveis e disponíveis sem credenciais | Identificar claramente que são simulações |
| Implementação incremental em branch `v2` | Mantém a V1 publicável durante a construção | Integração final exige revisão conjunta |

O uso de imports dinâmicos segue a orientação de [divisão de código do Vue](https://vuejs.org/guide/best-practices/performance.html). As regras específicas de carregamento abaixo são decisões deste projeto.

## Estrutura sugerida

Criar diretórios à medida que houver código real, sem gerar arquivos vazios antecipadamente:

```text
src/
  app/                 # composição, navegação e contexto de interesse
  components/
    ui/                # botões, grupos de seleção, status e disclosure
    sections/          # estrutura editorial de cada capítulo
  content/
    pt/                # textos por domínio
    en/
  demos/
    signature/         # modelo derivado, estilos, fixtures e apresentação
    websites/
    product/
    game/              # regras, loop, entradas e apresentação
    data/              # dataset, seletores, gráficos e filtros
    systems/           # máquina de estados e adaptadores locais
    infrastructure/    # planta, grafo, cenários e representação
  rendering/           # runtime Three compartilhado e loaders
  composables/         # visibilidade, movimento, locale, atividade
  i18n/                # API compatível com siteContent.mjs durante migração
  styles/              # tokens, estrutura global e utilitários
public/
  demos/               # assets e alternativas leves, com origem documentada
scripts/               # build localizado e verificações sem navegador
tests/                 # regras significativas das demos
docs/v2/               # plano, decisões e evidências de entregas
```

Renomear `Service01…04` para nomes de capacidade quando forem substituídos, em commits pequenos. Manter `siteContent.mjs` como fachada até concluir a migração de seus consumidores e do build de SEO.

## Contrato das experiências

Cada demo expõe conteúdo semântico e um modelo serializável. O controlador recebe comandos e produz estado; a renderização apenas representa esse estado.

```text
DemoDefinition
  id, contentKey, capabilities
  loadController()          # import dinâmico
  loadPresentation()        # Vue/SVG/Canvas/Three, conforme a demo
  fallback                 # conteúdo equivalente, não só spinner

DemoController
  getState()
  dispatch(command)
  subscribe(listener) -> unsubscribe
  reset()
  pause(reason)
  resume()                 # quando pertinente; jogos exigem ação explícita
  dispose()

SceneAdapter
  mount(runtime, host)
  resize(viewport)
  setState(state)
  activate()
  deactivate()
  update(delta)
  dispose()
```

Esse contrato é conceitual; evitar criar uma biblioteca genérica maior que o necessário. Controllers simples podem ser funções/composables. Assinatura e dados não precisam de um loop permanente para atualizar estado.

## Carregamento, canvas e atividade

1. Renderizar primeiro texto, navegação, layout reservado e alternativas leves.
2. Importar a primeira cena após o shell estar disponível; não impor duração mínima ao loader.
3. Pré-carregar o módulo da seção próxima, sem montar todas as cenas ou baixar todos os assets. S01 e S02 compartilham a narrativa de abertura, mas os controles e recursos da assinatura só são ativados na sua etapa; acesso direto por hash continua independente.
4. Ativar a experiência visível/principal; intenção explícita do visitante prevalece sobre um cruzamento pequeno de viewport.
5. Ao sair da área ou ocultar a página, pausar loops, simulações, timers e áudio. Pausa de jogo não retoma automaticamente.
6. Liberar recursos pesados de experiências distantes; manter apenas o pequeno estado necessário para voltar.

**Decisão inicial:** um renderer WebGL persistente e uma cena ativa por vez. Seu canvas ocupa um host reservado na experiência ativa; o runtime pode mover esse canvas entre hosts. A experiência anterior volta à representação leve. Na primeira versão, não há transição que exija duas cenas pesadas ativas simultaneamente.

A movimentação do canvas e a integração do HTML da assinatura são os riscos técnicos do primeiro corte. Implementar uma prova pequena em V2-02 e encaminhar ao operador. Se o custo de compartilhar o renderer prejudicar foco ou layout, registrar a alternativa antes de adotar renderer por demo; não abrir vários contextos implicitamente.

`SceneBackdrop` da V1 é referência de recursos e ambiente, não o container obrigatório de todas as interações. O HTML de cada capítulo permanece no fluxo normal. Eventos de pointer são calculados em relação à área da demo ativa, e não à janela inteira.

Geometrias, materiais, texturas, listeners e timers têm dono explícito. Recursos compartilhados são liberados pelo runtime; exclusivos, pelo adapter. A documentação do [Three.js sobre descarte de recursos](https://threejs.org/manual/pages/cleanup.html) orienta esse cuidado. Verificar APIs contra a versão instalada no lockfile antes de implementar.

## Assinatura: modelo e regras

Uma única função pura deriva apresentação de seleções. Modelo de entrada:

```text
selectedServices: Set<web | three | games | data | systems | infra>
styleId: modern | casual | editorial
paletteId: identificador permitido pelo estilo
fixtureId: identidade fictícia válida
locale: pt | en
```

Saída: `roleKey`, `layoutId`, `fontTokens`, `colorTokens`, `modules`, nome, agência e e-mail ilustrativos. Nome e e-mail não são campos editáveis. A fixture corresponde ao exemplo de agência do estilo; a escolha de serviços altera função e conteúdo, sem gerar dados pessoais aleatórios.

Precedência proposta para o cargo, aplicada de cima para baixo:

| Condição | Papel PT / EN |
| --- | --- |
| Nenhum serviço | Parceiro técnico / Technical partner |
| Apenas `web` | Desenvolvedor Web / Web Developer |
| Apenas `three` | Desenvolvedor de experiências 3D / 3D Experience Developer |
| Apenas `games` | Desenvolvedor de jogos / Game Developer |
| Apenas `data` | Desenvolvedor de visualizações de dados / Data Visualization Developer |
| Apenas `systems` | Desenvolvedor de sistemas / Software Developer |
| Apenas `infra` | Especialista em infraestrutura / Infrastructure Specialist |
| Dois ou mais, todos em `three`, `games`, `data` | Creative Developer / Creative Developer |
| Exatamente `web` + `systems` | Desenvolvedor Full Stack / Full Stack Developer |
| Qualquer outra combinação | Parceiro técnico da agência / Agency Technical Partner |

Rótulos são propostas de apresentação e precisam refletir a atuação real validada pelo operador. As 64 combinações possíveis devem resultar em um papel definido; não gerar uma cadeia interminável de cargos.

Módulos da assinatura:

| Seleção | Conteúdo derivado |
| --- | --- |
| Web | Linha de websites/campanhas e link demonstrativo de projetos |
| 3D ou jogos | Faixa visual de experiências; um módulo comum evita duplicação |
| Dados | Pequena visualização ilustrativa com descrição acessível |
| Sistemas | Linha de aplicações e integrações |
| Infraestrutura | Linha de redes, cloud e continuidade; sem falso status “online” |

Exibir até três módulos visuais com resumo dos demais serviços, sem esconder o conjunto selecionado nos controles. A função de derivação define a ordem estável. Selecionar/remover rapidamente não muda arbitrariamente a prioridade.

Manter conteúdo HTML como fonte da assinatura e representação frontal. A cena pode usar uma textura derivada de primitives para o movimento, mas a fase final precisa concordar com o mesmo modelo. Não depender de screenshots de navegador para gerar assets. A demo é uma visualização de identidade; compatibilidade com Gmail/Outlook e exportação HTML de e-mail ficam fora do escopo.

## Dados com D3

Dataset proposto: 30 dias × 4 canais × 3 dispositivos × 3 resultados = 1.080 registros agregados, com contagens inteiras não negativas. Gerador com seed fixa e padrões intencionais permite explicar tendências sem depender de números aleatórios a cada render.

Formato: `date`, `channel`, `device`, `outcome`, `count`. Um registro pertence a um único resultado. Totais de visitas são a soma de contagens; conversões são a soma do resultado convertido. Sem custo ou receita nesta primeira demo, evitando métricas financeiras sem modelo coerente.

Um seletor puro recebe dataset e filtros e devolve KPIs, série temporal, links do Sankey, matriz e tabela. Filtros são a fonte única; o chart não mantém uma cópia independente da seleção. Nós/categorias têm IDs estáveis e traduções separadas.

D3 fornece escalas, formas e layout; Vue renderiza a estrutura SVG. Para gestos de [seleção de intervalo](https://d3js.org/d3-brush) e [zoom](https://d3js.org/d3-zoom), reservar grupos DOM próprios administrados por D3 e emitir eventos de domínio para Vue. Não permitir que os dois sistemas controlem os mesmos elementos.

Adicionar módulos de array, scale, shape, selection, brush, zoom e `d3-sankey` conforme uso efetivo, com versão resolvida no lockfile. D3 não substitui o modelo de dados nem obriga adicionar uma biblioteca genérica de dashboards. Resize preserva seleção; zero resultados gera estado vazio, não exceção de layout.

## Jogo

Lógica separada do renderer: estado, geração com seed, movimentação lateral, colisão, coleta, combo, relógio e resultado. Passo de simulação fixo com acumulador e limite de recuperação evita depender da taxa de quadros. Ao pausar, zerar o acumulador; ao retomar, não contabilizar tempo fora da partida.

Usar instâncias/reciclagem para obstáculos e itens. Colisão simplificada em coordenadas da pista é suficiente; não incluir engine física sem necessidade demonstrada. Pontuação atualiza a UI com frequência controlada, sem colocar o grafo 3D em estado reativo.

Recorde, se mantido, será somente local e opcional. Ausência de armazenamento não impede jogar. Modos de ação e passos têm resultados separados. Áudio fica fora do primeiro corte; se adicionado, inicia desligado e exige ação do visitante.

## Sistemas e infraestrutura

**Sistemas:** máquina de estados determinística com adapters locais de CRM/notificação. Comando de envio cria ID de operação estável; retry reutiliza esse ID. Registro de eventos tem limite e origem explícita. Nenhuma chamada externa é necessária.

**Infraestrutura:** separar `floorplan` (ambientes e posições), `topology` (nós e ligações), `services` (dependências) e `scenario` (falhas). A representação Three e a planta SVG consomem o mesmo estado derivado. Um algoritmo de alcance por arestas ativas determina conectividade; o painel textual usa o mesmo resultado da animação de pacotes.

Backup e restauração são estados próprios. Redundância só funciona onde existir caminho alternativo. Não apresentar tempos ilustrativos como promessa de disponibilidade de produção.

## PT/EN e SEO

Separar IDs técnicos de labels e usar `Intl` para datas e números. Títulos, instruções, tooltips, mensagens, fallback, papéis da assinatura e resumos de contato têm as mesmas chaves nos dois idiomas. Troca de idioma preserva escolhas e pausa/jogo; não recria geometria só para traduzir texto.

Manter canonical, alternates, imagens sociais e HTTPS atuais. Atualizar catálogo de serviços e metadados para seis capacidades. O script localizado deve continuar emitindo `/en/index.html` com assets corretos. O build atual localiza metadados, mas não pré-renderiza o conteúdo principal; não afirmar que isso já existe.

Planejar HTML estático do conteúdo editorial PT/EN na etapa de SEO. Primeiro isolar dependências de `window` e renderização. Escolher geração estática/pré-renderização sem navegador ou um fallback editorial gerado do mesmo conteúdo, sem duplicação manual. Não usar crawler ou navegador headless pelo agente. A solução final será registrada antes dessa tarefa.

## Metas técnicas e alternativas

Metas de engenharia propostas, ainda não medidas e sujeitas a ajuste no primeiro corte:

| Área | Meta inicial |
| --- | --- |
| Shell inicial | Até 250 KiB gzip de JS + CSS, sem os módulos de demos pesadas |
| Assets de cada demo | Até 2 MiB de transferência adicional no primeiro corte |
| Renderização | Alvo de 60 fps em desktop de referência e 30 fps em mobile de referência |
| Atividade | Uma cena WebGL ativa; zero loops de simulação em aba oculta |
| DPR | Limite explícito de até 1,5 inicialmente; ajustar por perfil e validação |
| Dados | 1.080 registros; agregação pequena e determinística antes de considerar worker |
| Layout | Espaço reservado para a demo e controles, sem salto quando carrega |

O operador define os dispositivos de referência e mede desempenho no navegador. O agente inspeciona tamanho do build e lógica. Nenhuma dessas metas é um resultado obtido.

Perfis: completo, reduzido e estático. Reduzido diminui DPR, efeitos e densidade; estático mantém conteúdo, controles possíveis e alternativas DOM/SVG. `prefers-reduced-motion` remove entradas cinematográficas e movimento contínuo. Perda de contexto WebGL pausa a demo e apresenta recuperação ou alternativa, sem bloquear a página.

## Assets e dependências

| Asset | Origem proposta | Condição de uso |
| --- | --- | --- |
| Entrega e camadas do hero | Interface fictícia e geometria autorais | Ilustração leve, sem montar as outras demos; equivalência HTML/SVG |
| Máscara da V1 | Asset existente, fora da proposta principal do novo hero | Retirada definitiva em avaliação; remover dependências apenas na implementação aprovada |
| Assinaturas e marcas fictícias | SVG/CSS autorais | Domínios `.example`, identificação de demo |
| Fontes de estilo | Conjunto pequeno, licença adequada | Documentar origem e carregar sob demanda |
| Luminária | Geometria autoral | Evitar catálogo de produto real sem autorização |
| Pista e escritório | Geometrias reutilizáveis autorais | Budget visual por dispositivo |
| Dados | Gerador determinístico local | Rotular como simulação |
| Alternativas | HTML/SVG e posters autorais | Comunicar a mesma capacidade sem WebGL |

Não instalar bibliotecas de animação, engine de jogo, roteador completo ou store global por antecipação. Decidir a partir de um requisito que a stack atual não resolva bem.

## Migração da V1

Preservar `main` durante a implementação. Primeiro extrair tokens e navegação; depois introduzir o contrato das demos e substituir capítulos um a um. Componentes da V1 podem servir de conteúdo intermediário na branch de integração, identificados como pendentes no backlog.

Remover cenas e preloads antigos somente quando não houver consumidores. Tratar links e locale antes de retirar a antiga composição. Cada entrega deve ser reversível por commit, sem depender de apagar a V1 manualmente em produção.
