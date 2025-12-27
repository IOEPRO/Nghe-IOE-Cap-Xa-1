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
  const [hintText, setHintText] = useState('');

  useEffect(() => {
    setInputVal('');
    setSelectedParts([]);
    setShowHint(false);
    setHintText('');
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

  const handlePartClick = (part: string) => {
    if (!isAnswered) {
      if (selectedParts.includes(part)) {
        setSelectedParts(selectedParts.filter(p => p !== part));
      } else {
        setSelectedParts([...selectedParts, part]);
      }
    }
  };

  const handleRearrangeSubmit = () => {
    if (!isAnswered && selectedParts.length > 0) {
      onAnswer(selectedParts.join(' '));
    }
  };

  const generateHint = () => {
    if (hintText) return;
    let text = '';
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      const wrongOptions = question.options?.filter(opt => opt !== question.correctAnswer) || [];
      if (wrongOptions.length > 0) {
        const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
        text = `Gợi ý 50/50: Loại bỏ đáp án "${randomWrong}".`;
      }
    } else if (question.type === QuestionType.FILL_IN_BLANK) {
      const answer = question.correctAnswer.trim();
      text = `Từ này có ${answer.length} chữ cái. Bắt đầu bằng "${answer.charAt(0).toUpperCase()}...".`;
    } else {
      const words = question.correctAnswer.split(' ');
      const hintPhrase = words.slice(0, Math.max(1, Math.floor(words.length / 2))).join(' ');
      text = `Gợi ý: Câu bắt đầu bằng "${hintPhrase}..."`;
    }
    setHintText(text);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-extrabold uppercase">
              {question.type.replace(/_/g, ' ')}
            </span>
            {!isAnswered && (
              <button 
                onClick={() => { generateHint(); setShowHint(!showHint); }} 
                className="px-3 py-1 text-xs font-bold border rounded-full bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100"
              >
                {showHint ? 'Ẩn Gợi ý' : 'Gợi ý'}
              </button>
            )}
          </div>
          <span className="text-xs font-bold text-slate-300">ID: {question.id}</span>
        </div>
        <div className="p-6 sm:p-10">
          <div className="mb-6 space-y-4">
            {question.imageUrl && (
              <div className="flex justify-center">
                <img 
                  src={question.imageUrl} 
                  className="max-h-72 rounded-lg shadow-md" 
                  alt="Question illustration"
                  onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
              </div>
            )}
            {question.audioUrl && (
              <div className="bg-blue-50 p-4 rounded-xl">
                <AudioPlayer src={question.audioUrl} />
              </div>
            )}
          </div>

          {showHint && !isAnswered && (
            <div className="mb-6 bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
              <strong>Gợi ý:</strong> {hintText}
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{question.questionText}</h2>

          {question.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="grid grid-cols-1 gap-3">
              {question.options?.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleMCSelect(opt)} 
                  disabled={isAnswered} 
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                    isAnswered 
                      ? (opt === question.correctAnswer 
                          ? 'bg-green-100 border-green-500 text-green-900' 
                          : opt === userAnswer 
                            ? 'bg-red-100 border-red-500 text-red-900' 
                            : 'bg-slate-50 opacity-60'
                        ) 
                      : 'bg-white hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <span className="font-bold mr-4 w-6 inline-block">{String.fromCharCode(65 + idx)}</span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {question.type === QuestionType.FILL_IN_BLANK && (
            <form onSubmit={handleInputSubmit} className="flex flex-col gap-2">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={isAnswered && userAnswer ? userAnswer : inputVal} 
                  onChange={(e) => setInputVal(e.target.value)} 
                  disabled={isAnswered} 
                  className={`flex-1 p-4 rounded-xl border-2 text-lg outline-none ${
                    isAnswered 
                      ? (isCorrect() ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') 
                      : 'border-slate-200 focus:border-blue-500'
                  }`} 
                  placeholder="Nhập đáp án..." 
                />
                {!isAnswered && <Button type="submit">Trả lời</Button>}
              </div>
              {!isAnswered && <div className="text-xs text-slate-400 text-right">Đã nhập: {inputVal.length} ký tự</div>}
            </form>
          )}

          {question.type === QuestionType.REARRANGE && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border shadow-inner min-h-[60px]">
                {question.rearrangeParts?.map((part, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handlePartClick(part)} 
                    disabled={isAnswered || selectedParts.includes(part)} 
                    className={`px-4 py-2 rounded-lg bg-white border shadow-sm transition-all active:scale-95 ${
                      selectedParts.includes(part) ? 'opacity-0 pointer-events-none' : 'hover:border-blue-400'
                    }`}
                  >
                    {part}
                  </button>
                ))}
              </div>
              <div className={`min-h-[80px] p-4 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center ${
                isAnswered 
                  ? (isCorrect() ? 'border-green-500 bg-green-50/50' : 'border-red-500 bg-red-50/50') 
                  : 'border-slate-300 bg-white'
              }`}>
                {selectedParts.length === 0 && !isAnswered && (
                  <div className="w-full text-center text-slate-400 italic">Bấm từ để sắp xếp...</div>
                )}
                {selectedParts.map((part, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => handlePartClick(part)} 
                    disabled={isAnswered} 
                    className="bg-blue-100 text-blue-900 px-3 py-1.5 rounded-lg border border-blue-200 font-medium shadow-sm hover:bg-red-100 hover:text-red-800 transition-colors"
                  >
                    {part}
                  </button>
                ))}
              </div>
              {!isAnswered && (
                <div className="flex justify-end">
                  <Button onClick={handleRearrangeSubmit} disabled={selectedParts.length === 0}>Xác nhận</Button>
                </div>
              )}
            </div>
          )}

          {isAnswered && (
            <div className={`mt-8 p-6 rounded-xl border-l-4 shadow-sm animate-fade-in ${isCorrect() ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold ${isCorrect() ? 'bg-green-500' : 'bg-red-500'}`}>
                  {isCorrect() ? '✓' : '✕'}
                </div>
                <div>
                  <h3 className={`font-bold text-xl mb-2 ${isCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect() ? 'Chính xác!' : 'Chưa chính xác'}
                  </h3>
                  {!isCorrect() && (
                    <div className="mb-2">
                      <span className="text-red-600 font-bold text-sm uppercase">Đáp án đúng:</span> 
                      <span className="font-bold text-slate-800 ml-2">{question.correctAnswer}</span>
                    </div>
                  )}
                  <div className="bg-white/60 p-3 rounded-lg text-slate-700 text-sm">
                    <span className="font-bold text-blue-600 block mb-1">Giải thích:</span>
                    {question.explanation}
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