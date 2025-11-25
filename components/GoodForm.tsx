

import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle, Mail, User, MapPin, Phone, Lock } from 'lucide-react';
import { TaskType } from '../types';

interface Props {
  taskType: TaskType;
  onComplete: () => void;
  onMistake: () => void;
}

export const GoodForm: React.FC<Props> = ({ taskType, onComplete, onMistake }) => {
  // --- State Management ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [zip, setZip] = useState('');
  const [pref, setPref] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [tel, setTel] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Validation Logic ---
  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (taskType === 'email') {
        if (!email.includes('@')) {
            newErrors.email = '有効なメールアドレスを入力してください (@が含まれていません)';
            isValid = false;
        } else if (email !== 'taro.yamada@example.com') {
            newErrors.email = '指示されたメールアドレスと一致しません。';
            isValid = false;
        }
    }

    if (taskType === 'password') {
        if (password.length < 8) {
            newErrors.password = 'パスワードは8文字以上である必要があります。';
            isValid = false;
        }
        // Good UI still requires the specific string for fair comparison in timing/accuracy
        if (password !== 'M3@zP7$q') {
             newErrors.password = '指示されたパスワードと一致しません。';
             isValid = false;
        }
    }

    if (taskType === 'profile') {
        if (!lastName || !firstName) { newErrors.name = '氏名を入力してください'; isValid = false; }
        if (!zip.match(/^\d{3}-?\d{4}$/)) { newErrors.zip = '郵便番号を確認してください'; isValid = false; }
        if (!tel.match(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/)) { newErrors.tel = '電話番号を確認してください'; isValid = false; }
        if (!pref || !city || !street) { newErrors.addr = '住所を完了してください'; isValid = false; }
    }

    setErrors(newErrors);
    if (!isValid) onMistake();
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete();
    }
  };

  // --- Render Helpers ---
  const renderEmailTask = () => (
    <div className="space-y-6">
       <div>
          <label className="block font-bold text-slate-700 mb-2">メールアドレス</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="taro.yamada@example.com"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
            />
          </div>
          {errors.email && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.email}</p>}
          <p className="text-slate-500 text-sm mt-2">※受信可能なメールアドレスを入力してください。</p>
       </div>
    </div>
  );

  const renderPasswordTask = () => (
    <div className="space-y-6">
        <div>
            <label className="block font-bold text-slate-700 mb-2">パスワード設定</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="M3@zP7$q"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-500'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
            </div>
            
            {/* Helper UI for Password Strength */}
            <div className="mt-2 flex gap-1 h-1">
                <div className={`flex-1 rounded-full ${password.length > 0 ? 'bg-red-400' : 'bg-slate-200'}`}></div>
                <div className={`flex-1 rounded-full ${password.length > 4 ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
                <div className={`flex-1 rounded-full ${password.length >= 8 ? 'bg-green-400' : 'bg-slate-200'}`}></div>
            </div>

            {errors.password && <p className="text-red-600 text-sm mt-1 flex items-center gap-1"><AlertCircle size={14}/> {errors.password}</p>}
            <p className="text-slate-500 text-sm mt-2">※半角英数字8文字以上で入力してください。</p>
        </div>
    </div>
  );

  const renderProfileTask = () => (
    <div className="space-y-8">
        {/* Name */}
        <div className="grid md:grid-cols-3 gap-4 items-center">
             <label className="font-medium text-slate-700">お名前 <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">必須</span></label>
             <div className="md:col-span-2 flex gap-4">
                <input 
                   type="text" placeholder="姓" value={lastName} onChange={e => setLastName(e.target.value)}
                   className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                />
                <input 
                   type="text" placeholder="名" value={firstName} onChange={e => setFirstName(e.target.value)}
                   className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                />
             </div>
             {errors.name && <p className="md:col-start-2 md:col-span-2 text-red-600 text-sm">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="grid md:grid-cols-3 gap-4 items-center">
            <label className="font-medium text-slate-700">電話番号</label>
            <div className="md:col-span-2 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                   type="tel" placeholder="090-1234-5678" value={tel} onChange={e => setTel(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 outline-none"
                />
            </div>
            {errors.tel && <p className="md:col-start-2 md:col-span-2 text-red-600 text-sm">{errors.tel}</p>}
        </div>

        {/* Address */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
            <label className="font-medium text-slate-700 pt-2">ご住所</label>
            <div className="md:col-span-2 space-y-3">
                <div className="flex gap-2 items-center">
                    <MapPin size={18} className="text-slate-400"/>
                    <input 
                       type="text" placeholder="123-4567" value={zip} onChange={e => setZip(e.target.value)}
                       className="w-32 border border-slate-300 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                    />
                    <button type="button" className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">住所検索</button>
                </div>
                {errors.zip && <p className="text-red-600 text-sm">{errors.zip}</p>}
                
                <div className="flex gap-2">
                    <select value={pref} onChange={e => setPref(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 bg-white">
                        <option value="">都道府県</option>
                        <option value="Tokyo">東京都</option>
                        <option value="Osaka">大阪府</option>
                    </select>
                    <input 
                       type="text" placeholder="市区町村" value={city} onChange={e => setCity(e.target.value)}
                       className="flex-1 border border-slate-300 rounded-lg px-3 py-2"
                    />
                </div>
                <input 
                   type="text" placeholder="番地" value={street} onChange={e => setStreet(e.target.value)}
                   className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
                {errors.addr && <p className="text-red-600 text-sm">{errors.addr}</p>}
            </div>
        </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-sm border border-slate-200 my-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
         {taskType === 'email' && <Mail className="text-blue-500"/>}
         {taskType === 'password' && <Lock className="text-blue-500"/>}
         {taskType === 'profile' && <User className="text-blue-500"/>}
         
         {taskType === 'email' && 'メールマガジン登録'}
         {taskType === 'password' && 'パスワード設定'}
         {taskType === 'profile' && '基本情報登録'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        
        {taskType === 'email' && renderEmailTask()}
        {taskType === 'password' && renderPasswordTask()}
        {taskType === 'profile' && renderProfileTask()}

        <div className="flex justify-center mt-10">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-lg shadow-md transform transition hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Check size={20} />
            {taskType === 'password' ? '設定する' : '登録する'}
          </button>
        </div>

      </form>
    </div>
  );
};