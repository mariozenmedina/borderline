# Seções e demonstrações

Especificação de experiência proposta. Nomes fictícios, temas, quantidades e transições são pontos de partida; o operador revisa direção de arte e comportamento. O escopo desta branch continua sendo planejamento.

## Regras comuns

Toda demo precisa de estado inicial legível, instrução curta, efeito verificável, reset, PT/EN, alternativa por teclado e tratamento de carregamento/erro. A versão móvel conserva a ideia central com uma composição própria. Não depender apenas de hover ou cor.

As cenas 3D não carregam juntas. Simulações e dados ficam identificados. O visitante nunca precisa interagir para acessar texto ou contato. Detalhes técnicos aparecem sob demanda; controles não recebem nomes internos de bibliotecas.

## S01 — Abertura: assinatura da marca

**Objetivo:** comunicar imediatamente desenvolvimento white label para agências e abrir uma experiência autoral.

**Composição:** manter a máscara triangular como protagonista, Offside na marca, fundo escuro e uma frase comercial legível. Um pequeno índice de capacidades sugere a profundidade seguinte. Evitar um hero ocupado só pelo logotipo e pelo carregamento.

**Interação:** pointer altera sutilmente a leitura da superfície; foco ou ativação de uma capacidade destaca um detalhe e oferece navegação direta. A máscara continua reconhecível. Controles e título não dependem dela.

**Momento de impacto:** ao revelar a marca, faces e arestas se organizam com precisão; o movimento inicial é curto e pode ser suprimido. Não exigir assistir a uma introdução.

**Mobile/alternativa:** enquadramento próprio, poster da máscara e ausência de parallax no modo de pouco movimento.

**Aceite:** o visitante identifica público, oferta e próximo passo antes de interagir; hero não espera recursos de outras demos; contato e navegação funcionam com falha do 3D.

## S02 — White label: assinatura que se adapta

**Origem:** ideias I-003 e I-004 do operador. Esta é a versão ativa: serviços e direções visuais orientam a transformação; não há campos para preencher nome, cargo ou e-mail.

**Objetivo:** tornar visível como Mário assume a interlocução e liderança técnica dentro da agência, enquanto a equipe própria de desenvolvimento e TI sustenta a entrega nos bastidores.

**Composição:** uma janela de e-mail em perspectiva, com mensagem fictícia curta e assinatura de Mário Medina. Ao lado, uma área compacta com a gama de serviços, direções “Moderna”, “Casual” e “Editorial” e paletas identificáveis. O estilo da demo muda; a navegação do site mantém a marca Borderline.Dev.

**Exemplos de direções, sujeitos a desenho:**

| Direção | Composição da assinatura | Tipografia e material | Paletas propostas |
| --- | --- | --- | --- |
| Moderna | Blocos alinhados, marca geométrica, divisores precisos | Sans de leitura, placa fosca e linhas finas | Grafite/vermelho; carvão/azul |
| Casual | Ritmo mais solto, avatar gráfico e cantos suaves | Sans humanista, papel e formas arredondadas | Creme/coral; areia/verde |
| Editorial | Hierarquia assimétrica, nome forte, contato em coluna | Serif de destaque com sans de apoio | Marfim/preto; ameixa/creme |

Os pares são direções cromáticas, não tokens finais; contraste e licenças das fontes serão verificados na implementação. Usar no máximo duas famílias adicionais ao conjunto da marca, carregadas somente nesta experiência.

**Interação principal:** selecionar um ou mais serviços — Websites, 3D, Jogos, Dados, Sistemas, Infraestrutura. A assinatura muda cargo e módulos conforme a combinação. Ao trocar direção ou paleta, a peça se recompõe: alinhamento, divisores, fonte, espaçamento e elementos gráficos mudam com continuidade visual.

**Exemplos concretos:**

- Websites: assinatura enxuta, papel “Desenvolvedor Web” e módulo de entregas digitais.
- Jogos + 3D: papel “Creative Developer” e módulo visual de experiências interativas.
- Websites + Sistemas: papel “Desenvolvedor Full Stack”, com módulo de aplicações e integrações.
- Infraestrutura: papel voltado à infraestrutura e módulo de redes, cloud e continuidade.
- Combinação entre famílias: “Parceiro técnico da agência”, com resumo dos serviços selecionados.

