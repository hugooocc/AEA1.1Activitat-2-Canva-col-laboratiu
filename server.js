const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const usuarios = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

function colorAleatorio() {
    const tono = Math.floor(Math.random() * 360);
    return `hsl(${tono}, 80%, 50%)`;
}

io.on('connection', (socket) => {
    console.log('Se ha conectado:', socket.id);

    socket.on('nuevoUsuario', (nombre) => {
        usuarios[socket.id] = {
            nombre: nombre,
            x: 0,
            y: 0,
            color: colorAleatorio()
        };
        console.log(usuarios);
        io.emit('usuarios', usuarios);
    });

    socket.on('disconnect', () => {
        delete usuarios[socket.id];
        console.log(usuarios);
        io.emit('usuarios', usuarios);
    });

    socket.on('mover', (pos) => {
        if (!usuarios[socket.id]) return;
        usuarios[socket.id].x = pos.x;
        usuarios[socket.id].y = pos.y;
        io.emit('usuarios', usuarios);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
