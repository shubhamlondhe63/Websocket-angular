import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Message {
  text: string;
  self: boolean;
  id?: string;
}

interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('messageAnimation', [
      state('void', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      transition(':enter', [
        animate('300ms ease-out', style({
          transform: 'translateY(0)',
          opacity: 1
        }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {
  private socket;
  message: string = '';
  messages: Message[] = [];
  typingMessage: string = '';
  typingTimeout: any;
  users: User[] = [];

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    this.socket.on('message', (message: Message) => {
      const isSelf = message.id === this.socket.id;
      this.messages.push({ text: message.text, self: isSelf });
    });

    this.socket.on('typing', (typingMessage: string) => {
      this.typingMessage = typingMessage;
    });

    this.socket.on('stopTyping', () => {
      this.typingMessage = '';
    });

    this.socket.on('updateUserList', (users: User[]) => {
      this.users = users;
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      const userMessage = { text: this.message, self: true };
      this.messages.push(userMessage);
      this.socket.emit('message', userMessage);
      this.message = '';
    }
    this.socket.emit('stopTyping');
  }

  onTyping(): void {
    this.socket.emit('typing', 'Someone is typing...');
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.socket.emit('stopTyping');
    }, 3000);
  }
}
