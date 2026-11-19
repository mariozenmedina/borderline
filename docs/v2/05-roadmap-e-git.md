# Roadmap e workflow Git

## Estado atual

Planejamento local na branch `docs/v2-plan`, iniciada a partir de `main` em `16b9a54`. Após autorização do operador, `v2` foi criada a partir do planejamento em `49f5060`, e `feat/v2-01-hero` contém o primeiro recorte de implementação. Os IDs abaixo são referências locais de backlog, não números de issues já abertas no GitHub.

O operador escolheu planejar primeiro e depois autorizou implementar hero, menu e temas para revisão. As imagens sociais anteriores foram salvas por solicitação em `20fee05`. O primeiro hero foi salvo em `fedf803`, mas sua direção visual foi rejeitada. A branch `feat/v2-00-mediakit` deriva desse commit. Após aprovação explícita do mediakit, `feat/v2-01-home` foi criada a partir de `3bed5ba` para aplicar o visual e revelar a operação por hover/scroll. O trabalho continua local, sem push ou publicação, aguardando validação da home antes de integração em `v2`.

## Sequência e dependências

| ID | Entrega | Depende de | Dimensão relativa | Estado |
| --- | --- | --- | --- | --- |
| V2-00 | Planejamento, conteúdo e decisões | — | M | Documentado, em revisão |
| V2-00A | Mediakit: paleta, tipografia, links, botões e ícones | V2-00 e feedback do hero | M | Aprovado; família Lordicon/Lottie ainda a selecionar |
| V2-01 | Shell, navegação, tokens e PT/EN | V2-00A validado | M | Home/menu/hover/scroll reformulados, aguardando validação visual |
| V2-02 | Runtime de demos, atividade e alternativas | V2-01 | G | Planejado |
| V2-03 | Assinatura white label e operação por trás | V2-02 | G | Planejado |
| V2-04 | Laboratório D3 | V2-02 | G | Planejado |
| V2-05 | Escritório, rede e cloud | V2-02 | G | Planejado |
| V2-06 | Jogo | V2-02 | G | Planejado |
| V2-07 | Campanha responsiva | V2-01 e V2-02 | M | Planejado |
| V2-08 | Configurador de produto | V2-02 e asset definido para V2-07 | G | Planejado |
| V2-09 | Sistemas e integrações simuladas | V2-02 | M | Planejado |
| V2-10 | Operação, processo e contato contextual | V2-03 e estrutura dos seis serviços | M | Planejado |
| V2-11 | SEO, conteúdo estático e integração | V2-03 a V2-10 | M | Planejado |
| V2-12 | Acabamento e aceite de versão | V2-11 e validações do operador | G | Planejado |

M/G expressam complexidade relativa, não estimativa de prazo. Calendário só deve ser proposto depois do primeiro corte, da revisão criativa e da definição de disponibilidade. A ordem recomendada prioriza assinatura, dados e infraestrutura; não exige construir todos os capítulos simultaneamente.

## Entregas e critérios

### V2-00 — Planejamento

Branch `docs/v2-plan`. Consolidar auditoria, direção, arquitetura da informação, demos, contratos, backlog e validação. Manter registro das novas ideias e correções. A revisão criativa inclui storyboard da abertura, assinatura como desfecho e proposta de identidade mais suave com hero sem máscara. A retirada definitiva do símbolo e os tokens finais continuam abertos. Aceite: documentos coerentes com equipe própria e liderança técnica, referências navegáveis e nenhuma alteração de produto.

### V2-01 — Shell e conteúdo

Iconografia futura: selecionar uma família Lordicon e preparar amostras, produzindo Lotties autorais onde necessário. Phosphor permanece provisório no mediakit. A home já usa microanimações autorais em SVG/CSS, sem player ou assets externos; isso não encerra a seleção da família animada prevista na I-014.

A [V2-00A — mediakit](entregas/00-mediakit.md) foi aprovada. Sua direção está aplicada à entrada em `feat/v2-01-home`, com dois botões, menu e hover/scroll que revelam serviços atrás da agência. Veja o [escopo atual e roteiro](entregas/01-home-mediakit.md); o aceite visual da home permanece com o operador.

Branch do primeiro recorte: `feat/v2-01-hero`. [Escopo implementado e roteiro](entregas/01-hero-menu.md). O shell completo e os seis capítulos continuam pendentes; não considerar toda a V2-01 encerrada.

- Extrair tokens visuais, navegação e conteúdo de seção com IDs semânticos.
- Implementar tema claro padrão e escolha manual de claro/escuro persistida, sem seguir navegador/OS.
- Trocar snap obrigatório por scroll natural; reservar espaços de demos.
- Manter `/` e `/en/`, navegação por hash e histórico.
- Reescrever hero para operação técnica com equipe própria e interlocução de Mário.
- Aplicar a direção visual revisada e estruturar a narrativa anterior à assinatura; não tratar o hero sem máscara como identidade final aprovada antes da revisão visual.
- Criar conteúdo PT/EN dos capítulos, com alternativas editoriais legíveis.
- Aceite: navegação e idioma independem do 3D; hash direto e voltar/avançar têm roteiro explícito para operador; build localizado continua gerando os dois idiomas.

