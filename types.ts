export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  FILL_IN_BLANK = 'FILL_IN_BLANK',
  REARRANGE = 'REARRANGE'
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Question {
  id: number;
  type: QuestionType;
  questionText: string;
  correctAnswer: string;
  explanation: string;
  options?: string[];
  rearrangeParts?: string[];
  audioUrl?: string;
  imageUrl?: string;
}

export interface UserAnswer {
  questionId: number;
  userResponse: string;
  isCorrect: boolean;
}