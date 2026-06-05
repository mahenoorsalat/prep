// ============================================================
// Preproute Test Management — Type Definitions
// ============================================================

// --- Auth ---
export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

// --- Subject / Topic ---
export interface Subject {
  _id: string;
  name: string;
}

export interface Topic {
  _id: string;
  name: string;
  subjectId: string;
}

export interface SubTopic {
  _id: string;
  name: string;
  topicId: string;
}

// --- Test ---
export type TestType = 'chapterwise' | 'pyq' | 'mocktest';
export type DifficultyLevel = 'easy' | 'medium' | 'difficult';
export type LiveUntilOption = 'always' | '1week' | '2weeks' | '3weeks' | '1month' | 'custom';

export interface MarkingScheme {
  wrongAnswer: number;
  unattempted: number;
  correctAnswer: number;
}

export interface Test {
  _id: string;
  name: string;
  testType: TestType;
  subject: Subject | string;
  topic: Topic | string;
  subTopic: SubTopic | string;
  duration: number; // in minutes
  difficultyLevel: DifficultyLevel;
  markingScheme: MarkingScheme;
  numberOfQuestions: number;
  totalMarks: number;
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  liveUntil?: string;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestRequest {
  name: string;
  testType: TestType;
  subject: string;
  topic: string;
  subTopic: string;
  duration: number;
  difficultyLevel: DifficultyLevel;
  markingScheme: MarkingScheme;
  numberOfQuestions: number;
}

// --- Question ---
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  testId: string;
  questionNumber: number;
  questionText: string;
  options: QuestionOption[];
  solution: string;
  difficultyLevel: DifficultyLevel;
  topic: string;
  subTopic: string;
  marks: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateQuestionRequest {
  questionText: string;
  options: Omit<QuestionOption, 'id'>[];
  solution: string;
  difficultyLevel: DifficultyLevel;
  topic: string;
  subTopic: string;
}

// --- Publish ---
export interface PublishRequest {
  publishType: 'now' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  liveUntil: LiveUntilOption;
  endDate?: string;
  endTime?: string;
}
