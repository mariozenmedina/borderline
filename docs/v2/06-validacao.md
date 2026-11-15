# Validação e critérios de aceite

## Divisão de responsabilidade

**O agente nunca testa em navegador.** Isso inclui navegação manual, Playwright, Cypress, Puppeteer, navegador headless, screenshots e auditorias que dependam de abrir navegador. O operador valida as mudanças e devolve os problemas encontrados.

O agente pode ler código, revisar diffs, gerar build e verificar regras de domínio sem DOM/navegador. Esses checks não comprovam acabamento visual, usabilidade, compatibilidade móvel ou desempenho de renderização.

Para entregas somente documentais, verificar documentos, links locais, consistência, diff e preservação das alterações do operador, sem build de produto. O primeiro recorte de código tem verificações e roteiro próprios em [Hero, menu e temas](entregas/01-hero-menu.md).

## Checks por tipo de alteração

| Alteração | Agente, sem navegador | Operador |
| --- | --- | --- |
| Documentação | Links, referências, backlog, diff e identidade do commit | Direção, escopo e prioridade |
| Conteúdo/PT/EN | Paridade de chaves, valores vazios, metadados e links | Tom, comprimento e leitura em layout |
| Shell/estilos | Build e revisão de estrutura/semântica | Responsividade, foco, contraste, scroll e navegação |
| Assinatura | Função de derivação e combinações de serviços | Composição, legibilidade, transição e percepção white label |
| D3 | Agregações, filtros e consistência dos dados | Clareza, controles, tooltips, coordenação e toque |
| Jogo | Regras, tempo, colisões e pausas | Sensação, dificuldade, controles e renderização |
| Sistemas | Estados, retry e idempotência | Fluxo visual e compreensão de erros |
| Infraestrutura | Grafo, alcance, cenários e reset | Planta, enquadramento e compreensão das falhas |
| 3D/produto | Regras de configuração e build | Materiais, câmera, peça explodida e fallback |
| SEO/build | HTML emitido, canonical, alternates e caminhos de assets | Acesso às URLs servidas e comportamento de navegação |

Usar testes para lógica que pode falhar de maneira relevante. Não criar testes que apenas confirmem a existência de classes CSS ou reproduzam tabelas de conteúdo. Ainda não existe script `pnpm test` no projeto; adicioná-lo somente junto a testes reais.

## Roteiro global do operador

Executar na primeira entrega correspondente e repetir quando houver mudança, falha ou risco novo. Registrar dispositivo/navegador utilizado; não é necessário revalidar toda a V2 após cada mudança documental.

1. Abrir `/` e `/en/`, inclusive diretamente em uma âncora de demo.
2. Navegar pelos capítulos, abrir detalhes e usar voltar/avançar.
3. Trocar idioma com uma configuração ativa; conferir preservação de seleção e mensagens.
4. Testar desktop largo, viewport baixa, mobile retrato e paisagem; registrar dimensões utilizadas.
5. Percorrer por teclado, incluindo menu, seleção de serviço, reset e contato; verificar foco visível e ausência de aprisionamento.
6. Usar toque sem hover; confirmar que scroll da página e gestos da demo não competem.
7. Ativar movimento reduzido e verificar ausência de animações contínuas não solicitadas.
8. Verificar alternativa sem WebGL e falha de asset com a infraestrutura de inspeção do próprio operador.
9. Sair da área e trocar de aba durante demo ativa; conferir pausa e retomada apropriadas.
10. Voltar a uma demo já explorada; conferir estado e ausência de duplicação de listeners ou animações.
11. Abrir contato diretamente e a partir de um serviço; copiar contexto e conferir destino do LinkedIn.

O agente fornece o roteiro específico da entrega e os resultados dos checks executados. Nunca registrar os passos acima como concluídos sem retorno do operador.

## Aceite por experiência

