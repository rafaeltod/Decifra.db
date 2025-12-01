class MemoryGame {
  constructor() {
    this.board = document.getElementById('board');
    this.restartBtn = document.getElementById('restart');
    this.movesDisplay = document.getElementById('moves');
    this.timerDisplay = document.getElementById('timer');
    this.pairsDisplay = document.getElementById('pairs');
    this.messageDisplay = document.getElementById('message');

    this.cards = [];
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.time = 0;
    this.timerInterval = null;
    this.isProcessing = false;

    this.emojis = ['🎨', '🎭', '🎪', '🎬', '🎸', '🎹', '🎺', '🎻'];

    this.init();
  }

  init() {
    this.board.innerHTML = '';
    this.cards = [];
    this.flipped = [];
    this.matched = [];
    this.moves = 0;
    this.time = 0;
    this.isProcessing = false;

    clearInterval(this.timerInterval);
    this.updateDisplay();

    const gameCards = [...this.emojis, ...this.emojis];
    this.shuffleArray(gameCards);

    gameCards.forEach((emoji, index) => {
      const card = document.createElement('button');
      card.classList.add('card');
      card.dataset.emoji = emoji;
      card.dataset.index = index;
      card.addEventListener('click', () => this.flipCard(card));
      this.board.appendChild(card);
      this.cards.push(card);
    });

    this.messageDisplay.textContent = '';
    this.startTimer();
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  flipCard(card) {
    if (this.isProcessing || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    this.flipped.push(card);

    if (this.flipped.length === 2) {
      this.isProcessing = true;
      this.moves++;
      this.updateDisplay();
      this.checkMatch();
    }
  }

  checkMatch() {
    const [card1, card2] = this.flipped;
    const isMatch = card1.dataset.emoji === card2.dataset.emoji;

    setTimeout(() => {
      if (isMatch) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.matched.push(card1, card2);
        this.flipped = [];
        this.isProcessing = false;

        this.updateDisplay();

        if (this.matched.length === this.cards.length) {
          this.endGame();
        }
      } else {
        card1.classList.add('error');
        card2.classList.add('error');
        setTimeout(() => {
          card1.classList.remove('flipped', 'error');
          card2.classList.remove('flipped', 'error');
          card1.textContent = '';
          card2.textContent = '';
          this.flipped = [];
          this.isProcessing = false;
        }, 600);
      }
    }, 600);
  }

  updateDisplay() {
    this.movesDisplay.textContent = this.moves;
    this.timerDisplay.textContent = this.formatTime(this.time);
    const pairsFound = this.matched.length / 2;
    this.pairsDisplay.textContent = `${pairsFound}/${this.emojis.length}`;
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.time++;
      this.updateDisplay();
    }, 1000);
  }

  endGame() {
    clearInterval(this.timerInterval);
    this.messageDisplay.classList.add('success');
    this.messageDisplay.textContent = `🎉 Parabéns! Você completou em ${this.moves} jogadas e ${this.formatTime(this.time)}!`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  let game = new MemoryGame();

  document.getElementById('restart').addEventListener('click', () => {
    game = new MemoryGame();
  });
});
