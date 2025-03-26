import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import * as vscode from 'vscode';
import WebSocket from 'ws';
import { Environment } from './configuration';

export class CosmosWS {
    private _wsUrl: string;
    private _ws: WebSocketSubject<any>;
    private _callbackfn: ((result: any) => void) | null = null;

    constructor(websocketUrl: string) {
        this._wsUrl = websocketUrl;
        this._ws = this.getWebsocket();
        this._ws.subscribe({
            next: (data: any) => this.handleOnMessage(data),
            error: err => this.handleOnError(err),
            complete: () => this.handleOnComplete()
        });
    }

    public SubscribeToQuery(query: string, callback: (result: any) => void) {
        const params = {
            jsonrpc: "2.0",
            method: "subscribe",
            id: 0,
            params: { query: query }
        };
        this._callbackfn = callback;
        this._ws.next(params);
    }

    public Unsubscribe() {
        this._ws.unsubscribe();
        this._ws.complete();
    }

    private handleOnMessage(msg: any) {
        if (!msg.result || Object.keys(msg.result).length === 0) {
            return; // Confirmed subscription to the query
        }
        if (this._callbackfn) {
            this._callbackfn(msg.result);
        }
    }

    private handleOnError(err: any) { }

    private handleOnComplete() { }

    private getWebsocket(): WebSocketSubject<any>{
        if (!this._wsUrl) {
            vscode.window.showErrorMessage("No websocket URL found in the chain configuration.");
        }
        if (global.environment === Environment.Node) {
            
            return webSocket({
                url: this._wsUrl,
                deserializer: (msg) => JSON.parse(msg.data),
                WebSocketCtor: WebSocket as any
            });
        }
        return webSocket({
            url: this._wsUrl,
            deserializer: (msg) => JSON.parse(msg.data)
        })
    }
}
