/** MESSAGES SENT BY THE SERVER */

import { SerializablePlayer } from "./player";
import { SerializableRoom } from "./room";

export enum OutgoingMessageTypes {
    CONNECTED = 'Connected',
    INCORRECT_MESSAGE = 'Incorred Message',
    UPDATE_CONNECTED_PLAYERS = 'Update Connected Players',
    UPDATE_OPEN_ROOMS = 'Update Open Rooms',
    JOIN_ROOM_FAIL = 'Join Room Fail',
    CREATE_ROOM_FAIL = 'Create Room Fail',
    LEAVE_ROOM_FAIL = 'Leave Room Fail',
    START_GAME_FAIL = 'Start Game Fail',
    SET_MOVE_FAIL = 'Set Move Fail',
    ANNOUNCE_WINNER = 'Announce Winner'
}

export class ConnectedMessage {
    public readonly type = OutgoingMessageTypes.CONNECTED;
    public constructor(public payload: SerializablePlayer) { }
}

export class IncorrectMessage {
    public readonly type = OutgoingMessageTypes.INCORRECT_MESSAGE;
    public constructor(public payload: IncomingMessage) { }
}

export class UpdateConnectedPlayersMessage {
    public readonly type = OutgoingMessageTypes.UPDATE_CONNECTED_PLAYERS;
    public constructor(public payload: SerializablePlayer[]) { }
}

export class UpdateOpenRoomsMessage {
    public readonly type = OutgoingMessageTypes.UPDATE_OPEN_ROOMS;
    public constructor(public payload: SerializableRoom[]) { }
}

export class JoinRoomFailMessage {
    public readonly type = OutgoingMessageTypes.JOIN_ROOM_FAIL;
}

export class CreateRoomFailMessage {
    public readonly type = OutgoingMessageTypes.CREATE_ROOM_FAIL;
}

export class LeaveRoomFailMessage {
    public readonly type = OutgoingMessageTypes.LEAVE_ROOM_FAIL;
}

export class StartGameFailMessage {
    public readonly type = OutgoingMessageTypes.START_GAME_FAIL;
}

export class SetMoveFailMessage {
    public readonly type = OutgoingMessageTypes.SET_MOVE_FAIL;

    public constructor(public payload: { x: number; y: number }) { }
}

export class AnnounceWinnerMessage {
    public readonly type = OutgoingMessageTypes.ANNOUNCE_WINNER;

    public constructor(public payload: SerializablePlayer) { }
}

export type OutgoingMessage = ConnectedMessage
    | IncorrectMessage
    | UpdateConnectedPlayersMessage
    | UpdateOpenRoomsMessage
    | JoinRoomFailMessage
    | CreateRoomFailMessage
    | LeaveRoomFailMessage
    | StartGameFailMessage
    | SetMoveFailMessage
    | AnnounceWinnerMessage;

/** MESSAGES SENT BY THE CLIENT */

export enum IncomingMessageTypes {
    SET_PLAYER_NAME = 'Set Player Name',
    JOIN_ROOM = 'Join Room',
    CREATE_ROOM = 'Create Room',
    LEAVE_ROOM = 'Leave Room',
    START_GAME = 'Start Game',
    SET_MOVE = 'Set Move'
}

export class SetPlayerNameMessage {
    public readonly type = IncomingMessageTypes.SET_PLAYER_NAME;
    public constructor(public payload: string) { }
}

export class JoinRoomMessage {
    public readonly type = IncomingMessageTypes.JOIN_ROOM;
    public constructor(public payload: number) { }
}

export class CreateRoomMessage {
    public readonly type = IncomingMessageTypes.CREATE_ROOM;
}

export class LeaveRoomMessage {
    public readonly type = IncomingMessageTypes.LEAVE_ROOM;
}

export class StartGameMessage {
    public readonly type = IncomingMessageTypes.START_GAME;
}

export class SetMoveMessage {
    public readonly type = IncomingMessageTypes.SET_MOVE;

    public constructor(public payload: { x: number; y: number }) { }
}

export type IncomingMessage = SetPlayerNameMessage
    | JoinRoomMessage
    | CreateRoomMessage
    | LeaveRoomMessage
    | StartGameMessage
    | SetMoveMessage;