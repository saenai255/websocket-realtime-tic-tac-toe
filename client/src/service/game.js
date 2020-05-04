export const MessageTypes = {
    UPDATE_CONNECTED_PLAYERS: 'Update Connected Players',
    CONNECTED: 'Connected',
    UPDATE_OPEN_ROOMS: 'Update Open Rooms',
    CREATE_ROOM_FAIL: 'Create Room Fail',
    ANNOUNCE_WINNER: 'Announce Winner'
}

export const OutgoingMessageTypes = {
    SET_PLAYER_NAME: 'Set Player Name',
    JOIN_ROOM: 'Join Room',
    CREATE_ROOM: 'Create Room',
    LEAVE_ROOM: 'Leave Room',
    SET_MOVE: 'Set Move',
    START_GAME: 'Start Game'
}

export class Game {
    socket = null;
    events = [];

    connect() {
        this.socket = new WebSocket(process.env.REACT_APP_SOCKET_URL || ('ws://' + window.location.host));
        this.socket.onmessage = this.onMessage.bind(this);
    }

    onMessage(message) {
        const { type, payload } = JSON.parse(message.data);

        const event = this.events.find(event => event.type === type);

        if (!event) {
            console.error('Unrecognized message:', { type, payload });
            return;
        }

        console.log('Handling event:', { type, payload });
        event.handler(payload);
    }

    register(type, handler) {
        this.events.push({ type, handler });
    }

    sendMessage(message) {
        this.socket.send(JSON.stringify(message));
        console.log('Sent:', message);
    }

    setPlayerName(name) {
        this.sendMessage({
            type: OutgoingMessageTypes.SET_PLAYER_NAME,
            payload: name
        });
    }

    createRoom() {
        this.sendMessage({
            type: OutgoingMessageTypes.CREATE_ROOM
        });
    }

    joinRoom(id) {
        this.sendMessage({
            type: OutgoingMessageTypes.JOIN_ROOM,
            payload: id
        });
    }

    leaveRoom() {
        this.sendMessage({
            type: OutgoingMessageTypes.LEAVE_ROOM
        })
    }

    setMove(x, y) {
        this.sendMessage({
            type: OutgoingMessageTypes.SET_MOVE,
            payload: { x, y }
        })
    }

    startGame() {
        this.sendMessage({
            type: OutgoingMessageTypes.START_GAME
        })
    }
}