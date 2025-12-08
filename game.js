class LigarFigurinhas {
  constructor() {
    this.data = null;
    this.difficulty = 'easy';
    this.numPairs = {
      easy: 6,
      medium: 12,
      hard: 16
    };
    this.gameState = {
      leftCards: [],
      rightCards: [],
      selectedLeft: null,
      selectedRight: null,
      matches: 0,
      errors: 0,
      time: 0,
      timerInterval: null,
      isProcessing: false,
      pairs: []
    };
    this.init();
  }

  async init() {
    await this.loadData();
    this.setupEventListeners();
    this.renderRanking();
  }

  async loadData() {
    try {
      const response = await fetch('data.json');
      this.data = await response.json();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.data = { figurinhas: [] };
    }
  }

  setupEventListeners() {
    // Botões de dificuldade
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.difficulty = e.currentTarget.dataset.difficulty;
        this.startGame();
      });
    });

    // Botão menu
    document.getElementById('menu-btn').addEventListener('click', () => this.goToMenu());

    // Modal de vitória
    document.getElementById('play-again').addEventListener('click', () => this.startGame());
    document.getElementById('back-menu').addEventListener('click', () => this.goToMenu());

    // Limpar ranking
    document.getElementById('clear-ranking').addEventListener('click', () => {
      if (confirm('Tem certeza que quer limpar o histórico?')) {
        localStorage.removeItem('ligarFigurinhasRanking');
        this.renderRanking();
      }
    });
  }

  startGame() {
    clearInterval(this.gameState.timerInterval);
    this.switchScreen('game');
    this.resetGameState();
    this.setupBoard();
    this.updateStats();
    this.startTimer();
  }

  resetGameState() {
    this.gameState = {
      leftCards: [],
      rightCards: [],
      selectedLeft: null,
      selectedRight: null,
      matches: 0,
      errors: 0,
      time: 0,
      timerInterval: null,
      isProcessing: false,
      pairs: []
    };
  }

  setupBoard() {
    const numPairs = this.numPairs[this.difficulty];
    
    // Selecionar figurinhas aleatoriamente
    let selectedCharacters = this.data.figurinhas
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs);

    this.gameState.pairs = selectedCharacters.map(char => char.id);

    // Calcular número de colunas dinamicamente
    let columns = 4;
    if (numPairs === 6) columns = 3;
    if (numPairs === 12) columns = 4;
    if (numPairs === 18) columns = 4;

    // Criar cartas da esquerda (figurinhas)
    const leftBoard = document.getElementById('left-board');
    leftBoard.innerHTML = '';
    leftBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    selectedCharacters.forEach((character, index) => {
      const card = document.createElement('button');
      card.className = 'card';
      card.dataset.id = character.id;
      card.dataset.index = index;
      card.innerHTML = `<img src="${character.imagem}" alt="${character.nome}">`;
      card.addEventListener('click', () => this.selectLeft(card, character));
      leftBoard.appendChild(card);
      this.gameState.leftCards.push(card);
    });

    // Criar cartas da direita (nomes) - embaralhadas
    const rightBoard = document.getElementById('right-board');
    rightBoard.innerHTML = '';
    rightBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    let shuffled = [...selectedCharacters];
    this.shuffleArray(shuffled);

    shuffled.forEach((character, index) => {
      const card = document.createElement('button');
      card.className = 'card name-card';
      card.dataset.id = character.id;
      card.dataset.index = index;
      
      // Criar elemento para o texto do nome
      const nameText = document.createElement('span');
      nameText.className = 'name-text';
      nameText.textContent = character.nome;
      card.appendChild(nameText);
      
      card.addEventListener('click', () => this.selectRight(card, character));
      rightBoard.appendChild(card);
      this.gameState.rightCards.push(card);
    });

    // Atualizar label de dificuldade
    const labels = {
      easy: '🟢 Fácil (6 pares)',
      medium: '🟡 Médio (12 pares)',
      hard: '🔴 Difícil (18 pares)'
    };
    document.getElementById('difficulty-label').textContent = labels[this.difficulty];

    // Aplicar classe para modo fácil (ajuste de layout)
    const gameContainer = document.querySelector('.game-container');
    if (this.difficulty === 'easy') {
      gameContainer.classList.add('easy-mode');
    } else {
      gameContainer.classList.remove('easy-mode');
    }
  }

  selectLeft(card, character) {
    // Não permitir seleção se:
    // - Já há uma seleção à esquerda
    // - A carta já está combinada
    // - O jogo está processando
    if (this.gameState.isProcessing || card.classList.contains('matched')) return;
    
    // Se já há uma seleção à esquerda e é uma carta diferente, não fazer nada
    if (this.gameState.selectedLeft && this.gameState.selectedLeft !== card) return;

    // Se a mesma carta é clicada novamente, desselecionar
    if (this.gameState.selectedLeft === card) {
      card.classList.remove('selected', 'flipped');
      this.gameState.selectedLeft = null;
      return;
    }

    card.classList.add('flipped', 'selected');
    this.gameState.selectedLeft = card;

    if (this.gameState.selectedRight) {
      this.checkMatch();
    }
  }

  selectRight(card, character) {
    // Não permitir seleção se:
    // - Já há uma seleção à direita
    // - A carta já está combinada
    // - O jogo está processando
    if (this.gameState.isProcessing || card.classList.contains('matched')) return;
    
    // Se já há uma seleção à direita e é uma carta diferente, não fazer nada
    if (this.gameState.selectedRight && this.gameState.selectedRight !== card) return;

    // Se a mesma carta é clicada novamente, desselecionar
    if (this.gameState.selectedRight === card) {
      card.classList.remove('selected', 'flipped');
      this.gameState.selectedRight = null;
      return;
    }

    card.classList.add('flipped', 'selected');
    this.gameState.selectedRight = card;

    if (this.gameState.selectedLeft) {
      this.checkMatch();
    }
  }

  checkMatch() {
    this.gameState.isProcessing = true;
    const leftId = parseInt(this.gameState.selectedLeft.dataset.id);
    const rightId = parseInt(this.gameState.selectedRight.dataset.id);
    const isMatch = leftId === rightId;

    setTimeout(() => {
      if (isMatch) {
        this.handleMatch();
      } else {
        this.handleMismatch();
      }
    }, 600);
  }

  handleMatch() {
    this.gameState.selectedLeft.classList.add('matched');
    this.gameState.selectedRight.classList.add('matched');
    this.gameState.matches++;

    this.showMessage(`✨ Acerto! ${this.gameState.matches} de ${this.gameState.pairs.length}`, 'success');

    // Remover as classes flipped e selected para mostrar a imagem de acerto
    this.gameState.selectedLeft.classList.remove('selected', 'flipped');
    this.gameState.selectedRight.classList.remove('selected', 'flipped');
    this.gameState.selectedLeft = null;
    this.gameState.selectedRight = null;
    this.gameState.isProcessing = false;

    this.updateStats();

    if (this.gameState.matches === this.gameState.pairs.length) {
      this.endGame();
    }
  }

  handleMismatch() {
    this.gameState.errors++;
    this.showMessage(`❌ Errado! Tente novamente.`, 'error');

    this.gameState.selectedLeft.classList.add('incorrect');
    this.gameState.selectedRight.classList.add('incorrect');

    setTimeout(() => {
      this.gameState.selectedLeft.classList.remove('flipped', 'selected');
      this.gameState.selectedRight.classList.remove('flipped', 'selected');
      
      // Remover a classe incorrect depois que a animação de shake terminar
      setTimeout(() => {
        this.gameState.selectedLeft.classList.remove('incorrect');
        this.gameState.selectedRight.classList.remove('incorrect');
        this.gameState.selectedLeft = null;
        this.gameState.selectedRight = null;
        this.gameState.isProcessing = false;
      }, 500);
    }, 600);

    this.updateStats();
  }

  showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
  }

  updateStats() {
    document.getElementById('timer').textContent = this.formatTime(this.gameState.time);
    document.getElementById('matches').textContent = this.gameState.matches;
    document.getElementById('errors').textContent = this.gameState.errors;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startTimer() {
    this.gameState.timerInterval = setInterval(() => {
      this.gameState.time++;
      this.updateStats();
    }, 1000);
  }

  endGame() {
    clearInterval(this.gameState.timerInterval);
    const score = this.calculateScore();
    this.saveRanking(score);
    this.showWinModal(score);
  }

  calculateScore() {
    const basePts = 1000;
    const timeBonus = Math.max(0, 300 - this.gameState.time);
    const errorPenalty = this.gameState.errors * 50;
    const score = basePts + timeBonus - errorPenalty;
    return Math.max(0, Math.round(score));
  }

  saveRanking(score) {
    let ranking = JSON.parse(localStorage.getItem('ligarFigurinhasRanking') || '[]');
    ranking.push({
      score,
      time: this.gameState.time,
      matches: this.gameState.matches,
      errors: this.gameState.errors,
      difficulty: this.difficulty,
      date: new Date().toLocaleDateString('pt-BR')
    });
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 50);
    localStorage.setItem('ligarFigurinhasRanking', JSON.stringify(ranking));
  }

  renderRanking() {
    const ranking = JSON.parse(localStorage.getItem('ligarFigurinhasRanking') || '[]');
    const top3 = ranking.slice(0, 3);
    const container = document.getElementById('ranking-list');

    if (top3.length === 0) {
      container.innerHTML = '<p>Nenhum recorde ainda...</p>';
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    container.innerHTML = top3
      .map((item, idx) => `
        <div class="ranking-item">
          <span class="medal">${medals[idx]}</span>
          <div class="info">
            <span>${item.date}</span> - 
            <span>${item.difficulty === 'easy' ? '🟢' : item.difficulty === 'medium' ? '🟡' : '🔴'}</span>
          </div>
          <span class="score">${item.score} pts</span>
        </div>
      `)
      .join('');
  }

  showWinModal(score) {
    document.getElementById('final-time').textContent = this.formatTime(this.gameState.time);
    document.getElementById('final-matches').textContent = this.gameState.matches;
    document.getElementById('final-errors').textContent = this.gameState.errors;
    document.getElementById('final-score').textContent = score;

    const winModal = document.getElementById('win-modal');
    winModal.classList.remove('hidden');
  }

  switchScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screen).classList.add('active');
    
    // Fechar modal quando mudar de tela
    const winModal = document.getElementById('win-modal');
    if (winModal) {
      winModal.classList.add('hidden');
    }
  }

  goToMenu() {
    clearInterval(this.gameState.timerInterval);
    this.switchScreen('menu');
    this.renderRanking();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

// Inicializar o jogo quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new LigarFigurinhas();
});
