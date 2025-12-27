import React from 'react';
import { Question, UserAnswer } from '../types';

interface QuestionGridProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  currentIndex: number;
  onJump: (index: number) => void;
  onClose: () => void;
}

const QuestionGrid: React.FC<QuestionGridProps> = ({ questions, userAnswers, currentIndex, onJump, onClose }) => {
  const getStatusColor = (q: Question, idx: number) => {
    const ans = userAnswers.find(a => a.questionId === q.id);
    if (idx === currentIndex) return "ring-2 ring-blue-500 border-blue-500 text-blue-600 bg-white";
    if (!ans) return "bg-slate-100 text-slate-400 border-transparent";
    return ans.isCorrect ? "bg-green-500 text-white border-green-600" : "bg-red-500 text-white border-red-600";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold">Danh sách câu hỏi</h2>
            <p className="text-sm text-slate-500">Đã làm: {userAnswers.length} / {questions.length}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {questions.map((q, idx) => (
              <button 
                key={q.id} 
                onClick={() => { onJump(idx); onClose(); }} 
                className={`h-10 w-10 rounded-lg font-bold text-sm border transition-all ${getStatusColor(q, idx)}`}
              >
                {q.id}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t text-xs text-slate-500 flex gap-4 justify-center flex-wrap">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Đúng</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> Sai</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 ring-2 ring-blue-500 rounded-full bg-white"></span> Đang làm</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-200 rounded-full"></span> Chưa làm</div>
        </div>
      </div>
    </div>
  );
};

export default QuestionGrid;