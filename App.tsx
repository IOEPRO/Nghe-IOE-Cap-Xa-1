import React, { useState } from 'react';
import { GameState, Question, UserAnswer } from './types';
import { QUIZ_DATA } from './constants';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import QuestionGrid from './components/QuestionGrid';
import ResultScreen from './components/ResultScreen';
import Button from './components/Button';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [userName, setUserName] = useState('');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showGrid, setShowGrid] = useState(false);

  const handleStart = (name: string) => {
    setUserName(name);
    startSession(QUIZ_DATA);
  };

  const startSession = (questions: Question[]) => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setUserAnswers([]);
    setGameState(GameState.PLAYING);
  };

  const handleAnswer = (response: string) => {
    const q = activeQuestions[currentIndex];
    const normalize = (s: string) => s.replace(/[.,!?;:'"]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const isCorrect = normalize(response) === normalize(q.correctAnswer);
    
    setUserAnswers(prev => [
      ...prev.filter(a => a.questionId !== q.id), 
      { questionId: q.id, userResponse: response, isCorrect }
    ]);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => handleNext();
  
  const handleFinish = () => setGameState(GameState.FINISHED);
  
  const handleRetryWrong = () => {
    const wrongIds = userAnswers.filter(a => !a.isCorrect).map(a => a.questionId);
    startSession(QUIZ_DATA.filter(q => wrongIds.includes(q.id)));
  };

  if (gameState === GameState.START) {
    return <StartScreen onStart={handleStart} />;
  }

  if (gameState === GameState.FINISHED) {
    return (
      <ResultScreen 
        userName={userName} 
        userAnswers={userAnswers} 
        onRetryAll={() => startSession(QUIZ_DATA)} 
        onRetryWrong={handleRetryWrong} 
      />
    );
  }

  const currentQ = activeQuestions[currentIndex];
  const answer = userAnswers.find(a => a.questionId === currentQ.id);
  const isAnswered = !!answer;
  const isLast = currentIndex === activeQuestions.length - 1;
  const allAnswered = userAnswers.length === activeQuestions.length;
  
  // Calculate Score: 10 points per correct answer
  const currentScore = userAnswers.filter(a => a.isCorrect).length * 10;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 pb-32 relative">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 uppercase">Người chơi</span>
          <span className="font-bold text-slate-700">{userName}</span>
        </div>
        
        <div className="flex flex-col items-center px-4 border-l border-r border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase">Điểm số</span>
          <span className="font-bold text-emerald-600 text-xl">{currentScore}</span>
        </div>

        <button 
          onClick={() => setShowGrid(true)} 
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-600"
        >
          Danh sách
        </button>
        
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 uppercase">Tiến độ</span>
          <span className="font-bold text-blue-600 text-xl">
            {currentIndex + 1} <span className="text-slate-400 text-sm">/ {activeQuestions.length}</span>
          </span>
        </div>
      </div>
      
      <div className="w-full max-w-3xl bg-slate-200 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 ease-out" 
          style={{ width: `${(userAnswers.length / activeQuestions.length) * 100}%` }}
        ></div>
      </div>
      
      <QuestionCard 
        question={currentQ} 
        onAnswer={handleAnswer} 
        isAnswered={isAnswered} 
        userAnswer={answer?.userResponse} 
      />
      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10">
        <div className="w-full max-w-3xl mx-auto flex justify-between items-center gap-4">
          <Button onClick={handlePrev} variant="outline" disabled={currentIndex === 0} className="w-24">← Trước</Button>
          <div className="flex-1 flex justify-center gap-3">
            {isAnswered ? (
              <>
                {!isLast && (
                  <Button onClick={handleNext} size="md" className="shadow-xl shadow-blue-500/20 animate-bounce-short">
                    Câu tiếp theo →
                  </Button>
                )}
                <Button onClick={handleFinish} variant={allAnswered ? "secondary" : "danger"}>
                  Nộp bài
                </Button>
              </>
            ) : (
              <Button onClick={handleSkip} variant="outline" className="text-slate-400 hover:text-slate-600">
                Bỏ qua
              </Button>
            )}
          </div>
          <Button 
            onClick={handleNext} 
            variant="outline" 
            disabled={isLast} 
            className={`w-24 ${isAnswered ? 'opacity-0 pointer-events-none hidden sm:flex' : ''}`}
          >
            Sau →
          </Button>
        </div>
      </div>
      {showGrid && (
        <QuestionGrid 
          questions={activeQuestions} 
          userAnswers={userAnswers} 
          currentIndex={currentIndex} 
          onJump={setCurrentIndex} 
          onClose={() => setShowGrid(false)} 
        />
      )}
    </div>
  );
};

export default App;