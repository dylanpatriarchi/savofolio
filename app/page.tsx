'use client';

import { useState } from 'react';
import FileUploader from './components/FileUploader';
import UserForm from './components/UserForm';
import CodeEditor from './components/CodeEditor';

export default function Home() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{
    html: string;
    css: string;
    js: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileProcessed = (text: string) => {
    setCvText(text);
  };

  const handleUserFormSubmit = async (profession: string, projects: string) => {
    if (!cvText) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvText,
          profession,
          projects,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante la generazione del portfolio');
      }

      const data = await response.json();
      setGeneratedCode(data);
    } catch (error) {
      console.error('Errore:', error);
      alert(error instanceof Error ? error.message : 'Errore durante la generazione del portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="text-center mb-5">
        <h1 className="display-4 mb-2">Savofolio</h1>
        <p className="lead">Genera il tuo portfolio professionale a partire dal CV</p>
      </header>

      <div className="row">
        <div className="col-lg-6">
          <FileUploader 
            onFileProcessed={handleFileProcessed} 
            isLoading={isLoading}
          />
          
          <UserForm 
            cvText={cvText}
            onSubmit={handleUserFormSubmit}
            isLoading={isLoading}
          />
        </div>
        
        <div className="col-lg-6">
          {generatedCode ? (
            <CodeEditor 
              htmlCode={generatedCode.html} 
              cssCode={generatedCode.css} 
              jsCode={generatedCode.js} 
            />
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <h5 className="card-title mb-3">Anteprima Portfolio</h5>
                <p className="card-text text-muted">
                  {cvText 
                    ? 'Compila il form e genera il tuo portfolio'
                    : 'Carica il tuo CV per iniziare'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
