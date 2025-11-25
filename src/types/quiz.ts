export type QuestionType = "mcq" | "true_false";
export type Difficulty = "easy" | "medium" | "hard";

export interface QuizGenerationRequest {
  text: string;
  numQuestions: number;
  difficulty: Difficulty;
  questionType: QuestionType;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

export interface QuizGenerationResponse {
  success: boolean;
  quiz?: {
    questions: QuizQuestion[];
    metadata: {
      difficulty: Difficulty;
      questionType: QuestionType;
      totalQuestions: number;
      generatedAt: string;
    };
  };
  error?: string;
}
