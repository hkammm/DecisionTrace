
import React from 'react';
import { Decision, OutcomeType } from '../types';

interface DecisionCardProps {
  decision: Decision;
  onReview?: (decision: Decision) => void;
  onClick?: (decision: Decision) => void;
}

const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onReview, onClick }) => {
  const getOutcomeColor = (outcome?: OutcomeType) => {
    switch (outcome) {
      case OutcomeType.SUCCESS: return 'bg-emerald-100 text-emerald-800';
      case OutcomeType.FAILURE: return 'bg-rose-100 text-rose-800';
      case OutcomeType.PARTIAL: return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const isPendingReview = !decision.review && new Date(decision.targetDecisionDate) <= new Date();

  return (
    <div 
      className={`bg-white border border-slate-200 rounded-xl p-6 transition-all shadow-sm hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      onClick={() => onClick?.(decision)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
            {decision.context}
          </span>
          <h3 className="text-lg font-bold text-slate-800 mt-2">{decision.title}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-bold ${getOutcomeColor(decision.review?.outcome)}`}>
          {decision.review?.outcome || 'Active'}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm line-clamp-2 mb-4">
        {decision.description}
      </p>

      <div className="flex items-center space-x-4 text-xs text-slate-500 mb-6">
        <div className="flex items-center">
          <span className="mr-1">Confidence:</span>
          <span className="font-bold text-slate-700">{decision.confidenceLevel}/10</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1">Target:</span>
          <span className="font-bold text-slate-700">{new Date(decision.targetDecisionDate).toLocaleDateString()}</span>
        </div>
      </div>

      {isPendingReview && onReview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReview(decision);
          }}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          Review Outcome
        </button>
      )}
      
      {!isPendingReview && decision.review && (
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 mb-1 uppercase">Lesson Learned:</p>
          <p className="text-sm text-slate-700 line-clamp-2 italic italic">
            "{decision.review.lessonsLearned}"
          </p>
        </div>
      )}
    </div>
  );
};

export default DecisionCard;
