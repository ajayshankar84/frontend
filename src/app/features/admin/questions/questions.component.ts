import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { Question } from '../../../core/models/api.models';

@Component({
  selector: 'app-questions-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h1>Question Bank Management</h1>

      <div class="card" style="margin-bottom: 24px;">
        <h3>Add New Question</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Topic</label>
            <input type="text" [(ngModel)]="newQuestion.topic" placeholder="e.g., Angular">
          </div>
          <div class="form-group">
            <label>Type</label>
            <select [(ngModel)]="newQuestion.type">
              <option value="interview">Interview</option>
              <option value="subjective">Subjective</option>
              <option value="objective">Objective</option>
            </select>
          </div>
          <div class="form-group">
            <label>Difficulty</label>
            <select [(ngModel)]="newQuestion.difficulty">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Question Text</label>
          <textarea [(ngModel)]="newQuestion.questionText" rows="3" placeholder="Enter question..."></textarea>
        </div>
        <div *ngIf="newQuestion.type === 'objective'" class="form-row">
          <div class="form-group"><label>Option A</label><input [(ngModel)]="newQuestion.options[0]"></div>
          <div class="form-group"><label>Option B</label><input [(ngModel)]="newQuestion.options[1]"></div>
          <div class="form-group"><label>Option C</label><input [(ngModel)]="newQuestion.options[2]"></div>
          <div class="form-group"><label>Option D</label><input [(ngModel)]="newQuestion.options[3]"></div>
          <div class="form-group"><label>Correct Answer</label><input [(ngModel)]="newQuestion.correctAnswer"></div>
        </div>
        <div *ngIf="newQuestion.type === 'subjective'" class="form-group">
          <label>Model Answer</label>
          <textarea [(ngModel)]="newQuestion.modelAnswer" rows="3" placeholder="Enter model answer..."></textarea>
        </div>
        <button class="btn btn-primary" (click)="addQuestion()" [disabled]="!newQuestion.questionText || !newQuestion.topic">
          Add Question
        </button>
      </div>

      <div class="card">
        <div class="table-header">
          <h3>Questions ({{ total }})</h3>
          <div class="filters">
            <input type="text" [(ngModel)]="filterTopic" placeholder="Filter by topic" (keyup.enter)="loadQuestions()">
            <button class="btn btn-secondary" (click)="loadQuestions()">Search</button>
          </div>
        </div>
        <div class="questions-list">
          <div *ngFor="let q of questions" class="question-item">
            <div class="q-info">
              <span class="q-topic">{{ q.topic }}</span>
              <span class="q-type">{{ q.type }}</span>
              <span class="q-diff" [class]="'diff-' + q.difficulty">{{ q.difficulty }}</span>
            </div>
            <p class="q-text">{{ q.questionText }}</p>
            <div class="q-actions">
              <button class="btn btn-danger btn-sm" (click)="deleteQuestion(q._id)">Delete</button>
            </div>
          </div>
        </div>
        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn btn-secondary btn-sm" (click)="prevPage()" [disabled]="page === 1">Prev</button>
          <span>Page {{ page }} / {{ totalPages }}</span>
          <button class="btn btn-secondary btn-sm" (click)="nextPage()" [disabled]="page === totalPages">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 24px; }
    h3 { margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; margin-bottom: 4px; font-size: 13px; color: var(--text-muted); }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .filters { display: flex; gap: 8px; }
    .filters input { width: 200px; }
    .question-item { padding: 12px; background: var(--bg-input); border-radius: 8px; margin-bottom: 8px; }
    .q-info { display: flex; gap: 8px; margin-bottom: 4px; }
    .q-topic { font-weight: 600; font-size: 13px; }
    .q-type { font-size: 12px; color: var(--primary-light); }
    .q-diff { font-size: 12px; padding: 2px 8px; border-radius: 4px; }
    .diff-easy { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
    .diff-medium { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .diff-hard { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .q-text { font-size: 14px; margin-bottom: 8px; }
    .q-actions { text-align: right; }
    .btn-sm { padding: 4px 10px; font-size: 12px; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 16px; }
  `],
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];
  total = 0;
  page = 1;
  totalPages = 1;
  filterTopic = '';
  newQuestion: Partial<Question> = {
    topic: '',
    questionText: '',
    type: 'objective',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswer: '',
    modelAnswer: '',
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.adminService.getQuestions(this.filterTopic || undefined, undefined, this.page).subscribe((res) => {
      this.questions = res.questions;
      this.total = res.total;
      this.totalPages = res.totalPages;
    });
  }

  addQuestion(): void {
    this.adminService.createQuestion(this.newQuestion).subscribe(() => {
      this.loadQuestions();
      this.newQuestion = { topic: '', questionText: '', type: 'objective', difficulty: 'medium', options: ['', '', '', ''], correctAnswer: '', modelAnswer: '' };
    });
  }

  deleteQuestion(id: string): void {
    if (confirm('Delete this question?')) {
      this.adminService.deleteQuestion(id).subscribe(() => this.loadQuestions());
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadQuestions();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadQuestions();
    }
  }
}
