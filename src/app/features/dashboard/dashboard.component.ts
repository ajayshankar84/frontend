import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PracticeService } from '../../core/services/practice.service';
import { Result, ProgressData } from '../../core/models/api.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p class="subtitle">Track your progress and performance</p>

      <div class="grid grid-4" style="margin-bottom: 24px;">
        <div class="card stat-card">
          <div class="stat-value">{{ results.length }}</div>
          <div class="stat-label">Sessions Completed</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">{{ averageScore }}%</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">{{ topGrade }}</div>
          <div class="stat-label">Best Grade</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">{{ recentResults.length }}</div>
          <div class="stat-label">Recent Activity</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3>Score Progress</h3>
          <div class="chart-container">
            <canvas id="progressChart"></canvas>
            <div *ngIf="progressData.scores.length === 0" class="no-data">
              Complete some practice sessions to see your progress here.
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Recent Results</h3>
          <div class="results-list">
            <div *ngFor="let result of recentResults" class="result-item">
              <div class="result-info">
                <span class="result-mode">{{ result.mode }}</span>
                <span class="result-topic">{{ result.topic }}</span>
              </div>
              <div class="result-score">
                <span class="grade" [class]="getGradeClass(result.grade)">{{ result.grade }}</span>
                <span class="score-text">{{ result.totalScore }}/{{ result.maxScore }}</span>
              </div>
            </div>
            <div *ngIf="recentResults.length === 0" class="no-data">No results yet. Start practicing!</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="grid grid-3">
          <a routerLink="/practice/interview" class="card action-card">
            <div class="action-icon">🎙</div>
            <h4>Live Interview</h4>
            <p>Practice with AI interviewer</p>
          </a>
          <a routerLink="/practice/subjective" class="card action-card">
            <div class="action-icon">📝</div>
            <h4>Subjective Paper</h4>
            <p>Write detailed answers</p>
          </a>
          <a routerLink="/practice/objective" class="card action-card">
            <div class="action-icon">✅</div>
            <h4>Objective Paper</h4>
            <p>Multiple choice questions</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: 28px; margin-bottom: 4px; }
    .subtitle { color: var(--text-muted); margin-bottom: 24px; }
    h3 { margin-bottom: 16px; font-size: 16px; }
    .chart-container { min-height: 200px; display: flex; align-items: center; justify-content: center; }
    .no-data { color: var(--text-muted); font-size: 14px; text-align: center; padding: 40px; }
    .results-list { display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
    .result-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-input); border-radius: 8px; }
    .result-mode { font-size: 12px; text-transform: uppercase; color: var(--primary-light); font-weight: 600; }
    .result-topic { font-size: 13px; color: var(--text-muted); margin-left: 8px; }
    .grade { font-weight: 700; font-size: 16px; margin-right: 8px; }
    .grade.grade-a { color: var(--success); }
    .grade.grade-b { color: var(--primary-light); }
    .grade.grade-c { color: var(--warning); }
    .grade.grade-f { color: var(--danger); }
    .score-text { font-size: 13px; color: var(--text-muted); }
    .quick-actions { margin-top: 32px; }
    .action-card { text-align: center; cursor: pointer; transition: transform 0.2s; }
    .action-card:hover { transform: translateY(-4px); }
    .action-icon { font-size: 40px; margin-bottom: 12px; }
    .action-card h4 { margin-bottom: 4px; }
    .action-card p { font-size: 13px; color: var(--text-muted); }
  `],
})
export class DashboardComponent implements OnInit {
  results: Result[] = [];
  recentResults: Result[] = [];
  progressData: ProgressData = { labels: [], scores: [], results: [] };
  averageScore = 0;
  topGrade = 'N/A';

  constructor(private practiceService: PracticeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.practiceService.getHistory().subscribe((results) => {
      this.results = results;
      this.recentResults = results.slice(0, 5);
      this.calculateStats();
    });

    this.practiceService.getProgress().subscribe((data) => {
      this.progressData = data;
      this.renderChart();
    });
  }

  calculateStats(): void {
    if (this.results.length === 0) return;
    const totalPct = this.results.reduce(
      (sum, r) => sum + (r.maxScore > 0 ? (r.totalScore / r.maxScore) * 100 : 0),
      0
    );
    this.averageScore = Math.round(totalPct / this.results.length);
    const grades = this.results.map((r) => r.grade).filter((g) => g);
    this.topGrade = grades[0] || 'N/A';
  }

  renderChart(): void {
    if (this.progressData.scores.length === 0) return;
    // Simple bar chart using divs
    const canvas = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scores = this.progressData.scores;
    const labels = this.progressData.labels;
    const maxH = 180;
    const barW = Math.min(40, (canvas.width - 60) / scores.length);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';

    scores.forEach((score, i) => {
      const x = 30 + i * (barW + 8);
      const h = (score / 100) * maxH;
      const y = maxH - h + 20;

      const gradient = ctx.createLinearGradient(x, y, x, maxH + 20);
      gradient.addColorStop(0, '#818cf8');
      gradient.addColorStop(1, '#4f46e5');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barW, h);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`${score}%`, x, y - 6);
      ctx.fillText(labels[i]?.slice(5) || '', x, maxH + 36);
    });
  }

  getGradeClass(grade: string): string {
    if (grade.startsWith('A')) return 'grade-a';
    if (grade.startsWith('B')) return 'grade-b';
    if (grade.startsWith('C')) return 'grade-c';
    return 'grade-f';
  }
}
