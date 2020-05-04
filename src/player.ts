import * as WebSocket from "ws";
import { OutgoingMessage } from "./message";
import { sendMessage } from "./utils";
import { Room, SerializableRoom } from "./room";

export interface SerializablePlayer {
    id: number;
    name: string;
    joinedRoom: number;
}

export class Player {
    static usableId: number = 1;

    public id: number;
    public name: string;
    public joinedRoom: Room;

    constructor(private ws: WebSocket) {
        this.id = Player.usableId++;
    }

    async sendMessage(message: OutgoingMessage): Promise<void> {
        console.log('Send:', { destination: this.getSerializable(), message })
        await sendMessage(this.ws, message);
    }

    async sendMessages(messages: OutgoingMessage[]): Promise<void> {
        await Promise.all(
            messages.map(msg => this.sendMessage(msg))
        )
    }

    getSerializable(): SerializablePlayer {
        return {
            id: this.id,
            name: this.name,
            joinedRoom: this.joinedRoom?.id
        };
    }

    terminate() {
        this.ws.terminate();
    }
}