Os papéis acima descrevem a especialidade da configuração. Uma linha fixa, “Seu interlocutor técnico / Your technical point of contact”, deixa claro que a pessoa na assinatura coordena a entrega. Os títulos finais serão refinados para refletir essa liderança, sem sugerir que Mário executa sozinho todas as disciplinas.

As regras exatas têm fonte única na [arquitetura técnica](04-arquitetura-tecnica.md). O nome permanece fixo; marcas e domínios `.example` são fixtures fictícias. Não usar e-mails reais de terceiros.

**Momento de impacto:** a alteração dos serviços transforma a atuação visível; a alteração de estilo transforma a assinatura inteira. Elementos deslizam e reorganizam a peça enquanto a câmera faz um ajuste curto. Não substituir tudo por um simples fade entre imagens prontas.

**Segunda leitura proposta:** “Ver a operação por trás” afasta a câmera e revela frentes de desenvolvimento, sistemas/dados e TI conectadas à assinatura. As frentes destacadas seguem os serviços escolhidos. Representar funções e fluxo de entrega, sem fotos, nomes, organograma numérico ou contagem fictícia de profissionais. O detalhamento operacional continua na S09.

**Estados:** configuração inicial com Websites e direção Moderna; seleção vazia mostra o papel genérico e convite para explorar; múltiplos serviços têm regra determinística; mudanças rápidas cancelam a transição anterior sem desencontrar assinatura e controles; “Restaurar exemplo” volta ao início.

**3D e leitura:** o volume funciona como moldura da experiência. O conteúdo da assinatura é HTML semântico, com equivalente frontal legível. Texturas 3D podem ilustrar a transição, mas não são o único lugar onde nome, cargo e contatos aparecem.

**Mobile/alternativa:** assinatura frontal seguida dos controles; movimento curto ou troca direta com pouco movimento. Seleções por toque, teclado e leitor de tela. A peça pode ser inspecionada em perspectiva por gesto secundário, sem que arrastar seja obrigatório.

**Aplicação comercial:** um interlocutor integrado à agência, equipe própria coordenada nos bastidores e apresentação sob a marca contratante. A assinatura fictícia demonstra a relação white label; não afirma emprego real com organizações fictícias.

**Aceite:** todas as combinações de serviços geram assinatura coerente; direção altera layout e tipografia além da cor; nenhuma edição manual de identidade é necessária; texto continua legível durante e depois da troca; nenhum e-mail é enviado. Exportar assinatura para clientes de e-mail fica fora da primeira versão.

## S03 — Websites: campanha em funcionamento

**Objetivo:** provar atenção a design, responsividade, conteúdo e interação.

**Composição:** uma campanha fictícia “FRAME” ocupa um palco editorial com título grande, imagem/objeto e navegação funcional. Uma régua permite comparar larguras; um trilho secundário mostra estados de menu e conteúdo. O produto pode ser a luminária da S04 para reaproveitar assets, com marca explicitamente fictícia.

**Interação:** alternar desktop/tablet/mobile e uma variante de conteúdo longo. Layout, tipografia, grid e menu se recompõem de verdade; a navegação abre e fecha, abas trocam conteúdo e CTA apresenta o resultado local esperado. A demo não deve ser uma screenshot encolhida.

**Momento de impacto:** a campanha passa por diferentes composições com continuidade, expondo o cuidado no comportamento de títulos, mídia e navegação.

**Escopo:** uma campanha curta com hero, detalhes e CTA. Container queries ou regras equivalentes aplicam responsividade à área de demonstração. Rotular a mudança como largura de layout, sem alegar emulação de dispositivo.

**Mobile/alternativa:** escolher exemplos de composição sem forçar uma janela desktop ilegível. Mostrar a largura ampla como visão geral e permitir focar detalhes. Texto real e controles nativos funcionam sem 3D.

