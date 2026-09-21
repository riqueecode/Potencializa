# Correção do sistema de vídeos

## Escopo e estado inicial

Nenhum commit, push ou deploy foi feito. `.env`, credenciais, token, backend, filtro REELS e ordenação da API não foram alterados. Os MOV/MP4 originais foram preservados, inclusive os arquivos corrompidos. As alterações locais preexistentes em `media.js`, os três MP4 não rastreados e `.verification/optimize-videos.cjs` não foram descartados.

O workspace tinha **14 entradas**, não 11. A lista original vinha de `import.meta.glob` de MP4, ordenada com `localeCompare`. A ordem foi confirmada no catálogo efetivamente carregado pelo navegador antes da edição e está registrada em `.verification/video-baseline.json`.

| Posição original / ID preservado | Arquivo original em `src/assets/VideoPortfolios/` | Posição final / tratamento |
| --- | --- | --- |
| 1 / `portfolio-1` | `copy_03E91B91-0B23-455A-84CB-C080C092C19B.mp4` | 1; preservado |
| 2 / `portfolio-2` | `Depoimento Edilaine .mp4` | removido somente da lista do Portfólio |
| 3 / `portfolio-3` | `Depoimento Elaine .mp4` | 2; fonte íntegra equivalente de Depoimentos |
| 4 / `portfolio-4` | `portfolio-1.mp4` | 3; preservado, mesmo conteúdo visual do original 1 |
| 5 / `portfolio-5` | `portfolio-2.mp4` | 4; nova codificação do MOV original |
| 6 / `portfolio-6` | `portfolio-3.mp4` | 5; preservado |
| 7 / `portfolio-7` | `portfolio-4.mp4` | 6; preservado |
| 8 / `portfolio-8` | `portfolio-5.mp4` | 7; preservado |
| 9 / `portfolio-9` | `portfolio-6.mp4` | 8; preservado |
| 10 / `portfolio-10` | `Vídeo 1 .mp4` | 9; preservado |
| 11 / `portfolio-11` | `Vídeo 2.mp4` | 10; poster explícito |
| 12 / `portfolio-12` | `Vídeo 3 .mp4` | 11; preservado |
| 13 / `portfolio-13` | `Vídeo 6 .mp4` | 12; preservado |
| 14 / `portfolio-14` | `Vídeo 8 mp4.mp4` | 13; preservado |

Os IDs agora são explícitos e não mudam quando uma entrada é removida. O carrossel inicia na segunda entrada da nova lista: `portfolio-3` (Elaine). A seção Depoimentos conserva seus três vídeos e fontes: `depoimento-edilaine.mp4`, `depoimento-elaine.mp4` e `depoimento-iracelma.mp4`.

## Diagnóstico e assets

**Original 3 / Elaine:** o arquivo de 4.194.352 bytes estava incompleto. FFprobe: `moov atom not found`; Chrome: `DEMUXER_ERROR_COULD_NOT_OPEN`, sem dimensões e sem avanço do tempo. Não era apenas um poster ou um caminho errado. Os MOV `VideoPortfolios/Depoimento Elaine .mov` e `Depoimentos/Depoimento Elaine .mov` têm SHA-256 idêntico: `9B3B9043F6CAB3B9B8FF08B33CDB79CF52F261F8EC3595AF23A5DCBBACB05979`. Por isso foi reutilizado `Depoimentos/depoimento-elaine.mp4`, versão H.264/AAC íntegra do mesmo conteúdo, 1080 × 1920, 52,2 s. O MP4 incompleto não foi apagado e não é importado no build.

O poster de Elaine é `VideoPortfolios/posters/depoimento-elaine.jpg`, extraído aos 2 s do próprio MOV original. Ele não veio dos vídeos 1 ou 4.

**Original 11:** `Vídeo 2.mp4` já decodificava, mas o resolvedor por nome não encontrava poster. Foi criado `VideoPortfolios/posters/video-2.jpg`, aos 2 s desse próprio MP4, associado explicitamente ao ID `portfolio-11`.

