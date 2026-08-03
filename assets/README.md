# /assets

## theme.css

Identidade visual compartilhada por todas as páginas do site (BR, AU, livro,
mentoria, workshop, obrigado e o seletor de idioma da raiz).

Ele é carregado **depois** do `<style>` de cada página, então sobrescreve o
visual antigo sem precisar reescrever o HTML. Para mudar cor, fonte ou raio de
borda em todo o site, edite apenas os tokens no bloco `:root` do topo do arquivo.

Paleta:

| Token           | Cor       | Uso                                   |
|-----------------|-----------|---------------------------------------|
| `--af-bg`       | `#080b12` | fundo geral (quase preto azulado)     |
| `--af-surface`  | `#0e1622` | cards e painéis                       |
| `--af-blue`     | `#2f7cf6` | destaque, links, botão do header      |
| `--af-green`    | `#00e05c` | botão principal, preço, checks        |
| `--af-text`     | `#e9eef6` | texto principal                       |

Tipografia: **Poppins** (títulos), **Inter** (texto corrido) e
**JetBrains Mono** (rótulos, botões, preços e letras miúdas).

## Imagens opcionais

Estes dois arquivos são opcionais — se não existirem, o site usa o fundo
gráfico gerado em CSS (malha técnica + brilhos) e as iniciais "AF" no lugar da
foto. Basta soltar os arquivos aqui com exatamente estes nomes:

| Arquivo                  | O que é                        | Recomendação                                  |
|--------------------------|--------------------------------|-----------------------------------------------|
| `assets/hero-bg.jpg`     | foto de fundo do topo das páginas | 1920×1080, imagem **escura** (a página aplica um véu preto por cima), até ~300 KB |
| `assets/alessandro.jpg`  | sua foto na seção "Quem vai te orientar" | retrato vertical ~800×1000, enquadramento do peito para cima; o CSS já converte para preto e branco |