### V2-02 — Fundação das experiências

Branch sugerida `feat/v2-02-demo-runtime`.

- Imports dinâmicos, estado serializável, pausa por visibilidade e desmontagem.
- Spike do renderer compartilhado e movimentação do canvas entre hosts.
- Tratamento de loading, erro, contexto WebGL perdido e movimento reduzido.
- Corrigir limite de DPR; eliminar espera global obrigatória.
- Substituir os preloads e registro estático apenas quando os consumidores forem migrados.
- Aceite: uma cena ativa, recursos com dono e cleanup, texto utilizável com falha; operador valida o spike antes de multiplicar cenas.

### V2-03 — Assinatura white label

Branch sugerida `feat/v2-03-signature`.

- Primeiro corte: serviços, estilos e assinatura HTML, cargo e módulos derivados.
- Segundo corte: transformação 3D, tipografia, paletas e inspeção frontal.
- Terceiro corte: revelar frentes operacionais conforme os serviços, com Mário como interlocutor.
- Integrar a assinatura como desfecho de S01; a oferta e a operação são compreensíveis antes dos controles. Preservar acesso direto contextualizado.
- Três identidades fictícias; nenhuma edição de nome/e-mail/cargo; reset e PT/EN.
- Aceite: regras para todas as 64 combinações, mudanças rápidas consistentes, estilo altera composição, alternativas sem WebGL; equipe própria comunicada sem expor integrantes.
- Verificação sem navegador: testes de derivação, precedência de papéis, combinações, paleta e seleção vazia. Operador avalia legibilidade e impacto da transformação.

### V2-04 — D3

Branch sugerida `feat/v2-04-data-lab`.

- Gerador de dados e seletor único; série temporal, Sankey e matriz.
- Filtros combinados, brush, seleção por nó/célula, tabela e reset.
- PT/EN, vazios e mobile com visualizações coordenadas em abas.
- Aceite: todos os gráficos concordam com a mesma seleção; controles não dependem só de arraste; dados identificados como sintéticos.
- Verificação: agregações, conservação dos fluxos, taxa com denominador zero, filtros combinados e reset.

### V2-05 — Infraestrutura

Branch sugerida `feat/v2-05-infrastructure`.

- Primeiro corte: planta reconhecível, equipamentos e seleção, grafo em estado normal e falha de WAN.
- Segundo corte: redundância, falha de switch, camada de serviços e backup.
- Representações Three e SVG com a mesma topologia; painel de dependências.
- Aceite: falhas têm efeitos coerentes, planta funciona no mobile, nenhuma conexão real é executada.
- Verificação: alcance do grafo, caminho alternativo, nós isolados, dependências e reset.

### V2-06 — Jogo

Branch sugerida `feat/v2-06-game`.

- Estado e regras puras; pista, coleta, colisões, combo, relógio e resultado.
- Pausa por atividade, entrada focada, replay e modo por passos.
- Arte autoral e intensidade ajustável; sem ranking remoto.
- Aceite: rodada completa, pontuação consistente, pausa real, teclado/toque e saída da demo.
- Verificação: seed reproduzível, colisões, pontuação, fim da rodada, delta e pausa; balanceamento e sensações ficam com o operador.

### V2-07 — Websites

Branch sugerida `feat/v2-07-websites`.

- Uma campanha funcional com três larguras e conteúdo curto/longo.
- Menu, troca de conteúdo e CTA locais; relação com o produto da próxima demo.
- Aceite: composição muda efetivamente, conteúdo não é screenshot, ambiente da demo não interfere na home.
- Verificação: build e revisão de conteúdo; operador valida layout e interação. Não escrever testes que apenas repitam CSS.

### V2-08 — Produto 3D

Branch sugerida `feat/v2-08-product`.

- Asset autoral acordado; três acabamentos, luz, seleção de peça e vista explodida.
- Configuração derivada, controles acessíveis e alternativa visual leve.
- Aceite: estado e cena concordam, peças recompõem corretamente e não há travamento de navegação.
- Verificação: regras de configuração quando houver lógica relevante; operador verifica materiais, câmera e transições.

### V2-09 — Sistemas e integrações

Branch sugerida `feat/v2-09-systems`.

- Máquina de estados de lead, validação, CRM e notificação locais.
- Cenários válido, inválido e erro recuperável; retry com ID estável e eventos limitados.
- Apresentação coordenada entre ficha, fluxo e destinos, em PT/EN.
- Aceite: estado visível e explicado, retry não duplica operações, simulação identificada e reset completo.
- Verificação: transições válidas, bloqueio de entrada inválida, idempotência, falha/recuperação e encerramento de timers; operador valida a apresentação.

### V2-10 — Operação e contato

