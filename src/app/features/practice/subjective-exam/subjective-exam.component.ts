import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracticeService } from '../../../core/services/practice.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Question } from '../../../core/models/api.models';

@Component({
  selector: 'app-subjective-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="exam-layout">
        <div class="setup-panel card" *ngIf="!examActive && !examComplete">
          <h2>{{ tx()['subjective.title'] }}</h2>
          <p class="subtitle">{{ tx()['subjective.subtitle'] }}</p>
          <div class="form-group">
            <label>{{ tx()['subjective.topic_label'] }}</label>
            <input type="text" [(ngModel)]="topic" [placeholder]="tx()['subjective.topic_placeholder']">
          </div>
          <div class="form-group">
            <label>{{ tx()['subjective.questions_label'] }}</label>
            <select [(ngModel)]="count">
              <option [value]="5">{{ tx()['subjective.questions_5'] }}</option>
              <option [value]="10">{{ tx()['subjective.questions_10'] }}</option>
              <option [value]="15">{{ tx()['subjective.questions_15'] }}</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="generatePaper()" [disabled]="loading || !topic">
            {{ loading ? tx()['subjective.generating'] : tx()['subjective.start_exam'] }}
          </button>
        </div>

        <div class="exam-panel" *ngIf="examActive">
          <div class="exam-header">
            <h2>{{ t('subjective.header', {topic}) }}</h2>
            <span class="progress-text">{{ t('subjective.progress', {current: currentIndex + 1, total: questions.length}) }}</span>
          </div>

          <div class="card question-card">
            <h3>Q{{ currentIndex + 1 }}. {{ questions[currentIndex].questionText }}</h3>
          </div>

          <div class="card answer-card">
            <label>{{ tx()['subjective.your_answer_label'] }}</label>
            <textarea
              [(ngModel)]="answers[currentIndex]"
              [placeholder]="tx()['subjective.answer_placeholder']"
              rows="6"
            ></textarea>
          </div>

          <div class="nav-buttons">
            <button class="btn btn-secondary" (click)="prevQuestion()" [disabled]="currentIndex === 0">{{ tx()['subjective.previous'] }}</button>
            <button class="btn btn-primary" *ngIf="currentIndex < questions.length - 1" (click)="nextQuestion()">{{ tx()['subjective.next'] }}</button>
            <button class="btn btn-primary" *ngIf="currentIndex === questions.length - 1" (click)="submitExam()" [disabled]="submitting">
              {{ submitting ? tx()['subjective.grading'] : tx()['subjective.submit_exam'] }}
            </button>
          </div>
        </div>

        <div class="results-panel card" *ngIf="examComplete">
          <h2>{{ tx()['subjective.complete_title'] }}</h2>
          <div class="grade-display">
            <div class="grade-circle">{{ grade }}</div>
            <p>{{ t('subjective.points', {score: totalScore, max: maxScore}) }}</p>
          </div>
          <div class="results-list">
            <div *ngFor="let q of questions; let i = index" class="result-item">
              <strong>Q{{ i + 1 }}.</strong> {{ q.questionText }}
              <div class="result-score">{{ t('subjective.score', {score: gradingResults[i]?.score || 0}) }}</div>
              <div class="result-feedback" *ngIf="gradingResults[i]?.feedback">{{ t('subjective.feedback', {text: gradingResults[i]?.feedback}) }}</div>
            </div>
          </div>
          <button class="btn btn-primary" (click)="resetExam()">{{ tx()['subjective.take_another'] }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .exam-layout { max-width: 700px; margin: 0 auto; }
    .subtitle { color: var(--text-muted); margin-bottom: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-muted); }
    .exam-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .progress-text { font-size: 14px; color: var(--text-muted); }
    .question-card { margin-bottom: 16px; }
    .question-card h3 { font-size: 16px; line-height: 1.5; }
    .answer-card { margin-bottom: 16px; }
    .answer-card label { display: block; margin-bottom: 8px; font-size: 13px; color: var(--text-muted); }
    textarea { resize: vertical; }
    .nav-buttons { display: flex; justify-content: space-between; }
    .results-panel { text-align: center; }
    .grade-circle { font-size: 48px; font-weight: 700; color: var(--primary-light); }
    .results-list { text-align: left; margin: 24px 0; }
    .result-item { padding: 12px; background: var(--bg-input); border-radius: 8px; margin-bottom: 8px; font-size: 14px; }
    .result-score { color: var(--primary-light); font-weight: 600; margin-top: 4px; }
    .result-feedback { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
  `],
})
export class SubjectiveExamComponent {
  topic = '';
  count = 5;
  loading = false;
  submitting = false;
  examActive = false;
  examComplete = false;
  questions: Question[] = [];
  answers: string[] = [];
  currentIndex = 0;
  paperId = '';
  totalScore = 0;
  maxScore = 0;
  grade = '';
  gradingResults: any[] = [];

  private practiceService = inject(PracticeService);
  private translationSvc = inject(TranslationService);
  readonly tx = this.translationSvc.data;

  t(key: string, params?: Record<string, string | number>): string {
    return this.translationSvc.t(key, params);
  }

  generatePaper(): void {
    this.loading = true;
    this.practiceService.generatePaper(this.topic, 'subjective', this.count, this.translationSvc.currentLang()).subscribe({
      next: (res) => {
        this.questions = res.questions;
        this.paperId = res.paperId;
        this.answers = new Array(res.questions.length).fill('');
        this.examActive = true;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  nextQuestion(): void {
    if (this.currentIndex < this.questions.length - 1) this.currentIndex++;
  }

  prevQuestion(): void {
    if (this.currentIndex > 0) this.currentIndex--;
  }

  submitExam(): void {
    this.submitting = true;
    const ansArray = this.questions.map((q, i) => ({
      questionId: q._id,
      answer: this.answers[i],
    }));

    this.practiceService.gradePaper(this.paperId, ansArray).subscribe({
      next: (res) => {
        this.totalScore = res.totalScore;
        this.maxScore = res.maxScore;
        this.grade = res.grade;
        this.gradingResults = res.answers;
        this.examComplete = true;
        this.examActive = false;
        this.submitting = false;
      },
      error: () => (this.submitting = false),
    });
  }

  resetExam(): void {
    this.examActive = false;
    this.examComplete = false;
    this.questions = [];
    this.answers = [];
    this.topic = '';
  }
}
