import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Question,
  QuestionResponse,
  EvaluationResult,
  PaperResponse,
  GradingResult,
  Result,
  ProgressData,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PracticeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getQuestion(topic: string, type: string, difficulty?: string): Observable<QuestionResponse> {
    return this.http.post<QuestionResponse>(`${this.apiUrl}/practice/get-question`, {
      topic,
      type,
      difficulty,
    });
  }

  submitAnswer(questionId: string, answer: string, mode: string): Observable<EvaluationResult> {
    return this.http.post<EvaluationResult>(`${this.apiUrl}/practice/submit-answer`, {
      questionId,
      answer,
      mode,
    });
  }

  generatePaper(topic: string, type: string, count: number): Observable<PaperResponse> {
    return this.http.post<PaperResponse>(`${this.apiUrl}/practice/generate-paper`, {
      topic,
      type,
      count,
    });
  }

  gradePaper(paperId: string, answers: { questionId: string; answer: string }[]): Observable<GradingResult> {
    return this.http.post<GradingResult>(`${this.apiUrl}/practice/grade-paper`, {
      paperId,
      answers,
    });
  }

  getHistory(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/history`);
  }

  getProgress(): Observable<ProgressData> {
    return this.http.get<ProgressData>(`${this.apiUrl}/results/progress`);
  }
}
