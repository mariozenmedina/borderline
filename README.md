# Borderline.Dev

Site bilíngue de desenvolvimento white label para agências, construído com Vue 3, Three.js, Vite e Less.

## Planejamento da V2

O [plano da V2](docs/v2/README.md) reúne direção criativa, arquitetura da informação, demonstrações, arquitetura técnica, backlog e workflow Git. O [registro de ideias](docs/v2/07-registro-de-ideias.md) acompanha as contribuições e correções durante o planejamento.

O primeiro hero foi implementado em `feat/v2-01-hero`, mas sua direção visual não foi aprovada. A etapa atual é o **mediakit**, na branch `feat/v2-00-mediakit`: validar cores, tipografia, links e botões antes de reformular a entrada. O tema claro continua padrão, com escolha manual de claro/escuro sem acompanhar navegador ou sistema.

Com o servidor local iniciado, abrir **`/?view=mediakit`** ou **`/en/?view=mediakit`** no endereço informado pelo Vite. Por exemplo, `http://localhost:5173/?view=mediakit`. O hero anterior continua acessível em `/` e `/en/`. Consulte a [entrega do mediakit e o roteiro de revisão](docs/v2/entregas/00-mediakit.md).

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
