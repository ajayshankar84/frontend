import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracticeService } from '../../../core/services/practice.service';
import { TranslationService } from '../../../core/services/translation.service';
import { Question } from '../../../core/models/api.models';

@Component({
  selector: 'app-objective-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="exam-layout">
        <div class="setup-panel card" *ngIf="!examActive && !examComplete">
          <h2>{{ tx()['objective.title'] }}</h2>
          <p class="subtitle">{{ tx()['objective.subtitle'] }}</p>
          <div class="form-group">
            <label>{{ tx()['objective.topic_label'] }}</label>
            <input type="text" [(ngModel)]="topic" [placeholder]="tx()['objective.topic_placeholder']">
          </div>
          <div class="form-group">
            <label>{{ tx()['objective.questions_label'] }}</label>
            <select [(ngModel)]="count">
              <option [value]="10">{{ tx()['objective.questions_10'] }}</option>
              <option [value]="20">{{ tx()['objective.questions_20'] }}</option>
              <option [value]="30">{{ tx()['objective.questions_30'] }}</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="generatePaper()" [disabled]="loading || !topic">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? tx()['objective.generating'] : tx()['objective.start_exam'] }}
          </button>
        </div>

        <div class="exam-panel" *ngIf="examActive">
          <div class="exam-header">
            <h2>{{ t('objective.header', {topic}) }}</h2>
            <span class="progress-text">{{ t('objective.progress', {current: currentIndex + 1, total: questions.length}) }}</span>
          </div>

          <div class="card question-card">
            <h3>Q{{ currentIndex + 1 }}. {{ questions[currentIndex].questionText }}</h3>
            <div class="options">
              <label
                *ngFor="let option of questions[currentIndex].options; let i = index"
                class="option"
                [class.selected]="selectedAnswers[currentIndex] === option"
              >
                <input
                  type="radio"
                  [name]="'q' + currentIndex"
                  [value]="option"
                  [(ngModel)]="selectedAnswers[currentIndex]"
                >
                <span class="option-text">{{ option }}</span>
              </label>
            </div>
          </div>

          <div class="nav-buttons">
            <button class="btn btn-secondary" (click)="prevQuestion()" [disabled]="currentIndex === 0">{{ tx()['objective.previous'] }}</button>
            <button class="btn btn-primary" *ngIf="currentIndex < questions.length - 1" (click)="nextQuestion()">{{ tx()['objective.next'] }}</button>
            <button class="btn btn-primary" *ngIf="currentIndex === questions.length - 1" (click)="submitExam()" [disabled]="submitting">
              {{ submitting ? tx()['objective.grading'] : tx()['objective.submit_exam'] }}
            </button>
          </div>
        </div>

        <div class="results-panel card" *ngIf="examComplete">
          <h2>{{ tx()['objective.complete_title'] }}</h2>
          <div class="grade-display">
            <div class="grade-circle">{{ grade }}</div>
            <p>{{ t('objective.correct_count', {correct: correctCount, total: questions.length}) }}</p>
            <p class="score-pct">{{ t('objective.score_pct', {score: scorePercentage}) }}</p>
          </div>
          <div class="results-list">
            <div *ngFor="let q of questions; let i = index" class="result-item" [class.correct]="results[i]?.isCorrect" [class.wrong]="!results[i]?.isCorrect">
              <strong>Q{{ i + 1 }}.</strong> {{ q.questionText }}
              <div class="answer-info">
                <span>{{ t('objective.your_answer', {answer: selectedAnswers[i] || tx()['objective.not_answered']}) }}</span>
                <span *ngIf="!results[i]?.isCorrect">{{ t('objective.correct_answer', {answer: q.correctAnswer}) }}</span>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" (click)="resetExam()">{{ tx()['objective.take_another'] }}</button>
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
    .question-card h3 { font-size: 16px; line-height: 1.5; margin-bottom: 16px; }
    .options { display: flex; flex-direction: column; gap: 8px; }
    .option { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-input); border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
    .option:hover { border-color: var(--primary); }
    .option.selected { border-color: var(--primary); background: rgba(99, 102, 241, 0.1); }
    .option input { display: none; }
    .option-text { font-size: 14px; }
    .nav-buttons { display: flex; justify-content: space-between; margin-top: 16px; }
    .results-panel { text-align: center; }
    .grade-circle { font-size: 48px; font-weight: 700; color: var(--primary-light); }
    .score-pct { font-size: 18px; color: var(--text-muted); }
    .results-list { text-align: left; margin: 24px 0; }
    .result-item { padding: 12px; background: var(--bg-input); border-radius: 8px; margin-bottom: 8px; font-size: 14px; border-left: 3px solid var(--border); }
    .result-item.correct { border-left-color: var(--success); }
    .result-item.wrong { border-left-color: var(--danger); }
    .answer-info { margin-top: 4px; font-size: 13px; color: var(--text-muted); display: flex; flex-direction: column; gap: 2px; }
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; margin-right: 8px; vertical-align: middle; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ObjectiveExamComponent {
  topic = '';
  count = 10;
  loading = false;
  submitting = false;
  examActive = false;
  examComplete = false;
  questions: Question[] = [];
  selectedAnswers: string[] = [];
  currentIndex = 0;
  paperId = '';
  grade = '';
  correctCount = 0;
  scorePercentage = 0;
  results: any[] = [];

  private practiceService = inject(PracticeService);
  private translationSvc = inject(TranslationService);
  readonly tx = this.translationSvc.data;

  t(key: string, params?: Record<string, string | number>): string {
    return this.translationSvc.t(key, params);
  }

  generatePaper(): void {
    this.loading = true;
    this.practiceService.generatePaper(this.topic, 'objective', this.count, this.translationSvc.currentLang()).subscribe({
      next: (res) => {
        this.questions = res.questions;
        this.paperId = res.paperId;
        this.selectedAnswers = new Array(res.questions.length).fill('');
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
      answer: this.selectedAnswers[i],
    }));

    this.practiceService.gradePaper(this.paperId, ansArray).subscribe({
      next: (res) => {
        this.results = res.answers;
        this.correctCount = res.answers.filter((a: any) => a.isCorrect).length;
        this.scorePercentage = Math.round((this.correctCount / this.questions.length) * 100);
        this.grade = res.grade;
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
    this.selectedAnswers = [];
    this.topic = '';
  }
}
