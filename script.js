const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const timeEl = document.getElementById('time');
const overlay = document.getElementById('overlay');
const popupMessage = document.getElementById('popup-message');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let startTime = Date.now();

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
];

function renderBoard() {
    boardEl.innerHTML = '';
    board.forEach((cell, index) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.innerText = cell || '';
        cellEl.onclick = () => makeMove(index);
        boardEl.appendChild(cellEl);
    });
}

function makeMove(index) {
    if (!gameActive || board[index]) return;
    board[index] = currentPlayer;
    renderBoard();
    checkWinner();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusEl.innerText = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            gameActive = false;
            showPopup(`🎉 Player ${board[a]} wins!`);
            const cells = document.querySelectorAll('.cell');
            pattern.forEach(i => cells[i].classList.add('winner'));
            showTime();
            return;
        }
    }
    if (!board.includes(null)) {
        gameActive = false;
        showPopup("🤝 It's a Draw!");
        showTime();
    }
}

function resetGame() {
    if (confettiTimeout) clearTimeout(confettiTimeout);
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusEl.innerText = `Player ${currentPlayer}'s turn`;
    startTime = Date.now();
    renderBoard();
    timeEl.innerText = '';
    overlay.style.display = 'none';
}

function showTime() {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    timeEl.innerText = `⏱ Time taken: ${duration} seconds`;
}

let confettiTimeout;
function showPopup(message) {
    popupMessage.innerText = message;
    overlay.style.display = 'flex';

    // Launch confetti
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#bb0000', '#ffffff', '#00ff00', '#0000ff'],
    });

    // Optional: burst effect
    confettiTimeout = setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.4 },
        });
    }, 500);
}




const auroraCanvas = document.getElementById('aurora-bg');
const auroraCtx = auroraCanvas.getContext('2d');

function resizeAuroraCanvas() {
    auroraCanvas.width = window.innerWidth;
    auroraCanvas.height = window.innerHeight;
}
resizeAuroraCanvas();
window.addEventListener('resize', resizeAuroraCanvas);

let t = 0;
let waveAmplitude = 1;

function drawAurora() {
    const w = auroraCanvas.width;
    const h = auroraCanvas.height;
    auroraCtx.clearRect(0, 0, w, h);

    for (let i = 0; i < 3; i++) {
        auroraCtx.beginPath();
        for (let x = 0; x < w; x++) {
            const y = h / 2
                + Math.sin(x * 0.008 + t + i) * (60 * waveAmplitude)
                + Math.sin(x * 0.01 + t * 1.5) * (25 * waveAmplitude);
            if (x === 0) auroraCtx.moveTo(x, y);
            else auroraCtx.lineTo(x, y);
        }
        const gradient = auroraCtx.createLinearGradient(0, h / 2 - 60, 0, h / 2 + 60);
        gradient.addColorStop(0, `hsla(${180 + i * 40}, 100%, 70%, 0.3)`);
        gradient.addColorStop(1, `hsla(${240 + i * 20}, 100%, 50%, 0.2)`);
        auroraCtx.strokeStyle = gradient;
        auroraCtx.lineWidth = 2.5;
        auroraCtx.stroke();
    }

    // Gradually ease amplitude back to 1
    waveAmplitude += (1 - waveAmplitude) * 0.05;

    t += 0.01;
    requestAnimationFrame(drawAurora);
}
drawAurora();

// Mouse reactive glow
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function drawMouseLight() {
    const radius = 100;
    const gradient = auroraCtx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, radius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    auroraCtx.fillStyle = gradient;
    auroraCtx.fillRect(0, 0, auroraCanvas.width, auroraCanvas.height);

    requestAnimationFrame(drawMouseLight);
}
drawMouseLight();

// 📌 On click: spike the amplitude
document.addEventListener('click', () => {
    waveAmplitude = 1.8;
});

resetGame();