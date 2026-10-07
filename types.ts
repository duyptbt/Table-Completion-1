export interface Section {
  id: string;
  title: string;
  content: string;
}

export enum QuestionType {
  MATCHING = 'MATCHING',
  TABLE_COMPLETION = 'TABLE_COMPLETION',
  TRUE_FALSE = 'TRUE_FALSE'
}

export interface QuestionBase {
  id: string;
  type: QuestionType;
  instruction: string;
}

export interface MatchingQuestion extends QuestionBase {
  type: QuestionType.MATCHING;
  items: { 
    id: string; 
    label: string;
    explanation?: string;
  }[];
  options: { id: string; label: string }[];
  correctMapping: Record<string, string>; // item.id -> option.id
}

export interface TableRow {
  id: string;
  col1: string;
  col2: string;
  answerKey?: string; // If this row has an input
  correctAnswer?: string[]; // Possible correct strings (lowercase)
  explanation?: string;
}

export interface TableCompletionQuestion extends QuestionBase {
  type: QuestionType.TABLE_COMPLETION;
  headers: string[];
  rows: TableRow[];
}

export interface TFQuestionItem {
  id: string;
  statement: string;
  correctAnswer: 'TRUE' | 'FALSE' | 'NOT GIVEN';
  explanation?: string;
}

export interface TrueFalseQuestion extends QuestionBase {
  type: QuestionType.TRUE_FALSE;
  items: TFQuestionItem[];
}

export type Question = MatchingQuestion | TableCompletionQuestion | TrueFalseQuestion;

export interface UserAnswers {
  matching: Record<string, string>; // sectionId -> headingId
  table: Record<string, string>; // rowId -> user text
  tf: Record<string, string>; // itemId -> T/F/NG
}