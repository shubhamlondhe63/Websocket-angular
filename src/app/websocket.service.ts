// src/app/websocket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  public close(): void {
    this.socket$.complete();
  }
}
