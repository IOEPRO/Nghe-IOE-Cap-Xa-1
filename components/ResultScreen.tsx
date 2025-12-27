import React from 'react';
import Button from './Button';
import { UserAnswer } from '../types';
import { QUIZ_DATA } from '../constants';

interface ResultScreenProps {
  userName: string;
  userAnswers: UserAnswer[];
  onRetryAll: () => void;
  onRetryWrong: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ userName, userAnswers, onRetryAll, onRetryWrong }) => {
  const correct = userAnswers.filter(a => a.isCorrect).length;
  const total = userAnswers.length;
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
  const hasWrong = correct < total;
  const score = correct * 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in bg-slate-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl w-full text-center">
        <div className="mb-6 relative inline-block">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="12" />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke={percent >= 80 ? '#10b981' : percent >= 50 ? '#3b82f6' : '#ef4444'} 
              strokeWidth="12" 
              strokeDasharray="339.292" 
              strokeDashoffset={339.292 - (339.292 * percent) / 100} 
              className="transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-slate-800">{percent}%</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành bài thi!</h2>
        <p className="text-slate-600 mb-4">Chúc mừng <b>{userName}</b></p>
        
        <div className="mb-8 inline-flex items-baseline gap-2 bg-blue-50 px-6 py-2 rounded-2xl border border-blue-100">
          <span className="text-4xl font-extrabold text-blue-600">{score}</span>
          <span className="text-lg text-slate-500 font-bold">điểm</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl">
          <div>
            <div className="text-2xl font-bold text-green-600">{correct}</div>
            <div className="text-xs uppercase text-slate-500 font-bold">Đúng</div>
          </div>
          <div className="border-l border-slate-200">
            <div className="text-2xl font-bold text-red-500">{total - correct}</div>
            <div className="text-xs uppercase text-slate-500 font-bold">Sai</div>
          </div>
        </div>
        {hasWrong && (
          <div className="text-left mb-6 max-h-48 overflow-y-auto custom-scrollbar border-t border-b py-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Cần xem lại</h3>
            <div className="space-y-2">
              {userAnswers.filter(a => !a.isCorrect).map((ans, i) => {
                const q = QUIZ_DATA.find(x => x.id === ans.questionId);
                return q ? (
                  <div key={i} className="text-sm p-2 bg-red-50 rounded">
                    <span className="font-bold text-red-500 mr-2">#{q.id}</span> 
                    {q.questionText} 
                    <br/>
                    <span className="text-xs text-slate-500">Đáp án: {q.correctAnswer}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={onRetryAll}>Chơi lại từ đầu</Button>
          {hasWrong && <Button onClick={onRetryWrong} variant="danger">Làm lại câu sai</Button>}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;