import { Player } from "./player";
import { Room } from "./room";
import { IncomingMessage, IncomingMessageTypes, IncorrectMessage, OutgoingMessage, UpdateConnectedPlayersMessage, ConnectedMessage, UpdateOpenRoomsMessage, JoinRoomFailMessage, CreateRoomFailMessage, LeaveRoomFailMessage, StartGameMessage, StartGameFailMessage, SetMoveFailMessage, AnnounceWinnerMessage } from "./message";

export class Game {
    private players: Player[] = [];
    private rooms: Room[] = [];

    async addPlayer(player: Player): Promise<void> {
        this.players.push(player);
        await player.sendMessage(new ConnectedMessage(player.getSerializable()))
        await this.updateGlobalState();
    }

    async removePlayer(player: Player): Promise<void> {
        this.players = this.players.filter(otherPlayer => otherPlayer !== player);

        const room = this.rooms.find(room => room.players.includes(player));
        if (room) {
            room.players = room.players.filter(other => other !== player);

            if (room.players.length === 0) {
                this.rooms = this.rooms.filter(other => other !== room);
            }
        }

        await this.updateGlobalState();
    }

    async updateGlobalState(): Promise<void> {
        await Promise.all([
            this.broadcast(new UpdateConnectedPlayersMessage(this.players.map(player => player.getSerializable()))),
            this.broadcast(new UpdateOpenRoomsMessage(this.rooms.map(room => room.getSerializable())))
        ]);
    }

    async updateConnectedPlayers(): Promise<void> {
        await this.broadcast(new UpdateConnectedPlayersMessage(this.players.map(player => player.getSerializable())));
    }

    async onMessage(from: Player, action: IncomingMessage): Promise<void> {
        switch (action.type) {
            case IncomingMessageTypes.SET_PLAYER_NAME: {
                from.name = action.payload;
                await this.updateGlobalState();
                break;
            }
            case IncomingMessageTypes.JOIN_ROOM: {
                const room = this.rooms.find(room => room.id === action.payload);

                if (!room || room.isFull() || from.joinedRoom) {
                    await from.sendMessage(new JoinRoomFailMessage());
                } else {
                    room.players.push(from);
                    from.joinedRoom = room;
                    await this.updateGlobalState();
                }
                break;
            }
            case IncomingMessageTypes.CREATE_ROOM: {
                if (this.rooms.length === this.players.length) {
                    await from.sendMessage(new CreateRoomFailMessage())
                } else {
                    this.rooms.push(new Room());
                    await this.updateGlobalState();
                }

                break;
            }
            case IncomingMessageTypes.LEAVE_ROOM: {
                if (!from.joinedRoom) {
                    await from.sendMessage(new LeaveRoomFailMessage());
                } else {
                    const room = from.joinedRoom;
                    from.joinedRoom = null;
                    room.players = room.players.filter(player => player.id !== from.id);
                    await this.updateGlobalState();
                }

                break;
            }
            case IncomingMessageTypes.START_GAME: {
                if (from.joinedRoom.players.length === 2 && (from.joinedRoom.round === 0 || from.joinedRoom.isGameOver)) {
                    from.joinedRoom.startGame();
                    await this.updateGlobalState();
                } else {
                    await from.sendMessage(new StartGameFailMessage());
                }

                break;
            }
            case IncomingMessageTypes.SET_MOVE: {
                if (from !== from.joinedRoom.turn || from.joinedRoom.isGameOver) {
                    await from.sendMessage(new SetMoveFailMessage(action.payload));
                    break;
                }

                try {
                    from.joinedRoom.setMove(action.payload.x, action.payload.y);
                    await this.updateGlobalState();

                    if (!from.joinedRoom.isGameOver && from.joinedRoom.boardFull) {
                        setTimeout(() => {
                            from.joinedRoom.startGame();
                            this.updateGlobalState();
                        }, 1000);
                    }

                    if (from.joinedRoom.isGameOver) {
                        from.joinedRoom.broadcast(new AnnounceWinnerMessage(
                            from.joinedRoom.players.find(player => player !== from.joinedRoom.turn).getSerializable()
                        ))
                    }
                } catch {
                    await from.sendMessage(new SetMoveFailMessage(action.payload));
                }
                break;
            }
            default: {
                await from.sendMessage(new IncorrectMessage(action))
            }
        }
    }

    async broadcast(message: OutgoingMessage): Promise<void> {
        await Promise.all(this.players.map(player => player.sendMessage(message)));
    }

    terminate(player: Player): void {
        player.terminate();
    }
}