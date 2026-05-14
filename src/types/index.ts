export type UUID = string;

export interface User {
  id: UUID;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  bio?: string;
  role: "student" | "teacher" | "admin";
}

export type ContentStatus = "pending" | "processing" | "completed" | "failed";
export type ContentSource = "file" | "url" | "youtube";

export interface Content {
  id: UUID;
  title: string;
  source: ContentSource;
  status: ContentStatus;
  createdAt: string;
  size?: string;
  thumbnail?: string;
  description?: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "short_answer";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: UUID;
  type: QuestionType;
  text: string;
  options: QuestionOption[];
  explanation?: string;
  order: number;
}

export interface Quiz {
  id: UUID;
  title: string;
  description?: string;
  difficulty: Difficulty;
  questionCount: number;
  questions: Question[];
  contentId?: UUID;
  isPublished: boolean;
  shareCode?: string;
  createdAt: string;
  subject?: string;
  attempts?: number;
  avgScore?: number;
}

export type FlashcardRating = "forgot" | "hard" | "good" | "clear";

export interface Flashcard {
  id: UUID;
  front: string;
  back: string;
  quizId: UUID;
  nextReview?: string;
  interval?: number;
  ease?: number;
}

export interface ClassRoom {
  id: UUID;
  name: string;
  description?: string;
  joinCode: string;
  ownerId: UUID;
  memberCount: number;
  subject?: string;
  color?: string;
  createdAt: string;
}

export interface ClassMember {
  id: UUID;
  name: string;
  email: string;
  role: "teacher" | "student";
  avatar?: string;
  joinedAt: string;
  groupId?: UUID;
}

export interface ClassGroup {
  id: UUID;
  name: string;
  classId: UUID;
  memberIds: UUID[];
}

export interface Assignment {
  id: UUID;
  title: string;
  quizId: UUID;
  classId: UUID;
  dueDate: string;
  status: "draft" | "published" | "closed";
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
}

export interface Submission {
  id: UUID;
  assignmentId: UUID;
  studentId: UUID;
  studentName: string;
  score: number;
  total: number;
  submittedAt: string;
  duration: number;
}

export type GamePhase = "lobby" | "question" | "answer" | "leaderboard" | "ended";

export interface GamePlayer {
  id: UUID;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  rank?: number;
}

export interface Game {
  id: UUID;
  pin: string;
  quizId: UUID;
  hostId: UUID;
  phase: GamePhase;
  currentQuestion: number;
  players: GamePlayer[];
  createdAt: string;
}

export interface ReviewStats {
  streak: number;
  dueToday: number;
  reviewed: number;
  retention: number;
  bySubject: { subject: string; total: number; mastered: number }[];
}
