import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracticeService } from '../../../core/services/practice.service';
import { Question } from '../../../core/models/api.models';

@Component({
  selector: 'app-subjective-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="exam-layout">
        <div class="setup-panel card" *ngIf="!examActive && !examComplete">
          <h2>Subjective Exam</h2>
          <p class="subtitle">Write detailed answers and get AI-graded feedback</p>
          <div class="form-group">
            <label>Topic</label>
            <input type="text" [(ngModel)]="topic" placeholder="e.g., System Design, Algorithms">
          </div>
          <div class="form-group">
            <label>Number of Questions</label>
            <select [(ngModel)]="count">
              <option [value]="5">5 Questions</option>
              <option [value]="10">10 Questions</option>
              <option [value]="15">15 Questions</option>
            </select>
          </div>
          <button class="btn btn-primary" (click)="generatePaper()" [disabled]="loading || !topic">
            {{ loading ? 'Generating...' : 'Start Exam' }}
          </button>
        </div>

        <div class="exam-panel" *ngIf="examActive">
          <div class="exam-header">
            <h2>Subjective Exam - {{ topic }}</h2>
            <span class="progress-text">Question {{ currentIndex + 1 }} / {{ questions.length }}</span>
          </div>

          <div class="card question-card">
            <h3>Q{{ currentIndex + 1 }}. {{ questions[currentIndex].questionText }}</h3>
          </div>

          <div class="card answer-card">
            <label>Your Answer</label>
            <textarea
              [(ngModel)]="answers[currentIndex]"
              placeholder="Write your detailed answer here..."
              rows="6"
            ></textarea>
          </div>

          <div class="nav-buttons">
            <button class="btn btn-secondary" (click)="prevQuestion()" [disabled]="currentIndex === 0">Previous</button>
            <button class="btn btn-primary" *ngIf="currentIndex < questions.length - 1" (click)="nextQuestion()">Next</button>
            <button class="btn btn-primary" *ngIf="currentIndex === questions.length - 1" (click)="submitExam()" [disabled]="submitting">
              {{ submitting ? 'Grading...' : 'Submit Exam' }}
            </button>
          </div>
        </div>

        <div class="results-panel card" *ngIf="examComplete">
          <h2>Exam Complete!</h2>
          <div class="grade-display">
            <div class="grade-circle">{{ grade }}</div>
            <p>{{ totalScore }} / {{ maxScore }} points</p>
          </div>
          <div class="results-list">
            <div *ngFor="let q of questions; let i = index" class="result-item">
              <strong>Q{{ i + 1 }}.</strong> {{ q.questionText }}
              <div class="result-score">Score: {{ gradingResults[i]?.score || 0 }}/10</div>
              <div class="result-feedback">{{ gradingResults[i]?.feedback }}</div>
            </div>
          </div>
          <button class="btn btn-primary" (click)="resetExam()">Take Another Exam</button>
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

  constructor(private practiceService: PracticeService) {}

  generatePaper(): void {
    this.loading = true;
    this.practiceService.generatePaper(this.topic, 'subjective', this.count).subscribe({
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
