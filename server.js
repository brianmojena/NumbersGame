const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['polling'],
  allowEIO3: true
});

app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function validateNumber(number) {
  const str = number.toString();
  if (str.length !== 4) return false;
  const digits = new Set(str.split(''));
  return digits.size === 4;
}

function calculateHints(guess, target) {
  const guessStr = guess.toString();
  const targetStr = target.toString();
  
  let bulls = 0;
  let cows = 0;
  
  for (let i = 0; i < 4; i++) {
    if (guessStr[i] === targetStr[i]) {
      bulls++;
    } else if (targetStr.includes(guessStr[i])) {
      cows++;
    }
  }
  
  return { bulls, cows };
}

function broadcastToRoom(roomCode, message) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  room.players.forEach(player => {
    if (player.socket && player.socket.connected) {
      player.socket.emit('message', message);
    }
  });
}

function sendRoomState(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  
  const players = room.players.map(p => ({
    id: p.id,
    name: p.name,
    hasNumber: !!p.secretNumber,
    guesses: p.guesses
  }));
  
  broadcastToRoom(roomCode, {
    type: 'roomState',
    players: players
  });
}

io.on('connection', (socket) => {
  console.log('Nueva conexión establecida:', socket.id);
  
  socket.on('createRoom', (data) => {
    try {
      const roomCode = generateRoomCode();
      const playerId = Math.random().toString(36).substring(7);
      
      rooms.set(roomCode, {
        code: roomCode,
        players: [{
          id: playerId,
          name: data.playerName,
          socket: socket,
          secretNumber: null,
          guesses: []
        }]
      });
      
      socket.roomCode = roomCode;
      socket.playerId = playerId;
      socket.join(roomCode);
      
      socket.emit('message', {
        type: 'roomCreated',
        roomCode: roomCode,
        playerId: playerId
      });
      
      sendRoomState(roomCode);
    } catch (error) {
      console.error('Error creando sala:', error);
      socket.emit('message', {
        type: 'error',
        message: 'Error creando sala'
      });
    }
  });
  
  socket.on('joinRoom', (data) => {
    try {
      const room = rooms.get(data.roomCode);
      
      if (!room) {
        socket.emit('message', {
          type: 'error',
          message: 'Sala no encontrada'
        });
        return;
      }
      
      const newPlayerId = Math.random().toString(36).substring(7);
      
      room.players.push({
        id: newPlayerId,
        name: data.playerName,
        socket: socket,
        secretNumber: null,
        guesses: []
      });
      
      socket.roomCode = data.roomCode;
      socket.playerId = newPlayerId;
      socket.join(data.roomCode);
      
      socket.emit('message', {
        type: 'roomJoined',
        roomCode: data.roomCode,
        playerId: newPlayerId
      });
      
      sendRoomState(data.roomCode);
    } catch (error) {
      console.error('Error uniéndose a sala:', error);
      socket.emit('message', {
        type: 'error',
        message: 'Error uniéndose a sala'
      });
    }
  });
  
  socket.on('setNumber', (data) => {
    try {
      const roomForNumber = rooms.get(socket.roomCode);
      if (!roomForNumber) return;
      
      if (!validateNumber(data.number)) {
        socket.emit('message', {
          type: 'error',
          message: 'Número inválido. Debe tener 4 dígitos sin repetir.'
        });
        return;
      }
      
      const player = roomForNumber.players.find(p => p.id === socket.playerId);
      if (player) {
        player.secretNumber = data.number;
        socket.emit('message', {
          type: 'numberSet',
          message: 'Número secreto establecido correctamente'
        });
        sendRoomState(socket.roomCode);
      }
    } catch (error) {
      console.error('Error estableciendo número:', error);
      socket.emit('message', {
        type: 'error',
        message: 'Error estableciendo número'
      });
    }
  });
  
  socket.on('makeGuess', (data) => {
    try {
      const roomForGuess = rooms.get(socket.roomCode);
      if (!roomForGuess) return;
      
      if (!validateNumber(data.guess)) {
        socket.emit('message', {
          type: 'error',
          message: 'Número inválido. Debe tener 4 dígitos sin repetir.'
        });
        return;
      }
      
      const targetPlayer = roomForGuess.players.find(p => p.id === data.targetPlayerId);
      const guessingPlayer = roomForGuess.players.find(p => p.id === socket.playerId);
      
      if (!targetPlayer || !targetPlayer.secretNumber) {
        socket.emit('message', {
          type: 'error',
          message: 'El jugador objetivo no ha establecido su número'
        });
        return;
      }
      
      const hints = calculateHints(data.guess, targetPlayer.secretNumber);
      
      const guessRecord = {
        guess: data.guess,
        targetPlayerId: data.targetPlayerId,
        targetPlayerName: targetPlayer.name,
        bulls: hints.bulls,
        cows: hints.cows,
        timestamp: new Date().toISOString()
      };
      
      guessingPlayer.guesses.push(guessRecord);
      
      if (hints.bulls === 4) {
        broadcastToRoom(socket.roomCode, {
          type: 'gameWon',
          winner: guessingPlayer.name,
          targetPlayer: targetPlayer.name,
          number: targetPlayer.secretNumber
        });
      }
      
      socket.emit('message', {
        type: 'guessResult',
        ...guessRecord
      });
      
      sendRoomState(socket.roomCode);
    } catch (error) {
      console.error('Error procesando intento:', error);
      socket.emit('message', {
        type: 'error',
        message: 'Error procesando intento'
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Conexión cerrada:', socket.id);
    
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        room.players = room.players.filter(p => p.socket.id !== socket.id);
        
        if (room.players.length === 0) {
          rooms.delete(socket.roomCode);
        } else {
          sendRoomState(socket.roomCode);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
