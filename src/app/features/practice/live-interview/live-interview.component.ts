import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PracticeService } from '../../../core/services/practice.service';
import { VoiceService } from '../../../core/services/voice.service';
import { Question } from '../../../core/models/api.models';

@Component({
  selector: 'app-live-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="interview-layout">
        <div class="setup-panel card" *ngIf="!activeQuestion">
          <h2>Live AI Interview</h2>
          <p class="subtitle">Practice with an AI interviewer that asks follow-up questions</p>

          <div class="form-group">
            <label>Topic</label>
            <input type="text" [(ngModel)]="topic" placeholder="e.g., Angular, React, Node.js">
          </div>
          <div class="form-group">
            <label>Difficulty</label>
            <select [(ngModel)]="difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="startInterview()" [disabled]="loading || !topic">
            {{ loading ? 'Starting...' : 'Start Interview' }}
          </button>
        </div>

        <div class="interview-panel" *ngIf="activeQuestion">
          <div class="card question-card">
            <div class="question-header">
              <span class="question-number">Question {{ questionNumber }}</span>
              <span class="score-display">Score: {{ currentScore }}/10</span>
            </div>
            <h3 class="question-text">{{ activeQuestion.questionText }}</h3>
            <button class="btn btn-secondary btn-sm" (click)="speakQuestion()">Listen</button>
          </div>

          <div class="card answer-section">
            <div class="answer-mode-toggle">
              <button class="btn btn-sm" [class.active]="answerMode === 'type'" (click)="answerMode = 'type'">Type</button>
              <button class="btn btn-sm" [class.active]="answerMode === 'voice'" (click)="answerMode = 'voice'">Voice</button>
            </div>

            <textarea
              *ngIf="answerMode === 'type'"
              [(ngModel)]="userAnswer"
              placeholder="Type your answer..."
              rows="4"
            ></textarea>

            <div *ngIf="answerMode === 'voice'" class="voice-section">
              <button class="btn btn-primary" (click)="toggleListening()" [class.recording]="isListening">
                {{ isListening ? 'Stop Recording' : 'Start Recording' }}
              </button>
              <div class="transcript" *ngIf="transcript">{{ transcript }}</div>
            </div>

            <button class="btn btn-primary" (click)="submitAnswer()" [disabled]="submitting || !canSubmit">
              {{ submitting ? 'Evaluating...' : 'Submit Answer' }}
            </button>
          </div>

          <div class="card feedback-card" *ngIf="feedback">
            <h4>Feedback</h4>
            <p>{{ feedback }}</p>
          </div>

          <div class="action-bar">
            <button class="btn btn-secondary" (click)="endInterview()">End Interview</button>
          </div>
        </div>

        <div class="results-panel card" *ngIf="interviewComplete">
          <h2>Interview Complete!</h2>
          <div class="final-score">
            <div class="score-circle">{{ finalScore }}</div>
            <p>Average Score</p>
          </div>
          <div class="grade-display">
            <span [class]="'grade ' + getGradeClass(finalGrade)">{{ finalGrade }}</span>
          </div>
          <button class="btn btn-primary" (click)="resetInterview()">Start New Interview</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .interview-layout { max-width: 700px; margin: 0 auto; }
    .subtitle { color: var(--text-muted); margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-muted); }
    .question-header { display: flex; justify-content: space-between; margin-bottom: 16px; }
    .question-number { font-size: 13px; color: var(--primary-light); font-weight: 600; }
    .score-display { font-size: 13px; color: var(--text-muted); }
    .question-text { font-size: 18px; margin-bottom: 12px; line-height: 1.5; }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .answer-section { margin-top: 16px; }
    .answer-mode-toggle { display: flex; gap: 8px; margin-bottom: 12px; }
    .answer-mode-toggle .btn.active { background: var(--primary); color: white; }
    textarea { resize: vertical; }
    .voice-section { text-align: center; padding: 20px; }
    .recording { background: var(--danger) !important; }
    .transcript { margin-top: 12px; padding: 12px; background: var(--bg-input); border-radius: 8px; font-size: 14px; }
    .feedback-card { margin-top: 16px; border-left: 3px solid var(--primary); }
    .feedback-card h4 { margin-bottom: 8px; }
    .action-bar { margin-top: 16px; }
    .results-panel { text-align: center; }
    .final-score { margin: 24px 0; }
    .score-circle { font-size: 48px; font-weight: 700; color: var(--primary-light); }
    .grade { font-size: 24px; font-weight: 700; }
    .grade.grade-a { color: var(--success); }
    .grade.grade-b { color: var(--primary-light); }
    .grade.grade-c { color: var(--warning); }
    .grade.grade-f { color: var(--danger); }
  `],
})
export class LiveInterviewComponent implements OnInit, OnDestroy {
  topic = '';
  difficulty = 'medium';
  activeQuestion: Question | null = null;
  userAnswer = '';
  transcript = '';
  feedback = '';
  currentScore = 0;
  questionNumber = 1;
  loading = false;
  submitting = false;
  isListening = false;
  answerMode: 'type' | 'voice' = 'type';
  interviewComplete = false;
  finalScore = 0;
  finalGrade = '';
  sessionId = '';
  scores: number[] = [];
  private subs: Subscription[] = [];

  constructor(private practiceService: PracticeService, private voiceService: VoiceService) {}

  get canSubmit(): boolean {
    return this.answerMode === 'type' ? !!this.userAnswer.trim() : !!this.transcript.trim();
  }

  ngOnInit(): void {
    this.subs.push(
      this.voiceService.isListening$.subscribe((val) => (this.isListening = val)),
      this.voiceService.transcript$.subscribe((text) => {
        this.transcript = text;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  startInterview(): void {
    this.loading = true;
    this.practiceService.getQuestion(this.topic, 'interview', this.difficulty).subscribe({
      next: (res) => {
        this.activeQuestion = res.question;
        this.questionNumber = 1;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  speakQuestion(): void {
    if (this.activeQuestion) {
      this.voiceService.speak(this.activeQuestion.questionText);
    }
  }

  toggleListening(): void {
    if (this.isListening) {
      this.voiceService.stopListening();
    } else {
      this.transcript = '';
      this.voiceService.startListening();
    }
  }

  submitAnswer(): void {
    if (!this.activeQuestion) return;
    this.submitting = true;
    const answer = this.answerMode === 'voice' ? this.transcript : this.userAnswer;

    this.practiceService.submitAnswer(this.activeQuestion._id, answer, 'interview').subscribe({
      next: (res) => {
        this.feedback = res.feedback;
        this.currentScore = res.score;
        this.scores.push(res.score);
        this.sessionId = res.sessionId || '';
        this.submitting = false;
        this.userAnswer = '';
        this.transcript = '';

        if (res.nextQuestion) {
          this.questionNumber++;
          setTimeout(() => {
            this.activeQuestion = {
              ...this.activeQuestion!,
              questionText: res.nextQuestion!,
            };
            this.feedback = '';
          }, 2000);
        }
      },
      error: () => (this.submitting = false),
    });
  }

  endInterview(): void {
    this.interviewComplete = true;
    this.finalScore = Math.round(this.scores.reduce((a, b) => a + b, 0) / this.scores.length);
    this.finalGrade = this.getGrade(this.finalScore);
  }

  resetInterview(): void {
    this.activeQuestion = null;
    this.interviewComplete = false;
    this.scores = [];
    this.questionNumber = 1;
    this.feedback = '';
    this.topic = '';
  }

  private getGrade(score: number): string {
    if (score >= 9) return 'A+';
    if (score >= 8) return 'A';
    if (score >= 7) return 'B';
    if (score >= 6) return 'C';
    return 'F';
  }

  getGradeClass(grade: string): string {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    return 'grade-f';
  }
}
