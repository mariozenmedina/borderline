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

## Próximas contribuições

Adicionar um identificador com origem, intenção, estado e impacto. Quando houver correção, atualizar a especificação ativa e registrar aqui o que deixou de valer. Distinguir pedido do operador, proposta do agente, decisão e adiamento.

Se a ideia acrescentar assets, estado, dados ou interação, atualizar também o item de backlog e o roteiro de validação correspondente.
