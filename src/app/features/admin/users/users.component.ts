import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { AdminStats } from '../../../core/models/api.models';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Admin Dashboard</h1>

      <div class="grid grid-3" style="margin-bottom: 24px;">
        <div class="card stat-card">
          <div class="stat-value">{{ stats?.totalUsers || 0 }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">{{ stats?.totalQuestions || 0 }}</div>
          <div class="stat-label">Total Questions</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">{{ stats?.totalSessions || 0 }}</div>
          <div class="stat-label">Total Sessions</div>
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px;">
        <h3>Questions by Topic</h3>
        <div class="topic-list">
          <div *ngFor="let t of stats?.questionsByTopic || []" class="topic-item">
            <span>{{ t._id }}</span>
            <span class="topic-count">{{ t.count }}</span>
          </div>
          <div *ngIf="!stats?.questionsByTopic?.length" class="no-data">No data yet</div>
        </div>
      </div>

      <div class="card">
        <h3>Users</h3>
        <div class="users-list">
          <div *ngFor="let user of users" class="user-item">
            <div class="user-info">
              <strong>{{ user.name }}</strong>
              <span class="user-email">{{ user.email }}</span>
            </div>
            <div class="user-role">
              <span [class]="'role-badge role-' + user.role">{{ user.role }}</span>
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
    .topic-list { display: flex; flex-direction: column; gap: 8px; }
    .topic-item { display: flex; justify-content: space-between; padding: 8px 12px; background: var(--bg-input); border-radius: 6px; }
    .topic-count { font-weight: 600; color: var(--primary-light); }
    .no-data { color: var(--text-muted); text-align: center; padding: 20px; }
    .user-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-input); border-radius: 8px; margin-bottom: 8px; }
    .user-email { font-size: 13px; color: var(--text-muted); margin-left: 8px; }
    .role-badge { font-size: 12px; padding: 2px 8px; border-radius: 4px; font-weight: 600; }
    .role-user { background: rgba(99, 102, 241, 0.2); color: var(--primary-light); }
    .role-admin { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .role-super_admin { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
    .pagination { display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 16px; }
    .btn-sm { padding: 4px 10px; font-size: 12px; }
  `],
})
export class UsersComponent implements OnInit {
  stats: AdminStats | null = null;
  users: any[] = [];
  page = 1;
  totalPages = 1;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  loadStats(): void {
    this.adminService.getStats().subscribe((stats) => (this.stats = stats));
  }

  loadUsers(): void {
    this.adminService.getUsers(this.page).subscribe((res) => {
      this.users = res.users;
      this.totalPages = res.totalPages;
    });
  }

  nextPage(): void {
    this.page++;
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }
}
