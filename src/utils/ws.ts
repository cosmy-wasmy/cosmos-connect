import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Configuration } from "../web/configuration";

export class CosmosWS {
    private readonly _wsUrl = Configuration.GetChainWsUrl();
    private _ws: WebSocketSubject<any>;
    private _callbackfn: ((result: any) => void) | null = null;

    constructor() {
        this._ws = webSocket({
            url: this._wsUrl,
            deserializer: (msg) => JSON.parse(msg.data),
        })
        this._ws.subscribe({
            next: (data: any) => this.handleOnMessage(data),
            error: err => this.handleOnError(err),
            complete: () => this.handleOnComplete()
        });
    }

    public SubscribeToNewBlocks(query: string, callback: (result: any) => void) {
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
}
