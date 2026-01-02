
export enum DecisionContext {
  PERSONAL = 'Personal',
  CAREER = 'Career',
  BUSINESS = 'Business',
  STUDY = 'Study',
  OTHER = 'Other'
}

export enum OutcomeType {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  PARTIAL = 'Partial Success',
  FAILURE = 'Failure'
}

export interface DecisionOption {
  id: string;
  name: string;
  pros: string[];
  cons: string[];
}

export interface Assumption {
  id: string;
  statement: string;
  wasCorrect?: boolean;
}

export interface DecisionReview {
  outcome: OutcomeType;
  whatWentWrong: string;
  lessonsLearned: string;
  reviewedAt: string;
}

export interface Decision {
  id: string;
  userId: string;
  title: string;
  description: string;
  context: DecisionContext;
  options: DecisionOption[];
  assumptions: Assumption[];
  confidenceLevel: number; // 1-10
  targetDecisionDate: string;
  createdAt: string;
  review?: DecisionReview;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AIInsight {
  patterns: string[];
  cognitiveBiases: string[];
  suggestedReflections: string[];
}
