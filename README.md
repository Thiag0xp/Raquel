# Carta pra Raquel ♥

Site romântico em HTML/CSS/JS puro (sem build, sem dependências).

## Publicar no GitHub Pages
1. Crie um repositório no GitHub (ex.: `carta-raquel`).
2. Envie **todos** os arquivos desta pasta para a raiz do repositório (o `index.html` precisa ficar na raiz).
3. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Em ~1 minuto o site fica em `https://SEU-USUARIO.github.io/carta-raquel/`.

Pelo terminal:
```bash
git init
git add .
git commit -m "Carta pra Raquel"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/carta-raquel.git
git push -u origin main
```

## Personalizar
- `js/script.js` (topo, CONFIG): mensagem inicial, quantidade de corações da missão e WhatsApp para receber a resposta (DDI + número, ex.: `5511999999999`).
- `index.html`: textos das outras telas.
- `music/musica.mp3`: troque o arquivo para mudar a música.

## Observações
- O navegador só libera som depois de um toque; o site tenta tocar ao abrir e, se bloquear, toca no primeiro toque.
- A página tem `noindex` para não aparecer no Google.
