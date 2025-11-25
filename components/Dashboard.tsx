import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateFeedback } from '../services/geminiService';
import { TaskResult, TaskType, TASKS } from '../types';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  results: TaskResult;
  taskType: TaskType;
  onRestart: () => void;
}

export const Dashboard: React.FC<Props> = ({ results, taskType, onRestart }) => {
  // Feedback is now synchronous and instant
  const feedback = generateFeedback(taskType, results);

  const timeData = [
    { name: '悪いUI', time: parseFloat((results.bad.timeTaken / 1000).toFixed(2)) },
    { name: '良いUI', time: parseFloat((results.good.timeTaken / 1000).toFixed(2)) },
  ];

  const clickData = [
    { name: '悪いUI', clicks: results.bad.clickCount },
    { name: '良いUI', clicks: results.good.clickCount },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
        体験終了！ 結果発表
      </h1>
      <p className="text-center text-slate-600 mb-8">
        {TASKS[taskType].title} におけるあなたの操作データを分析しました。
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Time Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">完了までの時間 (秒)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" name="時間(秒)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Click Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-center">クリック数・操作数 (回)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clickData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8b5cf6" name="クリック数" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CheckCircle2 size={100} className="text-indigo-600" />
        </div>
        
        <h3 className="text-xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
          分析レポート
        </h3>
        
        <div className="prose prose-indigo max-w-none">
          <div className="whitespace-pre-line text-indigo-800 leading-relaxed font-medium">
            {feedback}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
        >
          <RefreshCw size={20} />
          トップに戻る
        </button>
      </div>
    </div>
  );
};