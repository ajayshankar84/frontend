import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from '../../core/services/chat.service';
import { VoiceService } from '../../core/services/voice.service';
import { ChatMessage } from '../../core/models/api.models';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chatbot-container">
      <div class="chat-header">
        <h2>AI Interview Coach</h2>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm" (click)="toggleVoice()" [class.active]="voiceEnabled">
            {{ voiceEnabled ? 'Voice On' : 'Voice Off' }}
          </button>
        </div>
      </div>

      <div class="chat-messages" #chatContainer>
        <div *ngFor="let msg of messages" class="message" [class.user]="msg.sender === 'user'" [class.bot]="msg.sender === 'bot'">
          <div class="message-avatar">{{ msg.sender === 'bot' ? 'AI' : 'You' }}</div>
          <div class="message-content">{{ msg.text }}</div>
        </div>
      </div>

      <div class="chat-input">
        <div class="input-row">
          <input
            type="text"
            [(ngModel)]="userInput"
            (keyup.enter)="sendMessage()"
            placeholder="Type your message..."
            [disabled]="isListening"
          >
          <button class="btn btn-secondary" (click)="toggleListening()" [class.recording]="isListening">
            {{ isListening ? 'Stop' : 'Speak' }}
          </button>
          <button class="btn btn-primary" (click)="sendMessage()" [disabled]="!userInput.trim()">Send</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container { max-width: 800px; margin: 0 auto; height: calc(100vh - 88px); display: flex; flex-direction: column; padding: 24px; }
    .chat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .chat-header h2 { font-size: 20px; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn-sm.active { background: var(--primary); color: white; }
    .chat-messages { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 16px 0; }
    .message { display: flex; gap: 12px; max-width: 80%; }
    .message.user { align-self: flex-end; flex-direction: row-reverse; }
    .message.bot { align-self: flex-start; }
    .message-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
    .message.user .message-avatar { background: var(--primary); color: white; }
    .message.bot .message-avatar { background: var(--bg-input); color: var(--text-muted); }
    .message-content { padding: 12px 16px; border-radius: 12px; font-size: 14px; line-height: 1.5; }
    .message.user .message-content { background: var(--primary); color: white; }
    .message.bot .message-content { background: var(--bg-input); }
    .chat-input { padding-top: 16px; border-top: 1px solid var(--border); }
    .input-row { display: flex; gap: 8px; }
    .input-row input { flex: 1; }
    .recording { background: var(--danger) !important; color: white !important; }
  `],
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages: ChatMessage[] = [];
  userInput = '';
  voiceEnabled = false;
  isListening = false;
  private subs: Subscription[] = [];

  constructor(private chatService: ChatService, private voiceService: VoiceService) {}

  ngOnInit(): void {
    this.subs.push(
      this.chatService.messages$.subscribe((msgs) => {
        this.messages = msgs;
        this.scrollToBottom();
      }),
      this.voiceService.isListening$.subscribe((val) => (this.isListening = val)),
      this.voiceService.transcript$.subscribe((text) => {
        this.userInput = text;
        this.sendMessage();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text) return;

    this.chatService.addUserMessage(text);
    this.userInput = '';

    // Simulate AI response (in real app, call backend)
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "Interesting! Can you tell me more about your experience?",
        "Let's practice some interview questions on that topic.",
        "Great choice! What specific areas would you like to focus on?",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      this.chatService.addBotMessage(response);

      if (this.voiceEnabled) {
        this.voiceService.speak(response);
      }
    }, 1000);
  }

  toggleListening(): void {
    if (this.isListening) {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening();
    }
  }

  toggleVoice(): void {
    this.voiceEnabled = !this.voiceEnabled;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    });
  }
}
