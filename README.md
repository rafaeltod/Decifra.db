# 🎮 Decifra.db - Jogo da Memória

Um jogo interativo e divertido desenvolvido com HTML, CSS e JavaScript puro.

**Desenvolvido por:** 5 alunos de INFOWEB Matutino no IFRN CNAT, no 4° Ano do Ensino Médio Técnico Integrado.

## 📋 Características

- ✨ **Interface moderna e responsiva** - Design elegante com gradientes
- 🎨 **Emojis** - 8 pares diferentes de emojis temáticos
- ⏱️ **Cronômetro** - Acompanhe o tempo de jogo
- 📊 **Contador de jogadas** - Veja quantas tentativas você fez
- 🎯 **Rastreamento de pares** - Veja o progresso do jogo
- 📱 **Design responsivo** - Funciona perfeitamente em celulares e tablets
- 🎯 **Reiniciar jogo** - Botão para começar uma nova partida a qualquer momento

## 🎮 Como Jogar

1. Clique nas cartas viradas para revelar os emojis
2. Tente encontrar pares correspondentes
3. Se os dois emojis forem iguais, a carta permanece virada (matched)
4. Se forem diferentes, a carta se vira novamente
5. Complete todos os 8 pares para ganhar!

**Objetivo:** Encontrar todos os pares com o menor número de jogadas possível!

## 🚀 Como Usar

### Abrir o jogo localmente

1. Clone ou baixe este repositório
2. Abra um terminal na pasta do projeto
3. Inicie um servidor HTTP:

```bash
python3 -m http.server 8000
```

4. Abra seu navegador e acesse: `http://localhost:8000`

Alternativas para iniciar o servidor:
```bash
# Usando Node.js
npx http-server

# Usando PHP
php -S localhost:8000

# Usando live-server (Global)
live-server
```

## 📁 Estrutura do Projeto

```
.
├── index.html      # Arquivo HTML principal
├── style.css       # Estilos e animações
├── script.js       # Lógica do jogo
├── README.md       # Este arquivo
└── images/         # Pasta para imagens/figurinhas
```

## 🎨 Personalizações

### Mudar os emojis

Edite o arquivo `script.js` e procure por:

```javascript
this.emojis = ['🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺', '🎻'];
```

Substitua pelos emojis que desejar. Mantenha exatamente 8 pares!

### Mudar as cores

Edite o arquivo `style.css` para alterar as cores do gradiente:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 🖥️ Navegadores Suportados

- Chrome/Chromium
- Firefox
- Safari
- Edge
- Qualquer navegador moderno que suporte ES6+

## 📦 Dependências

Nenhuma! O jogo usa apenas HTML, CSS e JavaScript puro.

## 💡 Dicas

- Tente memorizar a posição dos emojis para jogadas mais rápidas
- Procure fazer pares com o menor número de tentativas possível
- Desafie amigos a bater seu tempo!

## 📝 Licença

Livre para usar, modificar e distribuir.

---

**Desenvolvido com ❤️ em JavaScript Puro**
