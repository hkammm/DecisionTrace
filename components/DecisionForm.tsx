
import React, { useState } from 'react';
import { Decision, DecisionContext, DecisionOption, Assumption } from '../types';

interface DecisionFormProps {
  onSave: (decision: Omit<Decision, 'id' | 'userId' | 'createdAt'>) => void;
  onCancel: () => void;
}

const DecisionForm: React.FC<DecisionFormProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [context, setContext] = useState<DecisionContext>(DecisionContext.PERSONAL);
  const [confidence, setConfidence] = useState(5);
  const [targetDate, setTargetDate] = useState('');
  const [options, setOptions] = useState<DecisionOption[]>([]);
  const [assumptions, setAssumptions] = useState<Assumption[]>([]);

  const [newOption, setNewOption] = useState('');
  const [newAssumption, setNewAssumption] = useState('');

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setOptions([...options, { id: Math.random().toString(36).substr(2, 9), name: newOption, pros: [], cons: [] }]);
    setNewOption('');
  };

  const handleAddAssumption = () => {
    if (!newAssumption.trim()) return;
    setAssumptions([...assumptions, { id: Math.random().toString(36).substr(2, 9), statement: newAssumption }]);
    setNewAssumption('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate || options.length === 0) {
      alert("Please fill in basic details and at least one option.");
      return;
    }
    onSave({
      title,
      description,
      context,
      confidenceLevel: confidence,
      targetDecisionDate: targetDate,
      options,
      assumptions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">New Decision Trace</h2>
        <p className="text-slate-500 text-sm">Document your reasoning now to learn from it later.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., Accepting Google Offer vs Startup X"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Context</label>
          <select
            className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={context}
            onChange={(e) => setContext(e.target.value as DecisionContext)}
          >
            {Object.values(DecisionContext).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Description & Context</label>
          <textarea
            className="w-full border-slate-200 border rounded-lg p-2.5 h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Provide context for why this decision is being made..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Confidence (1-10)</label>
            <input
              type="range"
              min="1"
              max="10"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Very Unsure</span>
              <span className="font-bold text-indigo-600">{confidence}</span>
              <span>Fully Certain</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Review Date</label>
            <input
              type="date"
              className="w-full border-slate-200 border rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Options Being Considered</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow border-slate-200 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Add an option..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
            />
            <button
              type="button"
              onClick={handleAddOption}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map(opt => (
              <span key={opt.id} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                {opt.name}
                <button 
                  type="button" 
                  onClick={() => setOptions(options.filter(o => o.id !== opt.id))}
                  className="ml-2 hover:text-indigo-900"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Assumptions You're Making</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-grow border-slate-200 border rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., 'Remote work will be allowed long-term'"
              value={newAssumption}
              onChange={(e) => setNewAssumption(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAssumption())}
            />
            <button
              type="button"
              onClick={handleAddAssumption}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-900"
            >
              Add
            </button>
          </div>
          <div className="space-y-1">
            {assumptions.map(asm => (
              <div key={asm.id} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded">
                <span className="mr-2">💡</span>
                <span className="flex-grow">{asm.statement}</span>
                <button 
                  type="button" 
                  onClick={() => setAssumptions(assumptions.filter(a => a.id !== asm.id))}
                  className="text-slate-400 hover:text-rose-500"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          Track Decision
        </button>
      </div>
    </form>
  );
};

export default DecisionForm;