**Prova comercial:** landing page, campanha e site institucional. Detalhes opcionais explicam componente, conteúdo e acessibilidade.

**Aceite:** comportamento real em pelo menos três larguras; texto longo e EN não quebram controles; exemplos não alteram a navegação externa; reset e conteúdo alternativo funcionam.

## S04 — 3D: produto configurável

**Objetivo:** demonstrar experiências de produto controláveis pelo visitante.

**Composição:** luminária modular autoral sobre fundo escuro, com iluminação lateral e detalhes materiais. Pequena ficha de configuração e controles de acabamento, luz e vista explodida. Modelagem procedural inicial reduz dependência de asset externo.

**Interação:** girar com limites, escolher entre três acabamentos, alterar intensidade da luz e separar componentes. Ao selecionar base, haste ou cúpula, a câmera enquadra a parte e o texto explica uma característica fictícia do produto.

**Momento de impacto:** a vista explodida preserva as relações entre peças, depois recompõe o objeto na configuração escolhida. O acabamento altera resposta à luz; não apenas o valor RGB.

**Estados:** configuração inicial, detalhe selecionado, vista explodida, recomposição e reset. Configurações não alteram os serviços escolhidos na assinatura.

**Mobile/alternativa:** arrastar horizontalmente dentro da área ativa, controles grandes e botões de giro; no modo estático, vistas e ficha equivalentes. Sem modelo, apresentar ilustração vetorial/poster e controles explicativos honestamente identificados.

**Prova comercial:** configuradores, catálogos interativos e apresentações de lançamento. Não incluir checkout ou preços inventados.

**Aceite:** componentes voltam à posição correta após mudanças rápidas; configuração e ficha concordam; teclado permite inspecionar e alterar opções; luz não exige efeitos caros para funcionar.

## S05 — Jogos: Edge Run

**Objetivo:** entregar uma partida curta de verdade, associável a uma ativação de marca.

**Composição:** pista tridimensional geométrica com três faixas, obstáculos e itens de coleta. HUD enxuto com tempo, pontuação e progresso. Arte original nas cores da marca; sem personagens de terceiros.

**Mecânica proposta:** rodada de 30 segundos; trocar de faixa para coletar fragmentos e evitar obstáculos. Coleta soma pontos; colisão interrompe combo e reduz pontuação com piso zero. Uma sequência de coletas constrói um símbolo no fim do percurso. Duração e balanceamento serão ajustados pelo operador.

**Controles:** setas ou A/D com foco no jogo; botões esquerda/direita no mobile. Início explícito, pausa, retomar e reiniciar. Não capturar teclado do documento inteiro nem impedir saída com Tab.

**Momento de impacto:** o que foi coletado se recompõe no encerramento e apresenta o resultado da partida. O cenário reage a coleta e colisão de forma distinta.

**Estados:** pronto → instrução → jogando → pausado → resultado. Trocar aba, sair da área ou ativar outra demo pausa a partida; retorno exige retomar, sem salto de tempo ou colisão inesperada. Seed reproduzível para balanceamento e testes de lógica.

**Mobile/alternativa:** menor densidade geométrica, mesmos objetivos e tempo. Para quem evita movimento, modo de passos: avançar uma etapa e escolher uma faixa, sem cronômetro. Esse modo mantém escolhas e pontuação próprias, identificadas; nunca misturar recordes com a rodada de ação.

**Prova comercial:** gamificação e campanhas. Não criar ranking público, backend, prêmio ou coleta de dados nesta versão.

**Aceite:** colisões e pontos dependem da lógica da partida; replay reinicia estado e seed conforme regra; pausa congela simulação; física não acelera em monitores com mais quadros; controles não sequestram scroll ou navegação.

## S06 — Dados: laboratório de campanha

**Objetivo:** mostrar análise exploratória complexa e coerente com D3.

**Cenário:** desempenho de uma campanha fictícia em 30 dias, quatro canais, três dispositivos e três resultados mutuamente exclusivos: converteu, engajou sem converter, saiu. Dataset agregado e determinístico; todas as contagens são sintéticas.

