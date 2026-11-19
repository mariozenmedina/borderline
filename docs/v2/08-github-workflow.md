# Workflow ativo da V2 no GitHub

Organização iniciada em 18/11/2026, após autorização do operador para administrar livremente o workflow do repositório, incluindo milestones. O repositório pertence ao operador. Commits continuam com `Mário Veronesi Medina <mazen.mario@gmail.com>`, sem assinatura obrigatória.

## Milestones

| Marco | Escopo | Link |
| --- | --- | --- |
| V2.1 — Base visual e entrada | Planejamento, mediakit, ícones e revisão da home | [Milestone 1](https://github.com/mariozenmedina/borderline/milestone/1) |
| V2.2 — Operação white label | Runtime das experiências e assinatura | [Milestone 2](https://github.com/mariozenmedina/borderline/milestone/2) |
| V2.3 — Demonstrações de capacidade | Dados, infraestrutura, games, websites, 3D e integrações | [Milestone 3](https://github.com/mariozenmedina/borderline/milestone/3) |
| V2.4 — Integração e lançamento | Parceria, contato, SEO, acabamento e aceite | [Milestone 4](https://github.com/mariozenmedina/borderline/milestone/4) |

Marcos representam escopo, sem datas artificiais. A ordem de leitura da home não determina a ordem de implementação.

## Backlog publicado

| ID | Issue | Estado inicial |
| --- | --- | --- |
| V2-00 | [#1 — Planejamento inicial](https://github.com/mariozenmedina/borderline/issues/1) | Concluído; documentação continua evoluindo |
| V2-00A | [#2 — Fundamentos do mediakit](https://github.com/mariozenmedina/borderline/issues/2) | Concluído; aprovado pelo operador |
| V2-00B | [#3 — Família de ícones animados](https://github.com/mariozenmedina/borderline/issues/3) | Planejado; separado do mediakit aprovado |
| V2-01 | [#4 — Home, menu e navegação](https://github.com/mariozenmedina/borderline/issues/4) | Aguarda validação visual |
| V2-02 | [#5 — Runtime das experiências](https://github.com/mariozenmedina/borderline/issues/5) | Planejado |
| V2-03 | [#6 — Assinatura white label](https://github.com/mariozenmedina/borderline/issues/6) | Planejado |
| V2-04 | [#7 — Laboratório D3](https://github.com/mariozenmedina/borderline/issues/7) | Planejado |
| V2-05 | [#8 — Infraestrutura](https://github.com/mariozenmedina/borderline/issues/8) | Planejado |
| V2-06 | [#9 — Minijogo](https://github.com/mariozenmedina/borderline/issues/9) | Planejado |
| V2-07 | [#10 — Websites responsivos](https://github.com/mariozenmedina/borderline/issues/10) | Planejado |
| V2-08 | [#11 — Produto 3D](https://github.com/mariozenmedina/borderline/issues/11) | Planejado |
| V2-09 | [#12 — Sistemas e integrações](https://github.com/mariozenmedina/borderline/issues/12) | Planejado |
| V2-10 | [#13 — Parceria e contato](https://github.com/mariozenmedina/borderline/issues/13) | Planejado |
| V2-11 | [#14 — Conteúdo, navegação e SEO](https://github.com/mariozenmedina/borderline/issues/14) | Planejado |
| V2-12 | [#15 — Acabamento e lançamento](https://github.com/mariozenmedina/borderline/issues/15) | Planejado |

As issues são a fonte do estado atual; esta tabela registra a organização inicial. Cada issue contém resultado, critérios de conclusão, dependências e referência ao plano. As decisões criativas e especificações detalhadas permanecem versionadas em `docs/v2/`.

## Fluxo de trabalho

1. Escolher uma issue cujas dependências permitam avançar. Usar `v2` e `status:planned` no backlog; mover para `status:in-progress` quando iniciar.
2. Atualizar a base `v2` e abrir branch curta por entrega (`feat/`, `fix/`, `docs/` ou `chore/`). Preservar o histórico já existente da home.
3. Fazer commits pequenos com a identidade definida, publicar a branch e abrir PR para `v2`. Manter rascunho enquanto houver implementação ou revisão visual pendente.
4. Relacionar issue e milestone ao PR. Registrar checks executados, limitações e roteiro do operador. Mudanças visuais usam `status:visual-review` quando prontas para avaliação.
5. Corrigir feedback na mesma entrega. Quando os critérios e checks estiverem satisfeitos, integrar em `v2` e fechar explicitamente a issue. PRs para `v2` não dependem do fechamento automático por palavras-chave, pois `main` continua sendo a branch padrão.
6. Fechar milestones quando todas as suas issues estiverem concluídas. Criar follow-ups específicos para pendências reais, sem declarar uma experiência pronta apenas por compilar.
7. Preparar o PR final `v2` → `main` quando a versão cumprir o aceite. Publicação do site continua sendo uma etapa de lançamento distinta.

O agente pode administrar issues, labels, milestones, commits, branches, pushes, PRs e merges de entregas concluídas sem pedir confirmação rotineira. A validação visual continua sendo feita exclusivamente pelo operador. Não usar force-push, apagar histórico ou alterar visibilidade como rotina de organização.

## Verificações automáticas

[V2 checks](../../.github/workflows/v2-checks.yml) roda em PRs para `v2`/`main`, pushes em `v2` e execução manual. Usa Node 24, pnpm 11.5.3 e versões das actions fixadas por SHA:

- instalação com lockfile congelado;
- testes de lógica com `node --test tests/*.test.mjs`;
- `pnpm build`, incluindo HTML em português e inglês.

Permissão somente de leitura do conteúdo, cancelamento de runs superados e limite de dez minutos. Não executa navegador, lint, deploy nem publicação de release. Checks técnicos aprovados não significam aceite visual.
