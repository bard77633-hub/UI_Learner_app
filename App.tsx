
import React, { useState, useEffect, useRef } from 'react';
import { AppStage, TaskResult, TaskType, TASKS, UIStyle } from './types';
import { BadForm } from './components/BadForm';
import { GoodForm } from './components/GoodForm';
import { Dashboard } from './components/Dashboard';
import { AlertTriangle, CheckCircle, ArrowRight, MousePointer2, ThumbsDown, ThumbsUp, Mail, Lock, User, ClipboardList, ChevronDown, ChevronUp } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro');
  const [taskType, setTaskType] = useState<TaskType>('email');
  // Track the order of tasks (e.g., ['bad', 'good'] or ['good', 'bad'])
  const [taskOrder, setTaskOrder] = useState<UIStyle[]>([]);
  const [completedTasks, setCompletedTasks] = useState<UIStyle[]>([]);
  const [isInstructionMinimized, setIsInstructionMinimized] = useState(false);
  
  const [results, setResults] = useState<TaskResult>({
    bad: { clickCount: 0, timeTaken: 0, mistakes: 0 },
    good: { clickCount: 0, timeTaken: 0, mistakes: 0 }
  });

  const startTimeRef = useRef<number>(0);
  const clickCountRef = useRef<number>(0);

  // Global click tracker for active simulation stages
  useEffect(() => {
    const handleGlobalClick = () => {
      if (stage === 'task-bad' || stage === 'task-good') {
        clickCountRef.current += 1;
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [stage]);

  const handleTaskSelection = (type: TaskType) => {
      setTaskType(type);
      setStage('order-selection');
  };

  const handleOrderSelection = (firstStyle: UIStyle) => {
    const order: UIStyle[] = firstStyle === 'bad' ? ['bad', 'good'] : ['good', 'bad'];
    setTaskOrder(order);
    
    // Start the first task briefing
    const firstStage = order[0] === 'bad' ? 'briefing-bad' : 'briefing-good';
    setStage(firstStage);
  };

  const startTask = (nextStage: 'task-bad' | 'task-good') => {
    startTimeRef.current = Date.now();
    clickCountRef.current = 0;
    setIsInstructionMinimized(false); // Always open instruction at start
    setStage(nextStage);
  };

  const completeTask = (currentStyle: UIStyle) => {
    const endTime = Date.now();
    const timeTaken = endTime - startTimeRef.current;
    
    setResults(prev => ({
      ...prev,
      [currentStyle]: {
        ...prev[currentStyle],
        clickCount: clickCountRef.current,
        timeTaken,
      }
    }));

    const newCompleted = [...completedTasks, currentStyle];
    setCompletedTasks(newCompleted);

    // Check if there is a second task remaining
    const remainingTask = taskOrder.find(t => !newCompleted.includes(t));

    if (remainingTask) {
      // Move to the next briefing
      setStage(remainingTask === 'bad' ? 'briefing-bad' : 'briefing-good');
    } else {
      // All done
      setStage('results');
    }
  };

  const handleMistake = (currentStyle: UIStyle) => {
    setResults(prev => ({
      ...prev,
      [currentStyle]: {
        ...prev[currentStyle],
        mistakes: prev[currentStyle].mistakes + 1
      }
    }));
  };

  const resetApp = () => {
    setResults({
      bad: { clickCount: 0, timeTaken: 0, mistakes: 0 },
      good: { clickCount: 0, timeTaken: 0, mistakes: 0 }
    });
    setCompletedTasks([]);
    setTaskOrder([]);
    setStage('intro');
  };

  // Render Helpers
  const renderBriefing = (type: UIStyle) => {
    const isFirst = completedTasks.length === 0;
    
    return (
      <div className="max-w-2xl mx-auto text-center mt-20 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 animate-fade-in">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${type === 'bad' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {type === 'bad' ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {type === 'bad' ? '悪いUI (Bad UI)' : '良いUI (Good UI)'}
          <span className="text-lg font-normal text-slate-500 ml-2">
             - {isFirst ? '前半戦' : '後半戦'}
          </span>
        </h2>
        
        {!isFirst && (
           <p className="mb-6 text-slate-500 bg-slate-100 py-2 px-4 rounded-lg inline-block">
             お疲れ様でした！次は比較のために<strong>{type === 'bad' ? '使いにくいデザイン' : '理想的なデザイン'}</strong>を体験します。
           </p>
        )}

        <div className="text-lg text-slate-600 mb-8 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-left">
          <p className="font-bold text-slate-800 mb-2 border-b border-slate-200 pb-2">📝 ミッション指示書</p>
          <p className="whitespace-pre-line font-medium">{TASKS[taskType].instruction}</p>
        </div>
        
        <button
          onClick={() => startTask(type === 'bad' ? 'task-bad' : 'task-good')}
          className={`px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105 shadow-lg ${type === 'bad' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {type === 'bad' ? '悪いUIを体験する' : '良いUIを体験する'}
        </button>
      </div>
    );
  };

  const renderInstructionOverlay = () => {
    if (stage !== 'task-bad' && stage !== 'task-good') return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <div 
          className={`
            bg-white rounded-lg shadow-2xl border-2 border-slate-800 overflow-hidden transition-all duration-300
            ${isInstructionMinimized ? 'w-48' : 'w-80'}
          `}
        >
          <div 
            className="bg-slate-800 text-white p-3 flex justify-between items-center cursor-pointer hover:bg-slate-700 transition-colors"
            onClick={() => setIsInstructionMinimized(!isInstructionMinimized)}
          >
            <span className="font-bold text-sm flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-300"/> 
              ミッション指示書
            </span>
            {isInstructionMinimized ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          
          {!isInstructionMinimized && (
            <div className="p-5 bg-yellow-50 text-slate-800 max-h-64 overflow-y-auto">
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider border-b border-yellow-200 pb-1">
                 Target Data
              </div>
              <p className="whitespace-pre-line text-sm font-medium leading-relaxed font-mono">
                {TASKS[taskType].instruction}
              </p>
              <p className="text-[10px] text-slate-400 mt-3 text-right">
                この通りに入力してください
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Header (except for task views to focus attention) */}
      {!stage.startsWith('task-') && (
        <header className="bg-white border-b border-slate-200 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <MousePointer2 className="text-blue-600" />
            <h1 className="font-bold text-xl tracking-tight">UI/UX Lab. <span className="text-slate-400 font-normal ml-2">情報Ⅰ 教材アプリ</span></h1>
          </div>
        </header>
      )}

      {/* Task Header Overlay */}
      {stage.startsWith('task-') && (
        <div className="bg-slate-900 text-white py-2 px-4 text-center sticky top-0 z-50 shadow-md flex justify-between items-center">
          <div className="w-1/3 text-left pl-4 text-gray-400 text-xs">
             Mode: {stage === 'task-bad' ? 'Bad UI' : 'Good UI'} | Genre: {TASKS[taskType].title}
          </div>
          <div className="w-1/3 text-center">
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">ミッション中</span>
          </div>
          <div className="w-1/3 text-right pr-4">
              <button onClick={resetApp} className="text-xs text-slate-400 hover:text-white underline">中断する</button>
          </div>
        </div>
      )}

      <main className="flex-grow relative overflow-auto">
        
        {stage === 'intro' && (
          <div className="h-full flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-3xl">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-4">
                高校 情報Ⅰ 実習
              </span>
              <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-slate-900">
                悪いUI vs 良いUI <br/>
                <span className="text-blue-600">体験型比較シミュレーター</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                「使いにくい」と「使いやすい」を実際に操作して比較します。<br/>
                デザインがユーザー行動に与える影響をデータで確認しましょう。
              </p>
              
              <div className="flex justify-center">
                 <button
                  onClick={() => setStage('task-selection')}
                  className="group relative flex items-center gap-4 p-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-xl transition-all pr-10 pl-10 shadow-lg"
                >
                  <span className="text-lg font-bold">実習をはじめる</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'task-selection' && (
           <div className="h-full flex flex-col items-center py-12 px-6 bg-slate-50">
              <h2 className="text-3xl font-bold mb-2 text-slate-800">実習テーマを選んでください</h2>
              <p className="text-slate-600 mb-10">興味のあるジャンルを選択して比較を開始します。</p>
              
              <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
                 {/* Option 1: Email */}
                 <button 
                   onClick={() => handleTaskSelection('email')}
                   className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all text-left flex flex-col h-full"
                 >
                    <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                        <Mail size={28}/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{TASKS.email.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                       {TASKS.email.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-blue-600 font-semibold text-sm flex items-center gap-1">
                       選択する <ArrowRight size={16}/>
                    </div>
                 </button>

                 {/* Option 2: Password */}
                 <button 
                   onClick={() => handleTaskSelection('password')}
                   className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-xl transition-all text-left flex flex-col h-full"
                 >
                    <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                        <Lock size={28}/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{TASKS.password.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                       {TASKS.password.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-indigo-600 font-semibold text-sm flex items-center gap-1">
                       選択する <ArrowRight size={16}/>
                    </div>
                 </button>

                 {/* Option 3: Profile */}
                 <button 
                   onClick={() => handleTaskSelection('profile')}
                   className="bg-white p-8 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all text-left flex flex-col h-full"
                 >
                    <div className="bg-emerald-50 w-14 h-14 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                        <User size={28}/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{TASKS.profile.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                       {TASKS.profile.description}
                    </p>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-emerald-600 font-semibold text-sm flex items-center gap-1">
                       選択する <ArrowRight size={16}/>
                    </div>
                 </button>
              </div>
           </div>
        )}

        {stage === 'order-selection' && (
          <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50">
             <h2 className="text-3xl font-bold mb-8 text-slate-800">どちらから体験しますか？</h2>
             <p className="text-slate-600 mb-12 max-w-lg text-center">
               体験の順番を選択してください。
             </p>
             
             <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
                {/* Bad First Option */}
                <button 
                  onClick={() => handleOrderSelection('bad')}
                  className="group flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-red-400 hover:shadow-xl transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                    <ThumbsDown size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800">悪いUI から始める</h3>
                  <p className="text-center text-slate-500 text-sm leading-relaxed">
                    「使いにくさ」を先に体験し、<br/>改善されたUIの快適さを実感するコース。
                  </p>
                  <span className="mt-6 text-red-600 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    こちらを選択 <ArrowRight size={16} />
                  </span>
                </button>

                {/* Good First Option */}
                <button 
                  onClick={() => handleOrderSelection('good')}
                  className="group flex flex-col items-center p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <ThumbsUp size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800">良いUI から始める</h3>
                  <p className="text-center text-slate-500 text-sm leading-relaxed">
                    「理想形」を先に体験し、<br/>悪いUIのストレスを痛感するコース。
                  </p>
                  <span className="mt-6 text-blue-600 font-semibold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    こちらを選択 <ArrowRight size={16} />
                  </span>
                </button>
             </div>
          </div>
        )}

        {stage === 'briefing-bad' && renderBriefing('bad')}
        
        {stage === 'task-bad' && (
          <div className="h-full bg-gray-200 p-4 md:p-8 flex justify-center items-center">
             <div className="w-full max-w-[800px] h-[600px] bg-white shadow-2xl overflow-hidden border border-gray-400 relative flex flex-col">
                <div className="bg-gray-300 border-b border-gray-400 p-1 flex items-center gap-1 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500"></div>
                  <span className="ml-2 text-xs text-gray-600">Legacy System v1.0</span>
                </div>
                <div className="flex-grow overflow-auto relative">
                  <BadForm 
                    taskType={taskType}
                    onComplete={() => completeTask('bad')} 
                    onMistake={() => handleMistake('bad')} 
                  />
                </div>
             </div>
          </div>
        )}

        {stage === 'briefing-good' && renderBriefing('good')}

        {stage === 'task-good' && (
          <div className="h-full bg-slate-100 p-4 md:p-8 flex justify-center items-center">
             <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl overflow-hidden min-h-[400px] max-h-full overflow-auto">
                <GoodForm 
                  taskType={taskType}
                  onComplete={() => completeTask('good')} 
                  onMistake={() => handleMistake('good')} 
                />
             </div>
          </div>
        )}

        {stage === 'results' && (
          <Dashboard 
            results={results} 
            taskType={taskType} 
            onRestart={resetApp} 
          />
        )}

        {renderInstructionOverlay()}

      </main>
    </div>
  );
};

export default App;
