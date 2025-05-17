import { useState } from 'react';
import Editor from '@monaco-editor/react';
import type { GeneratedCode } from '../types';

interface CodeEditorProps {
  generatedCode: GeneratedCode;
  onCodeChange: (updatedCode: GeneratedCode) => void;
}

const CodeEditor = ({ generatedCode, onCodeChange }: CodeEditorProps) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  const handleHTMLChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange({ ...generatedCode, html: value });
    }
  };

  const handleCSSChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange({ ...generatedCode, css: value });
    }
  };

  const handleJSChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange({ ...generatedCode, js: value });
    }
  };

  return (
    <div className="code-editor-container">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'html' ? 'active' : ''}`}
            onClick={() => setActiveTab('html')}
          >
            <i className="bi bi-code-slash me-2"></i>
            HTML
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            <i className="bi bi-brush me-2"></i>
            CSS
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'js' ? 'active' : ''}`}
            onClick={() => setActiveTab('js')}
          >
            <i className="bi bi-filetype-js me-2"></i>
            JavaScript
          </button>
        </li>
      </ul>

      <div className="editor-wrapper">
        {activeTab === 'html' && (
          <Editor
            height="100%"
            defaultLanguage="html"
            value={generatedCode.html}
            onChange={handleHTMLChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              lineHeight: 1.5,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        )}

        {activeTab === 'css' && (
          <Editor
            height="100%"
            defaultLanguage="css"
            value={generatedCode.css}
            onChange={handleCSSChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              lineHeight: 1.5,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        )}

        {activeTab === 'js' && (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={generatedCode.js}
            onChange={handleJSChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontSize: 14,
              lineHeight: 1.5,
              tabSize: 2,
              wordWrap: 'on',
              formatOnPaste: true,
              formatOnType: true,
            }}
          />
        )}
      </div>
      
      <div className="d-flex justify-content-between mt-3 small text-muted">
        <div>
          <i className="bi bi-info-circle me-1"></i>
          Edit the code above to customize your portfolio
        </div>
        <div>
          <span className="badge bg-light text-dark">
            <i className="bi bi-keyboard me-1"></i>
            {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+S to save
          </span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 