**Original 5:** a auditoria encontrou corrupção adicional em `portfolio-2.mp4`: NAL units inválidas e erro de decodificação AAC no Chrome. O MOV correspondente `Vídeo 4 .mov` (nome com acento decomposto) foi recodificado integralmente como `web/portfolio-video4-web.mp4`, H.264, yuv420p, AAC 128 kbps, 720 × 1280, CRF 21 e faststart. O original foi preservado. O poster existente `portfolio-2.jpg` foi preservado; a comparação visual com um frame da nova versão confirmou o mesmo conteúdo.

Os vídeos originais 1 e 4 são codificações diferentes do mesmo conteúdo visual, ambos com 63,6667 s; os hashes dos MP4 diferem. A inspeção dos frames confirmou a repetição. Nenhum deles foi usado como Elaine.

Novos assets de produção (todos sob `src/assets/VideoPortfolios/`):

- `web/portfolio-video4-web.mp4`.
- `posters/copy-original.jpg`.
- `posters/depoimento-elaine.jpg`.
- `posters/portfolio-1.jpg`.
- `posters/portfolio-4.jpg`.
- `posters/portfolio-5.jpg`.
- `posters/portfolio-6.jpg`.
- `posters/video-1.jpg`.
- `posters/video-2.jpg`.
- `posters/video-3.jpg`.
- `posters/video-6.jpg`.
- `posters/video-8.jpg`.

Os 11 novos JPEG têm 720 px de largura e aproximadamente 22–242 KB. Posters existentes funcionais foram mantidos. A folha `.verification/poster-audit.png` foi inspecionada visualmente.

## Componentes e comportamento

| Responsabilidade | Arquivo |
| --- | --- |
| Catálogo e associação de fontes/posters | `src/data/media.js` |
| Seções Portfólio e Depoimentos | `src/components/SocialProof/SocialProof.jsx` (sem alteração) |
| Busca e seção Reels / CTA | `src/components/Reels/Reels.jsx` (sem alteração) |
| Normalização dos dados da API | `src/services/instagram.js` |
| Carrossel e player do card | `src/components/Reels/ReelsCarousel.jsx` |
| Modal e coordenação de pausa | `src/components/Reels/VideoModal.jsx` (novo) |
| Aparência e dimensões dos players | `src/components/Reels/ReelsCarousel.css` |
| Backend Instagram | `server/index.js`, `server/services/instagram.js` (sem alteração) |

O botão de reprodução cobre toda a área do vídeo. O ícone central é um elemento visual dentro desse único botão, evitando dois handlers para a mesma ação. Enter/Espaço funcionam pela semântica de botão. Clicar/tocar durante a reprodução pausa. A expansão é um botão separado e sempre visível, inclusive no celular. Os cards não têm controles nativos nem autoplay. Quando há poster/thumbnail, o vídeo carrega sob demanda (`preload="none"`), evitando carregar todos os decodificadores na abertura da página. Ao desmontar o modal, sua fonte é removida e `load()` libera o pipeline de mídia, além da pausa explícita.

O carrossel é implementado com scroll-snap e Pointer Events, não com Swiper. Movimento maior que 8 px marca arrasto; o mouse usa captura do ponteiro, e o toque conserva o scroll nativo. `pointercancel` também invalida o clique. A supressão depende do gesto, não de atrasos arbitrários. Setas, links e expansão não disparam o play do card. Primeiro/último item e início na segunda entrada são preservados.

O modal é um `<dialog>` com `showModal()`, renderizado por React Portal diretamente em `document.body`. Usa `position: fixed; inset: 0`, viewport com `dvh`, fundo escuro e vídeo com `object-fit: contain`. A largura é limitada a `min(90vw, 1280px)` e a altura a `84dvh`. Conteúdos verticais e horizontais cabem sem distorção. O diálogo fica na camada superior nativa, fora de qualquer overflow, transform, tilt ou hover do carrossel. Nenhuma posição do modal usa coordenadas do mouse.

