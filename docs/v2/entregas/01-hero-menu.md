# V2-01 — primeiro recorte: hero, menu e temas

Branch: `feat/v2-01-hero`, a partir de `v2` em `49f5060`.

**Estado: implementado em `fedf803`, com direção visual rejeitada pelo operador.** O refinamento está pausado: a prioridade passou a ser validar o [mediakit](00-mediakit.md), recuperando preto, vermelho, branco e cinzas. Este registro preserva o primeiro recorte do shell; não representa aceite nem a V2 completa.

## O que mudou

- Hero com “Sua agência à frente. Nossa operação por trás.”, equipe própria e liderança técnica explícitas.
- Composição de uma entrega fictícia que abre camadas de desenvolvimento e infraestrutura pelo controle “A entrega / A operação”.
- HTML/SVG com perspectiva CSS 3D, alternativa textual e movimento reduzido; sem WebGL nesta etapa.
- Menu desktop e móvel com links existentes, PT/EN, Escape, fechamento externo e skip link.
- Claro por padrão; seletor manual com persistência local e sem seguir preferências de cor do sistema.
- Tema aplicado antes da montagem do Vue; trocar idioma não altera tema nem a cena selecionada.
- Conteúdo editorial da V1 reaproveitado abaixo da entrada, com Capacidades em superfície escura intencional. As novas demonstrações serão implementadas nas entregas seguintes.
- Removidos da entrada ativa o overlay de espera, o backdrop global e o preload da máscara. Seus arquivos continuam disponíveis para a migração.

## Verificações realizadas sem navegador

- `pnpm build`: aprovado; gera `dist/index.html` e `dist/en/index.html`.
- Verificação em Node do bootstrap: sem preferência → claro; escuro salvo → escuro; claro salvo → claro; valor inválido → claro; armazenamento bloqueado → claro.
- Verificação em Node da troca manual: atributo, metadados e persistência atualizados; armazenamento bloqueado não impede a troca.
- Paridade estrutural de todas as chaves do conteúdo do hero/menu em PT/EN.
- Referências locais dos assets nos dois HTMLs emitidos verificadas.
- Nenhuma consulta a `prefers-color-scheme` no caminho ativo; preferências de movimento continuam respeitadas.
- `git diff --check` para integridade do diff.

O build e as verificações de lógica não comprovam layout, foco real, animação ou compatibilidade de dispositivo. Nenhum navegador foi aberto pelo agente.

## Roteiro do operador

Iniciar com `pnpm dev` e usar o endereço informado pelo Vite. Para rede local, `pnpm serve`.

1. Em uma primeira visita sem preferência salva, conferir tema claro mesmo com o OS configurado em escuro.
2. Trocar para escuro, recarregar e conferir persistência. Voltar ao claro e repetir.
3. Alterar tema do OS sem mudar o seletor; o site deve manter a escolha.
4. Alternar PT/EN, inclusive com “A operação” aberta; cena e tema devem permanecer.
5. Usar os dois controles da cena e conferir leitura das camadas, posição da liderança e transições.
6. Conferir hero e menu em desktop, viewport baixa e mobile; verificar textos longos em inglês e ausência de cortes.
7. No menu móvel, navegar, fechar por Escape e clicar fora. Conferir foco por teclado e os destinos das âncoras.
8. Abrir `/en/`, `/#capacidades` e `/en/#contato` diretamente; usar voltar/avançar.
9. Ativar movimento reduzido; as mudanças de estado continuam disponíveis, sem tilt ou transições longas.
10. Avaliar a direção: suavidade, porte da operação, clareza da mensagem e força do hero.

## Limites deste recorte

A cena é uma ilustração interativa de entrega e operação, não um configurador de produto completo. O exemplo “forma” é fictício. A assinatura, a narrativa completa por scroll, o runtime Three e as seis demos continuam no backlog.

A primeira proposta de tokens, composição e tipografia será ajustada com o retorno do operador. Não houve push, merge na integração ou publicação.
