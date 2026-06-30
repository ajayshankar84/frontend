import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private readonly welcomeMessages: ChatMessage[] = [
    {
      sender: 'bot',
      text: "Hey there! I'm your AI interview coach. Ready to crush your next interview?",
      timestamp: new Date(),
    },
    {
      sender: 'bot',
      text: "What's your name? And what exam or interview are you preparing for?",
      timestamp: new Date(),
    },
  ];

  constructor() {
    this.messagesSubject.next(this.welcomeMessages);
  }

  addUserMessage(text: string): void {
    const messages = [...this.messagesSubject.value, { sender: 'user' as const, text, timestamp: new Date() }];
    this.messagesSubject.next(messages);
  }

  addBotMessage(text: string): void {
    const messages = [...this.messagesSubject.value, { sender: 'bot' as const, text, timestamp: new Date() }];
    this.messagesSubject.next(messages);
  }

  clearMessages(): void {
    this.messagesSubject.next(this.welcomeMessages);
  }
}
