import React, { useState } from 'react';
import Button from './Button';

interface StartScreenProps {
  onStart: (name: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">BỘ ĐỀ ÔN IOE K6 SỐ: 07</h1>
          <p className="text-slate-500">Luyện thi tiếng Anh IOE cùng AI Master</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-slate-700 mb-2">Tên của bạn</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nhập tên..." 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
              required 
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={!name.trim()}>Bắt đầu chơi</Button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;