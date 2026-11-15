# Direção, auditoria e referência

## Posicionamento

Público principal: responsáveis por criação, produção, projetos e tecnologia em agências que precisam de execução técnica sob sua marca. A experiência deve responder “essa operação consegue sustentar nossas entregas?” e “quem assume as decisões e a comunicação técnica?”.

O operador confirmou equipe própria operacional de desenvolvimento e TI. Mário é a frente: participa das reuniões, explica decisões, coordena e apresenta as entregas. A equipe permanece nos bastidores e dá sustentação ao atendimento de múltiplos clientes. Isso é um fato fornecido pelo operador, não uma hipótese de posicionamento.

Apresentar uma empresa estruturada: liderança técnica visível, responsabilidades claras, frentes de entrega, processo e continuidade. A percepção de porte vem dessa estrutura e das demonstrações. Não depender de expor integrantes; não criar headcount, escritórios, certificações, SLAs ou números de clientes que não foram fornecidos.

A V2 demonstra capacidade visual e capacidade de lidar com estado, dados, erros e continuidade. O texto comercial acompanha o que a pessoa acabou de experimentar: uma assinatura, configuração, partida, seleção de dados ou recuperação de falha.

Nomes como Three.js e D3 podem aparecer em detalhes opcionais. A narrativa principal explica aplicações: campanha, configurador, ativação, relatório, portal e infraestrutura. Usar voz de operação (“desenvolvemos”, “nossa equipe”, “coordenamos”) e identificar Mário como interlocutor técnico. Clientes, depoimentos, métricas e resultados exigem evidência antes de publicação.

## Auditoria do repositório

Leitura de código em 15/11/2026, sem navegador. Estas são observações de estrutura, não medições de experiência ou desempenho.

| Área | Evidência | Implicação |
| --- | --- | --- |
| Stack | `package.json`: Vue 3, Three.js, Vite 8 e Less | Evoluir a base existente |
| Composição | `src/App.vue`: abertura, sobre, quatro serviços, processo, contato e encerramento | Desdobrar experiências agrupadas em `service02` |
| Conteúdo | `src/i18n/siteContent.mjs`: PT/EN e SEO centralizados | Manter paridade, separar por domínio quando crescer |
| Serviços | `src/components/sections/Service01Section.vue` e demais serviços: título e parágrafo | Aumentar profundidade funcional e variar composição |
| Motor 3D | `src/components/SceneBackdrop.vue`: renderer, câmera e ambiente compartilhados | Reaproveitar recursos, separar decoração de áreas interativas |
| Registro | `src/scenes/index.js`: oito cenas importadas estaticamente e montadas no backdrop | Carregar experiências sob demanda |
| Animação | Loop chama `animate` de todas as instâncias com peso e estado ativo | Gerenciar ciclo de vida explicitamente, sem depender só da opacidade |
| Entrada | Backdrop com `aria-hidden` e `pointer-events: none` | Demos precisam de superfícies e controles semânticos próprios |
| Carregamento | `src/App.vue`: overlay global, espera mínima de 1.200 ms e preload de modelos | Disponibilizar texto e navegação sem esperar todas as cenas |
| Densidade de pixels | `resize` usa `Math.min(window.devicePixelRatio || 1)` com um único argumento | O limite inicial de DPR não é mantido nesse caminho |
| Scroll | `src/styles/App.less`: snap obrigatório e painéis de viewport | Conteúdo profundo precisa de fluxo normal |
| Acessibilidade | Há títulos e labels; não encontrados tratamentos de movimento reduzido ou perda de contexto WebGL | Acrescentar essas políticas na fundação |
| SEO | `index.html`, conteúdo SEO e script de build localizado | Preservar `/` e `/en/`; metadados não equivalem a conteúdo pré-renderizado |
| Conversão | Contato direciona ao LinkedIn de Mario Medina | Manter canal e acrescentar contexto de interesse |
| Documentação | README anterior citava npm e Vue CLI | Atualizado para pnpm e Vite junto ao plano |

No início do trabalho, `public/og-image-pt.png` e `public/og-image-en.png` já tinham modificações locais. Elas pertencem ao operador e ficam fora do commit de planejamento.

## Direção de arte

O operador quer uma expressão mais suave e profissional e considera retirar a máscara por perceber agressividade no símbolo. A direção passa a preservar reconhecimento e qualidade tridimensional, com liberdade para rever o símbolo. Explorar o hero sem máscara é a proposta principal; não há aprovação definitiva de um novo logotipo ou sistema visual.

A base atual — fundo `#010911`, texto `#f5f5f5`, vermelho `#e50914`, Offside e malha — é ponto de partida, não uma obrigação de manter todos os tokens. Propor mais espaço, iluminação difusa, superfícies foscas ou claras, contornos sutis e transições contínuas. Testar menor presença do vermelho saturado e do contraste dramático na composição; preservar contraste legível em textos e controles.

A marca tipográfica Borderline.Dev pode ganhar protagonismo, acompanhada de uma linguagem autoral de bordas, enquadramentos e camadas. O ponto e os contornos podem conectar marca, navegação e cenas. Evitar substituir a máscara por outro objeto abstrato sem relação com a oferta. Uma alteração de tipografia ou cor precisa ser apresentada como direção visual para revisão.

O impacto passa a vir da precisão das transformações, da materialidade e da qualidade das demonstrações. Movimento calmo não significa perder profundidade ou complexidade. Em dados e estados, complementar cor com rótulos, padrões e ícones.

Variar a composição: peça editorial 3D na assinatura; tipografia e janelas reais em websites; objeto central no configurador; palco largo no jogo; instrumentos coordenados em dados; trilha de eventos em sistemas; planta arquitetônica em infraestrutura.

O acabamento comum estará em materiais, tipografia, contornos, transições e controles. Evitar repetir texto de um lado e objeto girando do outro. O público amplo de `contexto.txt` cede lugar ao foco atual em agências; seus fundamentos visuais continuam úteis.

## Referência Pitecg

O operador apontou a [Pitecg](https://pitecg.com/) como referência de áreas ricas, interações complexas e 3D. O conteúdo público consultado apresenta uma organização institucional com pesquisa, cursos, soluções e social. A inspeção textual não confirma os comportamentos 3D relatados; nenhuma interação foi testada em navegador.

A referência orienta a ambição de profundidade e descoberta. A estrutura da Borderline.Dev é uma proposta própria: cada interação demonstra uma capacidade contratável. Não copiar textos, modelos, imagens ou organização institucional da referência.

## Critério criativo

Cada capítulo deve responder:

1. O que vejo antes de descobrir qualquer gesto?
2. O que posso fazer em poucos segundos?
3. O que muda por causa dessa ação?
4. Que capacidade técnica isso prova?
5. Em qual projeto da agência essa capacidade se aplica?

O impacto será avaliado pelo operador. Uma implementação funcional pode precisar de outra rodada visual; uma animação impressionante pode falhar se não comunicar o serviço.
