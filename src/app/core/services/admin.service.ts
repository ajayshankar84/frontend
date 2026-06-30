import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStats, Question } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:3000/admin';

  constructor(private http: HttpClient) {}

  getQuestions(topic?: string, type?: string, page = 1, limit = 20): Observable<any> {
    let params: any = { page, limit };
    if (topic) params.topic = topic;
    if (type) params.type = type;
    return this.http.get(`${this.apiUrl}/questions`, { params });
  }

  createQuestion(data: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/questions`, data);
  }

  updateQuestion(id: string, data: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, data);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/questions/${id}`);
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
  }

  getUsers(page = 1, limit = 20): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, { params: { page, limit } });
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }
}