Branch sugerida `feat/v2-10-partnership`.

- Duas camadas: Mário na interlocução, equipe própria na execução.
- Fluxo de briefing a continuidade com artefatos e exemplo de projetos paralelos.
- Interesse contextual por serviço e resumo copiável; link atual do LinkedIn.
- Aceite: processo claro, equipe preservada nos bastidores e nenhum envio simulado como real.
- Verificação: geração do resumo PT/EN, links e estados de cópia; operador valida fluxo e clipboard.

### V2-11 — SEO e integração

Branch sugerida `feat/v2-11-seo-content`.

- Completar todo o conteúdo PT/EN, metadados e catálogo dos seis serviços.
- Resolver conteúdo editorial estático a partir da fonte única; preparar decisão técnica antes da implementação.
- Atualizar sitemap quando necessário; preservar canonical, alternates e assets localizados.
- Revisar loading, erros, alternativas e navegação entre capítulos.
- Aceite: HTML de produção e conteúdo localizado inspecionáveis por arquivos; sem divergência de mensagens ou promessas de equipe.

### V2-12 — Acabamento e versão

Branch sugerida `fix/v2-12-release-polish`.

- Corrigir feedback do operador sobre ritmo, impacto, mobile, teclado e desempenho.
- Documentar tamanhos do build, assets, licenças e resultados observados pelo operador.
- Remover código V1 sem consumidores e conteúdo temporário; preservar referências úteis.
- Aceite: critérios globais e de cada demo concluídos; limitações conhecidas documentadas; versão revisada antes de merge/publicação.

## Workflow Git

```text
main (V1 publicável)
  └─ docs/v2-plan       # etapa atual, documentação

Após revisão do plano e início do desenvolvimento:
main
  └─ v2                # integração da nova versão
      ├─ feat/v2-01-hero
      │   └─ feat/v2-00-mediakit  # direção visual aprovada
      │       └─ feat/v2-01-home # aplicação na home e hover/scroll da operação
      ├─ feat/v2-02-demo-runtime
      ├─ feat/v2-03-signature
      └─ demais entregas, uma por vez conforme dependências
```

Integrar o planejamento antes de iniciar `v2`, por merge ou cherry-pick deliberado do commit documental. Não criar branches com base em uma árvore suja sem conferir quais alterações vão acompanhá-las.

Para cada entrega:

1. Conferir status e instruções locais; não incluir alterações alheias.
2. Criar a branch a partir da integração atualizada.
3. Implementar uma entrega pequena e utilizável em PT/EN, com alternativa e reset.
4. Executar verificações apropriadas sem navegador; revisar diff e arquivos staged.
5. Fazer commit com a identidade obrigatória.
6. Preparar descrição de revisão com comportamento, validação realizada e roteiro do operador.
7. Registrar resultado do operador e corrigir na mesma entrega. Só considerar o aceite visual concluído quando ele o confirmar.
8. Integrar em `v2`; a publicação da V2 permanece separada do merge de funcionalidades.

PRs, quando utilizados no remoto, terão `v2` como base e escopo por entrega. O PR final será `v2` → `main`. O template no repositório orienta revisão; ele não cria nem publica PR automaticamente.

Exemplo de identidade para todos os commits:

```powershell
git -c user.name="Mário Veronesi Medina" -c user.email="mazen.mario@gmail.com" commit -m "feat(v2): adiciona assinatura white label"
```

Conferir autor e committer no commit criado. Usar mensagens que descrevam comportamento, como `feat(v2): conecta filtros do laboratório de dados` e `fix(v2): pausa partida ao sair da seção`. Não usar `git add .` sobre alterações prévias desconhecidas.

## Verificação e reversão

Para documentação, conferir links, consistência e `git diff --check`; não exigir build do produto sem mudança de código. Para implementação, rodar `pnpm build` e testes de lógica afetada quando existirem. Análise estática por lint quando solicitada ou definida como check da entrega. Não inventar `pnpm test` antes de adicionar um script adequado.

Para lógica pura, preferir inicialmente `node:test` e `node:assert/strict`, com módulos importáveis sem DOM. Adicionar script específico quando houver testes reais; não instalar infraestrutura de navegador.

Reverter uma entrega por `git revert` do commit ou merge correspondente, preservando histórico. Antes da publicação final, registrar o SHA da V1 e o artefato publicável. Procedimento de rollback de hospedagem depende do destino atual e será documentado na etapa de versão. Não usar reset destrutivo ou force-push como rotina.

## Limite do primeiro lançamento

Entrega completa: seis capacidades demonstradas, assinatura, operação com equipe própria, PT/EN e contato. Cada corte intermediário é um marco de revisão, não a V2 final. Caso seja necessário lançar com escopo menor, decidir isso explicitamente com o operador.

Ficam para uma etapa posterior: páginas de laboratório independentes, exportação de assinatura de e-mail, ranking remoto, CMS, autenticação, integrações reais, upload de marca do visitante e analytics persistente.
