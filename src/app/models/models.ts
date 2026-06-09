export type QuizLength = 'short' | 'medium' | 'long';
export const SKIP_OPTION_ID = '__skip__';

export interface Candidate {
  id: string;
  name: string;
  party: string;
  color: string;
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  estimatedTime: number;
}

export interface Question {
  id: string;
  themeId: string;
  text: string;
  importance: 1 | 2 | 3;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  text: string;
  positions: Record<string, number>;
}

export interface UserAnswer {
  questionId: string;
  optionId: string;
  themeId: string;
}

export interface AnswerDetail {
  questionText: string;
  userOptionText: string;
  position: number;
  themeId: string;
}

export interface ScoreResult {
  candidateId: string;
  candidateName: string;
  party: string;
  color: string;
  score: number;
  percentage: number;
}

export interface UserState {
  quizLength: QuizLength;
  selectedThemes: string[];
  answers: UserAnswer[];
  startTime: number;
  completed: boolean;
}
