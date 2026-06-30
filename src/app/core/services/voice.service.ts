import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

declare var webkitSpeechRecognition: any;
declare var SpeechSynthesisUtterance: any;

@Injectable({ providedIn: 'root' })
export class VoiceService {
  private recognition: any;
  private synthesis = window.speechSynthesis;
  private transcriptSubject = new Subject<string>();
  private isListeningSubject = new Subject<boolean>();

  transcript$ = this.transcriptSubject.asObservable();
  isListening$ = this.isListeningSubject.asObservable();

  constructor(private zone: NgZone) {
    this.initRecognition();
  }

  private initRecognition(): void {
    if (typeof webkitSpeechRecognition === 'undefined') {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      this.zone.run(() => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        if (finalTranscript) {
          this.transcriptSubject.next(finalTranscript);
        }
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        this.isListeningSubject.next(false);
      });
    };

    this.recognition.onerror = (event: any) => {
      this.zone.run(() => {
        console.error('Speech recognition error:', event.error);
        this.isListeningSubject.next(false);
      });
    };
  }

  startListening(): void {
    if (this.recognition) {
      try {
        this.recognition.start();
        this.isListeningSubject.next(true);
      } catch (e) {
        console.error('Speech recognition start error:', e);
      }
    }
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.isListeningSubject.next(false);
    }
  }

  speak(text: string, lang = 'en-US'): void {
    if (!this.synthesis) return;
    this.synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    this.synthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
