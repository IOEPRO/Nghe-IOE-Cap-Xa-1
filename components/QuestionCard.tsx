
import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import Button from './Button';
import AudioPlayer from './AudioPlayer';

interface QuestionCardProps {
  question: Question;
  onAnswer: (response: string) => void;
  isAnswered: boolean;
  userAnswer?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, isAnswered, userAnswer }) => {
  const [inputVal, setInputVal] = useState('');
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hintInfo, setHintInfo] = useState<{ length?: number, firstChar?: string, text?: string }>({});

  useEffect(() => {
    setInputVal('');
    setSelectedParts([]);
    setShowHint(false);
    setHintInfo({});
  }, [question.id]);

  const normalize = (str?: string) => str ? str.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase() : "";
  const isCorrect = () => userAnswer && normalize(userAnswer) === normalize(question.correctAnswer);

  const handleMCSelect = (opt: string) => {
    if (!isAnswered) {
      onAnswer(opt);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnswered && inputVal.trim()) {
      onAnswer(inputVal.trim());
    }
  };

  const generateHint = () => {
    if (Object.keys(hintInfo).length > 0) return;
    
    if (question.type === QuestionType.FILL_IN_BLANK) {
      const ans = question.correctAnswer.trim();
      setHintInfo({
        length: ans.length,
        firstChar: ans.charAt(0).toUpperCase(),
        text: "Hãy tập trung nghe kỹ từ còn thiếu trong đoạn audio."
      });
    } else if (question.type === QuestionType.MULTIPLE_CHOICE) {
      setHintInfo({
        text: "Gợi ý: Hãy loại bỏ những đáp án bạn nghe thấy rõ ràng là không khớp với ngữ cảnh."
      });
    } else {
      setHintInfo({
        text: "Gợi ý: Chú ý thứ tự các thành phần S + V + O trong câu."
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-wider">
              {question.type.replace(/_/g, ' ')}
            </span>
            {!isAnswered && (
              <button 
                onClick={() => { generateHint(); setShowHint(!showHint); }} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase border-2 rounded-full bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 transition-all"
              >
                <span>{showHint ? 'Ẩn Gợi ý' : 'Gợi ý 💡'}</span>
              </button>
            )}
          </div>
          <span className="text-[10px] font-black text-slate-300">QUESTION ID: {question.id}</span>
        </div>
        
        <div className="p-8 sm:p-12">
          <div className="mb-8 space-y-4">
            {question.audioUrl && (
              <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
                <AudioPlayer src={question.audioUrl} />
              </div>
            )}
          </div>

          {showHint && !isAnswered && (
            <div className="mb-8 bg-amber-50 p-5 rounded-2xl text-sm text-amber-900 border-2 border-amber-100 shadow-inner animate-fade-in">
              <div className="flex flex-col gap-2 font-bold">
                {hintInfo.length && (
                  <p className="flex items-center gap-2">
                    <span className="text-amber-500">📏</span> 
                    Độ dài: <span className="text-indigo-600">{hintInfo.length} chữ cái</span>
                  </p>
                )}
                {hintInfo.firstChar && (
                  <p className="flex items-center gap-2">
                    <span className="text-amber-500">🔤</span> 
                    Bắt đầu bằng: <span className="text-indigo-600 text-lg">"{hintInfo.firstChar}"</span>
                  </p>
                )}
                {hintInfo.text && (
                  <p className="italic text-amber-700 mt-1 flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">ℹ️</span>
                    {hintInfo.text}
                  </p>
                )}
              </div>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-10 leading-relaxed">
            {question.questionText}
          </h2>

          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 gap-4">
              {question.options?.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleMCSelect(opt)} 
                  disabled={isAnswered} 
                  className={`w-full p-5 rounded-2xl text-left border-2 transition-all font-bold text-lg flex items-center gap-4 ${
                    isAnswered 
                      ? (opt === question.correctAnswer 
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                          : opt === userAnswer 
                            ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200' 
                            : 'bg-slate-50 opacity-40 text-slate-400'
                        ) 
                      : 'bg-white border-slate-100 hover:border-indigo-500 hover:shadow-md text-slate-700'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border-2 ${isAnswered && opt === question.correctAnswer ? 'bg-white/20 border-white' : 'bg-slate-50 border-slate-100'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === QuestionType.FILL_IN_BLANK && (
            <form onSubmit={handleInputSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={isAnswered && userAnswer ? userAnswer : inputVal} 
                  onChange={(e) => setInputVal(e.target.value)} 
                  disabled={isAnswered} 
                  className={`flex-1 p-5 rounded-2xl border-2 font-black text-xl outline-none transition-all ${
                    isAnswered 
                      ? (isCorrect() ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-rose-500 bg-rose-50 text-rose-700') 
                      : 'border-slate-100 bg-slate-50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                  }`} 
                  placeholder="Nhập đáp án bạn nghe được..." 
                />
                {!isAnswered && (
                  <Button type="submit" size="lg" className="px-10">
                    GỬI
                  </Button>
                )}
              </div>
              {!isAnswered && <div className="text-xs font-black text-indigo-400 text-right uppercase tracking-widest">Đã nhập: {inputVal.length} KÝ TỰ</div>}
            </form>
          )}

          {isAnswered && (
            <div className={`mt-10 p-8 rounded-[2rem] border-l-8 shadow-xl animate-fade-in ${isCorrect() ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white font-black text-xl shadow-lg ${isCorrect() ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}>
                  {isCorrect() ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className={`font-black text-2xl mb-2 tracking-tight ${isCorrect() ? 'text-emerald-800' : 'text-rose-800'}`}>
                    {isCorrect() ? 'TUYỆT VỜI!' : 'CHƯA CHÍNH XÁC'}
                  </h3>
                  {!isCorrect() && (
                    <div className="mb-4">
                      <span className="text-rose-600 font-black text-xs uppercase tracking-widest">Đáp án đúng:</span> 
                      <span className="font-black text-slate-800 ml-2 text-xl underline decoration-rose-300 decoration-4 underline-offset-4">{question.correctAnswer.toUpperCase()}</span>
                    </div>
                  )}
                  <div className="bg-white/70 p-5 rounded-2xl text-slate-700 font-bold border border-white">
                    <span className="text-indigo-600 block mb-2 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                      Giải thích & Dịch thuật
                    </span>
                    <p className="leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