| Área | Percurso mínimo | Resultado esperado |
| --- | --- | --- |
| Hero | Abrir página e navegar antes de todo 3D carregar | Oferta, equipe própria e liderança técnica compreensíveis; navegação disponível |
| Temas | Primeira visita, troca manual, reload, mudança de idioma e mudança de tema do OS | Claro por padrão; somente escolha explícita altera o tema; preferência local preservada |
| Narrativa de abertura | Percorrer S01 até a assinatura e acessar `#whitelabel` diretamente | Assinatura conclui a história; oferta clara antes da interação; acesso direto contextualizado e scroll livre |
| Assinatura | Selecionar Web; adicionar Sistemas; mudar para Casual e outra paleta; remover serviços; reset | Cargo e módulos coerentes; composição/fontes mudam; nada exige nome ou e-mail do visitante |
| Operação atrás da assinatura | Selecionar Dados + Infra e revelar bastidores | Frentes correspondentes destacadas, Mário como interlocutor e equipe preservada |
| Websites | Alternar larguras, abrir menu e trocar para conteúdo longo/EN | Responsividade real, texto legível e ações locais funcionais |
| Produto | Trocar acabamento, abrir peças, selecionar componente, recompor | Estado consistente e objeto compreensível |
| Jogo | Iniciar, coletar, colidir, pausar, sair, retornar e reiniciar | Tempo congelado na pausa, pontos corretos, retomada explícita e controles acessíveis |
| Dados | Selecionar período, canal e célula; esvaziar seleção; limpar filtros | Totais e gráficos concordam, seleção visível, vazio tratado |
| Sistemas | Enviar exemplo, provocar erro, tentar novamente e usar dado inválido | Fluxo coerente sem duplicação; inválido não avança |
| Infraestrutura | Selecionar estação, seguir tráfego, derrubar WAN, ativar redundância e derrubar switch | Caminhos e indisponibilidade seguem topologia; backup não simula redundância |
| Parceria | Percorrer etapas e frentes de execução | Decisões passam por Mário, equipe executa, entregáveis retornam sob a agência |
| Contato | Chegar por serviço e sem seleção; copiar texto | Resumo correto ou genérico; falha de cópia honesta; sem envio automático |

## Avaliação criativa

Para cada capítulo, registrar uma frase sobre o momento mais forte e o que precisa melhorar:

- A ação principal é descoberta sem explicação externa?
- O resultado parece causado pela ação, e não uma animação indiferente ao visitante?
- A composição é distinta dos capítulos vizinhos e mantém a marca?
- A demonstração faz a agência imaginar um projeto contratável?
- A experiência móvel mantém a ideia, mesmo com menos efeitos?
- A operação parece estruturada e liderada, com equipe própria por trás?
- A direção visual transmite suavidade e confiança, mantendo personalidade sem depender da máscara?

“Funciona” e “tem impacto” são critérios separados. Ajustes de direção de arte devem ser registrados com referência à seção e ao estado, para não virar uma solicitação genérica de mais animação.

## Desempenho

O agente registra tamanho de JS/CSS e assets emitidos, quando houver mudança de produto. O operador mede carregamento, responsividade e renderização nos dispositivos combinados, comparando com as metas propostas na arquitetura.

Anotar se há travamento na primeira ativação, aquecimento/custo persistente fora da demo, queda de frames em transições ou crescimento contínuo de recursos ao alternar capítulos. Esses resultados não podem ser inferidos somente do build.

## Registro de retorno

Formato sugerido para revisão/PR:

```text
Entrega / commit:
Seção / idioma:
Dispositivo, navegador e dimensões:
Configuração de movimento / qualidade:
Passos:
Esperado:
Observado:
Impacto: bloqueia uso | prejudica leitura | acabamento
Resultado após correção:
```

Screenshots ou vídeos podem ser fornecidos pelo operador se úteis, mas não são produzidos pelo agente em navegador. Problemas entram na entrega correspondente e seu aceite permanece pendente até correção e retorno.

## Definição de pronto

Uma entrega está pronta quando atende ao comportamento especificado, tem PT/EN, estados de erro/alternativa pertinentes, checks sem navegador aprovados e validação do operador registrada. Para o lançamento, todas as seis capacidades, assinatura, operação e contato precisam estar completas, salvo revisão explícita de escopo.

Não confundir “documentado”, “implementado”, “build aprovado”, “validado pelo operador” e “publicado”. Registrar cada estado separadamente.
