let socket = null;
let currentPlayerId = null;
let currentRoomCode = null;
let players = [];

function connect() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Conectado al servidor');
    });
    
    socket.on('message', (data) => {
        handleMessage(data);
    });
    
    socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
        showNotification('Error de conexión', 'error');
    });
    
    socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        showNotification('Desconectado del servidor', 'error');
    });
}

function handleMessage(data) {
    switch (data.type) {
        case 'roomCreated':
            currentRoomCode = data.roomCode;
            currentPlayerId = data.playerId;
            document.getElementById('roomCodeDisplay').textContent = data.roomCode;
            document.getElementById('roomInfo').style.display = 'block';
            showScreen('gameScreen');
            showNotification(`Sala creada: ${data.roomCode}`, 'success');
            break;
            
        case 'roomJoined':
            currentRoomCode = data.roomCode;
            currentPlayerId = data.playerId;
            document.getElementById('roomCodeDisplay').textContent = data.roomCode;
            document.getElementById('roomInfo').style.display = 'block';
            showScreen('gameScreen');
            showNotification('Te has unido a la sala', 'success');
            break;
            
        case 'roomState':
            players = data.players;
            updatePlayersList();
            updateTargetPlayerSelect();
            break;
            
        case 'numberSet':
            document.getElementById('numberSetSection').style.display = 'none';
            document.getElementById('numberConfirmed').style.display = 'block';
            showNotification(data.message, 'success');
            break;
            
        case 'guessResult':
            addGuessToHistory(data);
            document.getElementById('guessNumber').value = '';
            
            if (data.bulls === 4) {
                showNotification('¡Adivinaste el número!', 'success');
            } else {
                showNotification(`Bulls: ${data.bulls}, Cows: ${data.cows}`, 'info');
            }
            break;
            
        case 'gameWon':
            showWinModal(data);
            break;
            
        case 'error':
            showNotification(data.message, 'error');
            break;
    }
}

function createRoom() {
    const playerName = document.getElementById('playerName').value.trim();
    
    if (!playerName) {
        showNotification('Por favor ingresa tu nombre', 'error');
        return;
    }
    
    connect();
    
    setTimeout(() => {
        if (socket && socket.connected) {
            socket.emit('createRoom', {
                playerName: playerName
            });
        }
    }, 500);
}

function showJoinRoom() {
    document.getElementById('joinRoomSection').style.display = 'block';
}

function joinRoom() {
    const playerName = document.getElementById('playerName').value.trim();
    const roomCode = document.getElementById('roomCodeInput').value.trim().toUpperCase();
    
    if (!playerName) {
        showNotification('Por favor ingresa tu nombre', 'error');
        return;
    }
    
    if (!roomCode) {
        showNotification('Por favor ingresa el código de sala', 'error');
        return;
    }
    
    connect();
    
    setTimeout(() => {
        if (socket && socket.connected) {
            socket.emit('joinRoom', {
                playerName: playerName,
                roomCode: roomCode
            });
        }
    }, 500);
}

function setSecretNumber() {
    const number = document.getElementById('secretNumber').value.trim();
    
    if (!validateNumberInput(number)) {
        showNotification('Número inválido. Debe tener 4 dígitos sin repetir (0-9)', 'error');
        return;
    }
    
    socket.emit('setNumber', {
        number: number
    });
}

function makeGuess() {
    const targetPlayerId = document.getElementById('targetPlayer').value;
    const guess = document.getElementById('guessNumber').value.trim();
    
    if (!targetPlayerId) {
        showNotification('Selecciona un jugador objetivo', 'error');
        return;
    }
    
    if (targetPlayerId === currentPlayerId) {
        showNotification('No puedes adivinar tu propio número', 'error');
        return;
    }
    
    if (!validateNumberInput(guess)) {
        showNotification('Número inválido. Debe tener 4 dígitos sin repetir (0-9)', 'error');
        return;
    }
    
    socket.emit('makeGuess', {
        targetPlayerId: targetPlayerId,
        guess: guess
    });
}

function validateNumberInput(number) {
    if (!/^\d{4}$/.test(number)) {
        return false;
    }
    
    const digits = new Set(number.split(''));
    return digits.size === 4;
}

function updatePlayersList() {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    players.forEach(player => {
        const badge = document.createElement('div');
        badge.className = `player-badge ${player.hasNumber ? 'has-number' : ''}`;
        badge.innerHTML = `
            <span class="status-dot"></span>
            <span>${player.name}${player.id === currentPlayerId ? ' (Tú)' : ''}</span>
        `;
        playersList.appendChild(badge);
    });
}

function updateTargetPlayerSelect() {
    const select = document.getElementById('targetPlayer');
    select.innerHTML = '<option value="">Selecciona un jugador</option>';
    
    players.forEach(player => {
        if (player.id !== currentPlayerId && player.hasNumber) {
            const option = document.createElement('option');
            option.value = player.id;
            option.textContent = player.name;
            select.appendChild(option);
        }
    });
}

function addGuessToHistory(data) {
    const history = document.getElementById('guessHistory');
    const item = document.createElement('div');
    item.className = `guess-item ${data.bulls === 4 ? 'correct' : ''}`;
    
    item.innerHTML = `
        <div class="guess-info">
            <div class="guess-number">${data.guess}</div>
            <div class="guess-target">vs ${data.targetPlayerName}</div>
        </div>
        <div class="guess-hints">
            <div class="hint-badge bulls">🎯 ${data.bulls}</div>
            <div class="hint-badge cows">🐮 ${data.cows}</div>
        </div>
    `;
    
    history.insertBefore(item, history.firstChild);
}

function showWinModal(data) {
    const modal = document.getElementById('winModal');
    const message = document.getElementById('winMessage');
    
    message.textContent = `${data.winner} ha adivinado el número de ${data.targetPlayer}: ${data.number}`;
    modal.classList.add('active');
}

function closeWinModal() {
    document.getElementById('winModal').classList.remove('active');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', () => {
    const secretNumberInput = document.getElementById('secretNumber');
    const guessNumberInput = document.getElementById('guessNumber');
    
    [secretNumberInput, guessNumberInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    });
    
    // Enter para enviar
    document.getElementById('playerName')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createRoom();
    });
    
    document.getElementById('roomCodeInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinRoom();
    });
    
    document.getElementById('secretNumber')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') setSecretNumber();
    });
    
    document.getElementById('guessNumber')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') makeGuess();
    });
});
