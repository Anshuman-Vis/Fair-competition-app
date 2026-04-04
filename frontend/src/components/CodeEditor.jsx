import React, { useState } from 'react';

const CodeEditor = ({ code, onChange, language = 'python' }) => {
  const [theme, setTheme] = useState('dark');

  const handleCodeChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <select
            value={language}
            disabled
            className="bg-slate-700 text-slate-300 text-sm rounded px-2 py-1 outline-none border border-slate-600"
          >
            <option value="python">Python 3.9</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <span className="text-slate-400 text-xs font-mono">Auto-save: Enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>\n          <span className="text-slate-400 text-xs uppercase tracking-wider">Secure</span>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="flex flex-1 overflow-hidden bg-slate-900">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="flex-1 p-4 bg-slate-900 text-slate-200 font-mono text-sm outline-none resize-none border-none"
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            fontFamily: '\"Courier New\", monospace',
          }}
          spellCheck="false"
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-right">
        <span className="text-slate-400 text-xs">Lines: {code.split('\n').length}</span>
      </div>
    </div>
  );
};

export default CodeEditor;