X, Esc e clique/tap no fundo fecham. A pausa é explícita antes de limpar o estado e também no cleanup. O scroll anterior, estilos do body e foco do botão de origem são restaurados. O diálogo nativo mantém o restante da página inerte e o foco dentro dele. Os controles nativos existem apenas no player expandido.

Ao iniciar outro player, os demais são pausados; ao mudar de slide, os não ativos são pausados. A expansão captura tempo/volume/mute/estado de reprodução e pausa os cards antes de criar o player grande. Se o card estava pausado, expandir mantém esse estado; se estava tocando, transfere a reprodução. Eventos `play` enfileirados de players que já foram pausados são ignorados para não interromper o player novo. Falhas de mídia têm mensagem e possibilidade de nova tentativa; Reels com falha mantêm o link de fallback.

Reels usam o `media_url` retornado pela API no mesmo player local. O poster usa `thumbnail_url`; uma URL de MP4 não é usada como imagem. Com `media_url === null`, há thumbnail e link acessível para o permalink, sem criar `<video src={null}>`. Nenhum Reel ou URL temporária foi adicionado ao código do produto. O CTA continua em `https://www.instagram.com/potencializa__/reels/`.

Arquivos de código de produção alterados/criados: `media.js`, `ReelsCarousel.jsx`, `ReelsCarousel.css`, `VideoModal.jsx` e `services/instagram.js`. Foram adicionados scripts de evidência em `.verification/`: `video-baseline.cjs`, `repair-video-assets.cjs`, `poster-audit.cjs`, `video-system.cjs`, `video-interactions.cjs`, `reel-modal-debug.cjs` e `dist-audit.cjs`. O vídeo horizontal em `.verification/` é somente um fixture de teste e não entra no catálogo nem no build.

## Validação

**VERIFICADO NO CÓDIGO:** associação por ID/arquivo estável, ausência de remoções em Depoimentos, Portal fora do carrossel, ausência de posicionamento por mouse, pausa/cleanup, tratamento de null/erro, CTA e integração dinâmica da API, imports processados pelo Vite, preservação do base `/Potencializa/`.

**TESTADO EM EXECUÇÃO:** a rodada final de `.verification/video-system.cjs` terminou com exit code 0, `DESKTOP PASS` e `MOBILE PASS`, contra `http://127.0.0.1:3000/Potencializa/`, com `VIDEO_REAL_HTTP=1`. Nessa rodada não houve interceptação da API: as requisições passaram pelo backend existente e os vídeos vieram da CDN real. Foram **40 reproduções aprovadas**: 20 no desktop e 20 no mobile (13 Portfólio + 3 Depoimentos + 4 Reels em cada viewport).

| Verificação em execução | Resultado |
| --- | --- |
| Desktop 1440 × 1000 | PASS: reprodução, área inteira, pausa e navegação |
| Mobile iPhone 13 emulado, 390 × 664 | PASS: tap, reprodução, swipe sem play acidental |
| Portfólio | 13/13 reproduzidos, posters carregados, frames não pretos, IDs e início na segunda entrada confirmados |
| Depoimentos | 3/3 reproduzidos, quantidade e Edilaine preservados |
| Reels reais | 4/4 com mídia reproduzidos; 1 sem mídia com thumbnail e permalink; CTA preservado |
| Modal, originais 3 e 11, Edilaine e Reel real | PASS em desktop/mobile: Portal/body, centro da viewport, tamanho, contain, estabilidade com mouse/scroll, X/tap, Esc, backdrop, foco, restauração do scroll, fechar e reabrir |
| Unicidade de reprodução | Somente um elemento ativo nos pontos verificados; fechar modal deixa zero ativos |
| Carrossel | Segunda entrada inicial, primeiro/último item, drag e touch sem reprodução acidental |
| Orientação | Vertical cabe; mudança para 844 × 390 mantém o modal dentro da viewport |
| Erros JavaScript | Nenhum `pageerror` na rodada aprovada |
| Build | `npm.cmd run build`: exit code 0; última execução concluída em 24,08 s |
| Preview | Serviu o build nas portas 4173 e 3000; testes finais de API real na 3000 |
| Assets no dist | 35 URLs auditadas, nomes exatos, MIME correto, HTTP 206 e ausência de paths locais |

