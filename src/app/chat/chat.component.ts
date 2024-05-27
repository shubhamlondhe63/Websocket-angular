// src/app/chat/chat.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  public messages: string[] = [];
  public message: string = '';
  private subscription: Subscription;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.subscription = this.websocketService.getMessages().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.websocketService.close();
  }

  public sendMessage(): void {
    if (this.message.trim()) {
      this.websocketService.sendMessage(this.message);
      this.message = '';
    }
  }
}
