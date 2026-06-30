export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  preferredLanguage: string;
  targetExams: string[];
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Question {
  _id: string;
  topic: string;
  subTopic: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  modelAnswer: string;
  difficulty: string;
  type: string;
  source: string;
}

export interface QuestionResponse {
  question: Question;
  source: string;
}

export interface EvaluationResult {
  feedback: string;
  score: number;
  nextQuestion?: string;
  sessionId?: string;
}

export interface PaperResponse {
  paperId: string;
  questions: Question[];
  source: string;
}

export interface GradingResult {
  totalScore: number;
  maxScore: number;
  grade: string;
  answers: any[];
}

export interface Result {
  _id: string;
  userId: string;
  mode: string;
  topic: string;
  answers: any[];
  totalScore: number;
  maxScore: number;
  grade: string;
  aiFeedback: string;
  createdAt: string;
}

export interface ProgressData {
  labels: string[];
  scores: number[];
  results: Result[];
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalSessions: number;
  questionsByTopic: any[];
  recentResults: any[];
}