Evidência específica do **vídeo 3**: desktop avançou a 4,990 s, com 51 frames e 88.975 bytes de áudio decodificados; mobile avançou a 0,344 s, com 15 frames e 11.224 bytes de áudio. Dimensões 1080 × 1920, pixels não pretos, eventos `loadedmetadata`, `loadeddata`, `canplay`, `play` e `playing`. Poster, clique/tap fora do ícone, expansão, fechamento e reabertura passaram.

Evidência específica do **vídeo 11**: desktop avançou a 0,422 s, com 11 frames e 5.432 bytes de áudio; mobile a 0,427 s, com 9 frames e 5.088 bytes. Dimensões 720 × 1280 e pixels não pretos. Poster derivado do próprio vídeo, clique/tap, modal central e pausa ao fechar passaram.

As amostras completas estão em `.verification/video-system-results.json`. Há capturas de modal em `.verification/video-modal-desktop.png` e `.verification/video-modal-mobile.png`. A decodificação e os eventos foram verificados automaticamente; as capturas e a folha de posters também foram inspecionadas visualmente. Rodadas intermediárias encontraram timeouts e motivaram as correções de eventos atrasados, carregamento sob demanda e liberação do modal; não foram contabilizadas como aprovação final.

**Testes complementares no último build:** `.verification/video-interactions.cjs` e `.verification/dist-audit.cjs` concluíram com exit code 0. Passaram em desktop e mobile 320 × 640 / landscape 844 × 390: vídeo horizontal de teste 1280 × 720 com contain, Enter para iniciar, tap para iniciar/fechar, somente um evento de play por ação, pausa entre seções, pausa ao mudar de slide, evento atrasado de vídeo já pausado sem interromper o ativo, ausência de mensagem de erro em modal válido e fallback acessível para mídia nula/HTTP 404. Esses casos de erro e o vídeo horizontal são fixtures controlados; os cinco Reels da rodada principal são dados reais, não fixtures.

O build usa `npm.cmd run build`. O `.env` local não define `VITE_API_URL`; para validar o backend existente foi usada somente uma variável no processo de build: `VITE_API_URL=http://localhost:3001`. Nenhum `.env` foi editado. Essa URL é exclusiva do build local e deve ser substituída pela configuração real do ambiente em qualquer build futuro de publicação.

`npm.cmd run preview -- --host 127.0.0.1` iniciou na porta 4173. O preview adicional na porta 3000 usa uma origem já aceita pelo backend existente, permitindo testar a API de ponta a ponta sem mudar seu CORS. A consulta retornou cinco Reels: quatro com mídia e um com `media_url` nulo.

A auditoria `.verification/dist-audit.json` confirma 35 URLs de mídia, nomes/case exatos, MIME correto e HTTP 206. Os novos posters e a versão web estão presentes. Os MP4 corrompidos não são usados no `dist`. Não há caminhos `C:\\Users\\`, `file://` ou `/src/assets/` no bundle. O Vite resolveu a colisão dos dois posters de Elaine como `depoimento-elaine.jpg` e `depoimento-elaine2.jpg`, cada um com sua URL correta.

**NÃO FOI POSSÍVEL TESTAR:** aparelhos físicos, Safari/WebKit real e Firefox; áudio ouvido por uma pessoa; funcionamento em domínio publicado, pois não houve deploy. Os testes de áudio verificam bytes decodificados, ausência de mute e unicidade de reprodução, não a audição humana. Mobile significa Chrome com viewport, user-agent e eventos touch emulados. Os testes demonstram início e avanço da reprodução; não equivalem a assistir integralmente a todos os vídeos.

Limitações externas: URLs de CDN do Instagram podem expirar ou variar de disponibilidade; permanecem dinâmicas e há fallback para falhas. O ambiente de publicação precisa fornecer sua própria `VITE_API_URL` e CORS correspondente. Os originais corrompidos continuam no workspace para preservação, porém fora das referências de produção.
