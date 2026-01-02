
import React, { useState } from 'react';
import { Decision, OutcomeType, DecisionReview } from '../types';

interface ReviewModalProps {
  decision: Decision;
  onSave: (review: DecisionReview) => void;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ decision, onSave, onClose }) => {
  const [outcome, setOutcome] = useState<OutcomeType>(OutcomeType.SUCCESS);
  const [whatWentWrong, setWhatWentWrong] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [assumptionStates, setAssumptionStates] = useState<Record<string, boolean>>(
    Object.fromEntries(decision.assumptions.map(a => [a.id, true]))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      outcome,
      whatWentWrong,
      lessonsLearned,
      reviewedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Close the Loop</h2>
            <p className="text-slate-500 text-sm">Decision: <span className="font-bold text-indigo-600">{decision.title}</span></p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">What was the actual outcome?</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(OutcomeType).filter(v => v !== OutcomeType.PENDING).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setOutcome(v as OutcomeType)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                      outcome === v 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {decision.assumptions.length > 0 && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Check your assumptions:</label>
                <div className="space-y-2">
                  {decision.assumptions.map(asm => (
                    <div key={asm.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-sm text-slate-700 mr-2">{asm.statement}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAssumptionStates({...assumptionStates, [asm.id]: true})}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs ${assumptionStates[asm.id] ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                        >
                          ✓
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssumptionStates({...assumptionStates, [asm.id]: false})}
                          className={`w-8 h-8 rounded flex items-center justify-center text-xs ${!assumptionStates[asm.id] ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-400'}`}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">What actually happened? (Context)</label>
              <textarea
                className="w-full border-slate-200 border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Briefly describe the outcome..."
                value={whatWentWrong}
                onChange={(e) => setWhatWentWrong(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Lesson for future you:</label>
              <textarea
                className="w-full border-indigo-100 bg-indigo-50 border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none font-medium italic"
                placeholder="One sentence that will prevent a repeat mistake..."
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              Complete Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