**Composição:** área ampla com série temporal superior, Sankey de canal → dispositivo → resultado e matriz canal × dispositivo. Uma faixa resume visitas, conversões e taxa. Uma tabela de dados oferece leitura alternativa. Cada gráfico responde a uma pergunta diferente sobre a mesma seleção.

**Interações:**

1. Selecionar período na série temporal ou por campos/botões acessíveis.
2. Clicar em canal ou nó do Sankey para filtrar os demais gráficos.
3. Selecionar uma célula da matriz para cruzar canal e dispositivo.
4. Expandir o Sankey para inspecionar rótulos e fluxos; zoom/pan opcional, com botões equivalentes.
5. Inspecionar tooltip por hover, toque ou foco; limpar todos os filtros.

**Momento de impacto:** uma seleção temporal reorganiza fluxos, matriz e totais; a seleção seguinte revela um padrão em todas as visualizações, sem números decorativos independentes.

**Regras:** a mesma fonte alimenta todos os gráficos; totais respeitam filtros; taxa é conversões/visitas selecionadas, com estado próprio para denominador zero. Não somar taxas nem inventar atribuição causal de conversões. A seleção continua visível e removível mesmo se um gráfico ficar vazio.

**Mobile/alternativa:** um gráfico por vez em abas com filtros compartilhados; resumo sempre presente. Sankey simplifica rótulos e oferece detalhes textuais; tabela e presets de período evitam depender de arraste.

**Prova comercial:** dashboards, relatórios de campanha e narrativas de dados. Exportação CSV do recorte pode entrar no acabamento; não é requisito do primeiro corte.

**Aceite:** três visualizações coordenadas; filtros combinados e reset; vazio e seleção única tratados; números PT/EN; SVG e controles acessíveis; a interface explicita que os dados são simulados.

## S07 — Sistemas: da interação à operação

**Objetivo:** mostrar que uma interface desencadeia regras e integrações consistentes.

**Composição:** à esquerda, ficha de um lead fictício; no centro, percurso de eventos; à direita, estados do CRM e da notificação. Cartões representam objetos reconhecíveis, com horários e resultados da simulação.

**Interação:** “Enviar lead de exemplo” inicia validação, gravação simulada no CRM e notificação. “Simular falha no CRM” interrompe a cadeia. “Tentar novamente” recupera o passo sem duplicar o registro. Um controle de cenário demonstra dado inválido antes do envio.

**Momento de impacto:** uma ação na ficha se propaga até os destinos; a falha quebra o fluxo em um ponto explicável e a recuperação continua exatamente dali.

**Estados:** pronto, validando, inválido, enviando, erro recuperável, concluído. Registro de eventos limitado e reiniciável. Delays curtos e determinísticos apenas para tornar estados perceptíveis.

**Mobile/alternativa:** fluxo vertical, ações no topo e resumo do estado atual. Lista textual de eventos funciona sem animação.

**Prova comercial:** automações, portais e integrações. Tudo roda em adaptadores locais identificados como simulação; nenhum CRM, webhook ou e-mail real é acionado. Uma futura integração real terá escopo e infraestrutura próprios.

**Aceite:** repetição e retry não duplicam lead; dado inválido não avança; falha tem causa e recuperação; reset limpa dados e timers; navegação não deixa eventos sendo gerados em segundo plano.

## S08 — Infraestrutura: escritório conectado

**Objetivo:** substituir objetos abstratos por uma arquitetura operacional reconhecível.

**Composição:** planta isométrica de uma agência fictícia, com recepção, área de criação, reunião e sala técnica. Proposta inicial: dez estações, dois access points, impressora, NAS, rack, switch, firewall, link principal e link secundário. Ao lado da planta, serviços de cloud: aplicação, banco e backup. Quantidade final depende de legibilidade e custo visual.

**Camadas:** Física mostra ambientes e equipamentos; Rede destaca conexões e caminhos; Serviços mostra dependências entre estação, aplicação, banco e backup. Preservar contexto espacial ao alternar camadas.

