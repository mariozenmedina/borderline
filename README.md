# Borderline.Dev

Site bilíngue de desenvolvimento white label para agências, construído com Vue 3, Three.js, Vite e Less.

## Planejamento da V2

O [plano da V2](docs/v2/README.md) reúne direção criativa, arquitetura da informação, demonstrações, arquitetura técnica, backlog e workflow Git. O [registro de ideias](docs/v2/07-registro-de-ideias.md) acompanha as contribuições e correções durante o planejamento.

O **mediakit foi aprovado** e aplicado à entrada na branch `feat/v2-01-home`: menu, chapéu, título, texto, dois botões e cards da operação revelados por hover/scroll. Esta home aguarda validação visual do operador. O tema claro continua padrão, com escolha manual de claro/escuro sem acompanhar navegador ou sistema.

Com o servidor local iniciado, abrir **`/`** ou **`/en/`** para revisar a home. O mediakit continua em `/?view=mediakit` e `/en/?view=mediakit`. Consulte a [entrega da home e o roteiro de revisão](docs/v2/entregas/01-home-mediakit.md) e a [referência do mediakit](docs/v2/entregas/00-mediakit.md). O primeiro hero rejeitado está preservado no histórico de `feat/v2-01-hero`.

## Desenvolvimento local

Usamos pnpm. Instale as dependências e inicie o servidor quando necessário:

```powershell
pnpm install
pnpm dev
```

`pnpm serve` disponibiliza o servidor na rede local. Para gerar a versão de produção:

```powershell
pnpm build
```

O build gera `dist/index.html` em português e `dist/en/index.html` em inglês. O comando `pnpm lint` está disponível para análise estática quando aplicável.

## Validação e contribuições

- O agente nunca testa em navegador. O operador valida as mudanças e retorna os problemas encontrados.
- Usar pnpm e Docker quando necessários; o site estático atual não exige Docker.
- Todo commit deve usar a identidade `Mário Veronesi Medina <mazen.mario@gmail.com>`.
- Preservar alterações locais que não pertençam à tarefa.
- Consultar o [workflow da V2](docs/v2/05-roadmap-e-git.md) antes de iniciar uma entrega dessa versão.

[contexto.txt](contexto.txt) contém a direção original da marca. Para a V2, as decisões atuais sobre público, conteúdo e interação estão em `docs/v2/`; os fundamentos visuais do contexto original continuam como referência.
