import mongoose, { Document, Schema } from 'mongoose';

export interface IDecisionOption {
  id: string;
  name: string;
  pros: string[];
  cons: string[];
}

export interface IAssumption {
  id: string;
  statement: string;
  wasCorrect?: boolean;
}

export interface IDecisionReview {
  outcome: 'Pending' | 'Success' | 'Partial Success' | 'Failure';
  whatWentWrong: string;
  lessonsLearned: string;
  reviewedAt: string;
}

export interface IDecision extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  context: 'Personal' | 'Career' | 'Business' | 'Study' | 'Other';
  options: IDecisionOption[];
  assumptions: IAssumption[];
  confidenceLevel: number;
  targetDecisionDate: string;
  createdAt: Date;
  review?: IDecisionReview;
}

const decisionSchema = new Schema<IDecision>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  context: { 
    type: String, 
    enum: ['Personal', 'Career', 'Business', 'Study', 'Other'],
    required: true 
  },
  options: [{
    id: String,
    name: String,
    pros: [String],
    cons: [String]
  }],
  assumptions: [{
    id: String,
    statement: String,
    wasCorrect: Boolean
  }],
  confidenceLevel: { type: Number, required: true, min: 1, max: 10 },
  targetDecisionDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  review: {
    outcome: String,
    whatWentWrong: String,
    lessonsLearned: String,
    reviewedAt: String
  }
});

export const Decision = mongoose.model<IDecision>('Decision', decisionSchema);