**Interações:** selecionar equipamento, acompanhar o caminho de uma requisição, desativar o link principal, ativar redundância, observar um backup simulado e restaurar cenário. O painel explica função, dependências e estado do elemento selecionado.

**Momento de impacto:** o link principal cai, o trecho afetado é identificado e o tráfego usa o link secundário quando existe redundância. A mesma planta revela equipamentos, rede e serviços sem perder a sensação de lugar real.

**Regras concretas:** falha de WAN só permite desvio se houver caminho secundário ativo. Falha de switch desconecta estações dependentes; cloud não corrige uma LAN rompida. Backup é cópia/recuperação, não substitui alta disponibilidade. Métricas e tempos são valores ilustrativos claramente rotulados.

**Estados:** normal; WAN principal indisponível com/sem redundância; switch indisponível; backup em progresso/concluído. Primeiro corte limita-se a normal e falha de WAN; demais cenários completam o capítulo antes da entrega final.

**Mobile/alternativa:** visão superior, presets de enquadramento e lista de equipamentos. Tocar um item aproxima a área; evitar pinça como único controle. Modo sem WebGL usa planta SVG baseada no mesmo grafo e painel textual.

**Prova comercial:** redes corporativas, cloud, deploy, backup e continuidade. Não exibir logs, IPs ou informações reais de cliente; não realizar conexões de infraestrutura de verdade.

**Aceite:** cada equipamento é identificável; caminho depende do estado real do grafo; indisponibilidade se propaga de forma consistente; reset restaura cenário; alternativa SVG explica os mesmos resultados.

## S09 — Parceria: entregas visíveis

**Objetivo:** transformar confiança técnica em confiança numa operação white label com equipe própria, coordenada por um interlocutor único.

**Composição:** duas camadas conectadas. Na frente, Agência ↔ Mário, com reuniões, decisões e entregas. Atrás, frentes da equipe própria: desenvolvimento, sistemas/dados e TI/infraestrutura. Uma trilha percorre briefing, definição técnica, produção, revisão, publicação e continuidade. Ao selecionar uma etapa, abre-se um artefato — escopo, quadro de trabalho, pacote publicado ou plano de manutenção.

**Interação e impacto:** o projeto passa da decisão técnica para as frentes operacionais e retorna como entrega apresentada por Mário. Selecionar Desenvolvimento ou TI evidencia a frente correspondente. Uma visão ilustrativa de dois projetos mostra organização de demandas em paralelo, identificada como exemplo de fluxo, não como monitor de clientes reais. A marca da agência permanece na frente.

**Conteúdo:** entrada pelos canais da agência, alinhamento com criação, escopo e cronograma acordados, coordenação da equipe própria, revisão e acompanhamento. A equipe não precisa ser exposta; o processo demonstra estrutura. Não prometer SLA, disponibilidade 24/7, número de funcionários ou prazo fixo sem definição comercial.

**Aceite:** etapas acessíveis sem animação, entregáveis coerentes, responsabilidades claras e CTA disponível sem concluir a trilha.

## S10 — Contato: a conversa já tem contexto

**Objetivo:** facilitar o próximo passo usando o canal atual.

**Composição:** convite direto e um resumo compacto do interesse. Se o visitante veio de Dados, por exemplo, o resumo sugere “Minha agência precisa de uma visualização interativa para uma campanha”. Seleções da assinatura podem sugerir serviços, sem incluir dados pessoais do visitante.

**Interação e impacto:** o resumo se organiza a partir do percurso e pode ser ajustado por escolhas simples de tipo de projeto. “Copiar contexto” produz texto real; “Abrir LinkedIn” abre o perfil existente. Não simular envio de mensagem.

**Alternativa:** se clipboard falhar, manter texto selecionável e instrução de cópia. O contato funciona mesmo sem selecionar nada antes. O encerramento autoral da V1 pode aparecer depois, com animação pausável.

**Aceite:** destino correto, PT/EN, copiar com sucesso/erro honesto e nenhum envio automático. No modo estático, título, contexto e link continuam completos.
