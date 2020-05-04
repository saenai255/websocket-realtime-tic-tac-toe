import { Player, SerializablePlayer } from "./player";
import { OutgoingMessage } from "./message";

enum BoardCell {
    X = 'X',
    O = 'O',
    NONE = 'NONE'
}

type BoardRow = [BoardCell, BoardCell, BoardCell];
type Board = [BoardRow, BoardRow, BoardRow];

export interface SerializableRoom {
    id: number;
    players: SerializablePlayer[];
    turn: SerializablePlayer;
    round: number;
    isGameOver: boolean;
    board: Board;
    playerX: SerializablePlayer;
    playerO: SerializablePlayer;
}

export class Room {
    static usableId: number = 1;

    public id: number;
    public players: Player[] = [];
    public turn: Player = null;
    public round: number = 0;
    private board: Board = [
        [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
        [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
        [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
    ];
    private playerX: Player;
    private playerO: Player;

    constructor() {
        this.id = Room.usableId++;
    }


    isFull() {
        return this.players.length === 2;
    }

    join(player: Player): void {
        if (this.isFull()) {
            throw new Error();
        }

        this.players.push(player);
    }

    startGame() {
        if (!this.isFull()) {
            throw new Error();
        }

        this.round = 1;

        this.board = [
            [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
            [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
            [BoardCell.NONE, BoardCell.NONE, BoardCell.NONE],
        ];

        this.playerX = this.players[Math.round(Math.random())];
        this.playerO = this.players.find(player => player.id !== this.playerX.id);
        this.turn = this.playerX;
    }

    getSerializable(): SerializableRoom {
        return {
            id: this.id,
            board: this.board,
            isGameOver: this.isGameOver,
            players: this.players.map(player => player.getSerializable()),
            round: this.round,
            turn: this.turn?.getSerializable(),
            playerX: this.playerX?.getSerializable(),
            playerO: this.playerO?.getSerializable()
        }
    }

    setMove(x: number, y: number): void {
        const fill = this.turn === this.playerX ? BoardCell.X : BoardCell.O;
        if (this.board[x][y] !== BoardCell.NONE) {
            throw new Error();
        }

        this.board[x][y] = fill;
        this.round++;
        this.turn = this.turn === this.playerX ? this.playerO : this.playerX;
    }

    get boardFull(): boolean {
        return this.board.every(row => row.every(cell => [BoardCell.O, BoardCell.X].includes(cell)));
    }

    get isGameOver(): boolean {
        const isWinStreak = (row: BoardCell[]) => row[0] !== BoardCell.NONE && row[0] === row[1] && row[1] === row[2];

        for (const row of this.board) {
            if (isWinStreak(row)) {
                return true;
            }
        }

        for (let i = 0; i < this.board.length; i++) {
            if (isWinStreak([this.board[0][i], this.board[1][i], this.board[2][i]])) {
                return true;
            }
        }

        if (isWinStreak([this.board[0][0], this.board[1][1], this.board[2][2]])) {
            return true;
        }

        if (isWinStreak([this.board[2][0], this.board[1][1], this.board[0][2]])) {
            return true;
        }

        return false;
    }

    async broadcast(message: OutgoingMessage): Promise<void> {
        await Promise.all(this.players.map(player => player.sendMessage(message)));
    }
}