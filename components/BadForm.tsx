

import React, { useState } from 'react';
import { TaskType } from '../types';
import { Eye, AlertTriangle } from 'lucide-react';

interface Props {
  taskType: TaskType;
  onComplete: () => void;
  onMistake: () => void;
}

export const BadForm: React.FC<Props> = ({ taskType, onComplete, onMistake }) => {
  const [formData, setFormData] = useState({
    name: '',
    zip: '',
    addr: '',
    tel: '',
    email: '',
    emailConfirm: '',
    pass: '',
    passConfirm: ''
  });
  
  const [agreed, setAgreed] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- Logic for Email Task ---
  const handleEmailSubmit = () => {
    // Bad validation: No @ check in text type, annoying strict match
    if (!formData.email.includes('@')) {
        alert('System Error: Invalid format 0x0001');
        onMistake();
        return;
    }
    if (formData.email !== 'taro.yamada@example.com') {
        alert('Verification Failed: Input does not match expected record.');
        onMistake();
        return;
    }
    if (formData.email !== formData.emailConfirm) {
        alert('Error: Emails do not match.');
        onMistake();
        return;
    }
    onComplete();
  };

  // --- Logic for Password Task ---
  const handlePasswordSubmit = () => {
    // Trap: Must be exact strong password
    if (formData.pass !== 'M3@zP7$q') {
        // Clear password on error to annoy user
        setFormData(prev => ({ ...prev, pass: '', passConfirm: '' }));
        alert('PASSWORD REJECTED: Policy violation or incorrect string.');
        onMistake();
        return;
    }
    if (formData.pass !== formData.passConfirm) {
         alert('Confirmation Mismatch.');
         setFormData(prev => ({ ...prev, passConfirm: '' }));
         onMistake();
         return;
    }
    // Trap: Checkbox required (spam agreement)
    if (!agreed) {
        alert('Error: You must accept the mandatory terms.');
        onMistake();
        return;
    }
    onComplete();
  };

  // --- Logic for Profile Task ---
  const handleProfileSubmit = () => {
    if (!formData.name || !formData.addr || !formData.tel) {
        alert('NULL VALUE DETECTED.');
        onMistake();
        return;
    }
    // Phone trap: No hyphens allowed in Bad UI
    if (formData.tel.includes('-')) {
        alert('Format Error: Numbers only allowed in DB column.');
        onMistake();
        return;
    }
    // Zip trap
    if (!formData.zip) {
         alert('Zip Code Missing');
         onMistake();
         return;
    }
    onComplete();
  };

  const handleSubmit = () => {
    if (taskType === 'email') handleEmailSubmit();
    if (taskType === 'password') handlePasswordSubmit();
    if (taskType === 'profile') handleProfileSubmit();
  };

  const handleReset = () => {
    // Bad UI Feature: No confirmation dialog. One misclick clears everything.
    setFormData({ 
        name: '', zip: '', addr: '', tel: '', email: '', emailConfirm: '', pass: '', passConfirm: '' 
    });
    setAgreed(false);
    onMistake(); 
  };

  const fakeShowPassword = () => {
      alert("SECURITY ALERT: displaying passwords on screen is dangerous and prohibited by IT policy.");
      onMistake();
  };

  return (
    <div className="bad-ui-container p-6 bg-[#e0e0e0] text-[#333] h-full flex flex-col border-8 border-inset border-gray-400 overflow-y-auto font-serif">
      <div className="bg-blue-900 text-white p-2 mb-6 text-center">
         <h2 className="text-xl font-serif tracking-widest">ADMIN_CONSOLE_V1</h2>
      </div>
      
      <div className="flex flex-col gap-8 w-full max-w-lg mx-auto">
        
        {/* EMAIL TASK UI */}
        {taskType === 'email' && (
          <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm mb-2 font-bold uppercase decoration-double underline">Registration Wizard</p>
            <div className="flex flex-col gap-4">
               <div>
                    <label className="text-xs font-bold block mb-1">MAIL_ADDR_PRIMARY:</label>
                    {/* Trap: Low contrast placeholder, text type */}
                    <input 
                        type="text" 
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="border-2 border-blue-800 bg-blue-50 p-1 w-full text-sm"
                        placeholder="user(at)domain(dot)com"
                    />
               </div>
               <div>
                    <label className="text-xs font-bold block mb-1">CONFIRM_ADDR_PRIMARY:</label>
                    {/* Trap: Paste blocked */}
                    <input 
                        type="text" 
                        value={formData.emailConfirm}
                        onChange={(e) => handleChange('emailConfirm', e.target.value)}
                        onPaste={(e) => { e.preventDefault(); alert('Paste disabled for security.'); }}
                        className="border-2 border-red-800 bg-red-50 p-1 w-full text-sm"
                    />
                    <span className="text-[10px] text-red-600">* Do not copy-paste.</span>
               </div>
            </div>
          </div>
        )}

        {/* PASSWORD TASK UI - INTENTIONALLY TERRIBLE */}
        {taskType === 'password' && (
          <div className="border border-gray-400 p-6 bg-gray-200">
            <p className="text-xs mb-4 text-center font-mono text-red-600 blinking-text">!! SECURE AREA !!</p>
            <div className="flex flex-col gap-4">
               
               {/* Primary Password Field */}
               <div className="relative">
                   <label className="text-sm font-bold text-gray-500">SecretString:</label>
                   <div className="flex gap-1">
                        {/* Low contrast trap: Dark gray text on dark gray background */}
                        <input 
                            type="password"
                            value={formData.pass}
                            onChange={(e) => handleChange('pass', e.target.value)}
                            className="bg-gray-600 text-gray-800 font-mono p-1 w-full border border-gray-700"
                            autoComplete="new-password"
                        />
                        {/* Fake button */}
                        <button 
                            onClick={fakeShowPassword}
                            className="bg-gray-300 border border-gray-500 p-1"
                            title="Show Password"
                        >
                            <Eye size={16} className="text-gray-500" />
                        </button>
                   </div>
                   <p className="text-[9px] text-gray-400 mt-1">Case sensitive. Alphanumeric. Symbols required.</p>
               </div>

               {/* Confirm Password Field */}
               <div>
                   <label className="text-sm font-bold text-gray-500">VerifyString:</label>
                   <input 
                        type="password"
                        value={formData.passConfirm}
                        onChange={(e) => handleChange('passConfirm', e.target.value)}
                        className="bg-gray-600 text-gray-800 font-mono p-1 w-full border border-gray-700"
                   />
               </div>

               {/* Confusing Checkbox */}
               <div className="border border-dotted border-black p-2 bg-yellow-100">
                  <div className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        className="mt-1"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <span className="text-[10px] leading-tight font-bold">
                        REQUIRED: I agree to receive marketing emails, third-party offers, and daily newsletters. Unchecking this will cancel registration.
                      </span>
                  </div>
               </div>

            </div>
          </div>
        )}

        {/* PROFILE TASK UI */}
        {taskType === 'profile' && (
          <div className="space-y-6 font-mono text-sm">
             <div className="bg-white border border-black p-2">
                 {/* Name: Single field, confusing label */}
                 <div className="flex flex-col mb-4">
                    <label className="text-xs mb-1">CLIENT_ID_NAME (LAST FIRST):</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="border-b-2 border-black bg-gray-100 outline-none px-1"
                    />
                 </div>

                 {/* Address: Poorly grouped */}
                 <div className="flex flex-wrap gap-2 mb-4">
                    <div className="w-1/3">
                        <label className="text-[10px]">ZIP:</label>
                        <input 
                            type="text" 
                            value={formData.zip}
                            onChange={(e) => handleChange('zip', e.target.value)}
                            className="w-full border border-black"
                        />
                    </div>
                    <div className="w-full">
                        <label className="text-[10px]">MUNICIPALITY_STREET_APT:</label>
                        <input 
                            type="text" 
                            value={formData.addr}
                            onChange={(e) => handleChange('addr', e.target.value)}
                            className="w-full border border-black"
                        />
                    </div>
                 </div>

                 {/* Phone: Input restriction without warning */}
                 <div className="flex items-center gap-2 border-t border-black pt-2">
                    <label className="text-xs">CONTACT_DIGITS:</label>
                    <input 
                      type="text" 
                      value={formData.tel}
                      onChange={(e) => handleChange('tel', e.target.value)}
                      className="bg-yellow-50 border border-yellow-500 p-1 flex-grow"
                      placeholder="09012345678"
                    />
                 </div>
             </div>
          </div>
        )}

        {/* Buttons Area (Universal Bad UI Trap) */}
        <div className="flex justify-between items-center mt-8 bg-gray-300 p-4 rounded border-t-4 border-gray-500">
          
          {/* Trap: Submit is visually "Secondary" or "Disabled" looking */}
          <button 
            onClick={handleSubmit} 
            className="bg-gray-500 text-gray-200 px-4 py-1 text-xs hover:bg-gray-600 border border-gray-600 shadow-inner"
          >
            Execute Submit
          </button>

          {/* Trap: Clear is visually "Primary" (Blue/Big) */}
          <button 
            onClick={handleReset} 
            className="bg-blue-600 text-white px-8 py-3 text-lg font-bold hover:bg-blue-700 border-4 border-blue-800 shadow-lg rounded"
          >
            CLEAR FORM
          </button>
        </div>
        
        <div className="text-center text-[10px] text-red-600 font-bold animate-pulse">
           {taskType === 'password' ? 'CAPS LOCK IS OFF (MAYBE)' : 'SYSTEM READY'}
        </div>

      </div>
    </div>
  );
};