import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Game } from './game';
import { Player } from './player';
import { IncomingMessage } from './message';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const game = new Game();

function parseMessage(data: string): IncomingMessage {
    try {
        return JSON.parse(data);
    } catch {
        return { type: null, payload: data } as any;
    }
}

wss.on('connection', (ws: WebSocket) => {
    const player = new Player(ws);
    game.addPlayer(player);

    ws.on('message', (message: string) => {
        console.log('Received:', { source: player.getSerializable(), message });
        game.onMessage(player, parseMessage(message));
    });
    ws.on('close', () => {
        game.removePlayer(player);
    })
});

app.use(express.static('./client/build'));

server.listen(9000, () => {
    console.log(`Server started on port ${9000} :)`);
});