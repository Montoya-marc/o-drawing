const { createServer } = require('http');

require('dotenv').config();

const path = require('path');
const express = require('express');
const { Server: SocketServer } = require('socket.io');
const { createSocket } = require('dgram');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, './public')));

// Au moment de créer le serveur HTTP on lui forni l'application Express
const httpServer = createServer(app);

// On se sert de ce serveur HTTP pour créer un serveur Socket.io
const ioServer = new SocketServer(httpServer);

// les métodes on au niveau de Node.js sont l'equivaleent de addEventListener au niveau du DOM
// l'évenement 'connection' est émis par le serveur socket.io
let connectedUsers = 0;

ioServer.on('connection', (socket) => {
    console.log('New client connected');
    connectedUsers += 1;
    console.log(`Nombre d'utilisateurs : ${connectedUsers}`);

    // émission d'un évenement au client que l'on nomme de façon arbitraire 'connected'
    // Si le client veut pouvoir recevoir cet évenement il doit écouter un évenement du même nom
    socket.emit('message', `Vous êtes bien connecté au serveur, vous êtes le client numéro ${connectedUsers}`);

    // Comme le client va émettre, lui aussi un évenement, on va écouter cet évenement
    socket.on('draw', (data) => {
        console.log(data);
        // On émet un évenement à tous les clients connectés pour leur retransmettre les données
        // sauf a celui qui a émis l'évenement principal

        // on va les diffuser (broadcast)
        socket.broadcast.emit('draw', data);

        // Si on voulais lui parler à lui directement on aurait utilisé emit
        socket.emit('message', 'Merci pour votre dessin');
    });

    socket.on('disconnect', () => {
        connectedUsers -= 1;
        console.log('Client disconnected');
        console.log(`Nombre d'utilisateurs : ${connectedUsers}`);
    });
});

httpServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
