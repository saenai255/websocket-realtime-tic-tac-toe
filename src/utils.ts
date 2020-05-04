import * as WebSocket from "ws";

export function sendMessage(ws: WebSocket, message: any): Promise<void> {
    return new Promise((resolve, reject) => ws.send(JSON.stringify(message), err => err ? reject(err) : resolve()))
}