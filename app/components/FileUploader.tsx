'use client';

import { useState } from 'react';

interface FileUploaderProps {
  onFileProcessed: (text: string) => void;
  isLoading: boolean;
}

export default function FileUploader({ onFileProcessed, isLoading }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (!selectedFile) {
      setFile(null);
      setError(null);
      return;
    }
    
    // Verifica che sia un PDF
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Per favore carica un file PDF');
      setFile(null);
      return;
    }
    
    // Verifica la dimensione (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > MAX_SIZE) {
      setError('Il file è troppo grande. La dimensione massima è 10MB');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setProgress(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Seleziona un file PDF');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(10); // Inizia con 10%
      
      const formData = new FormData();
      formData.append('file', file);

      setProgress(30); // Avvia la richiesta
      
      const response = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      setProgress(70); // Risposta ricevuta
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante l\'upload del file');
      }

      setProgress(90); // Elaborazione dati

      const data = await response.json();
      
      // Verifica che ci sia del testo
      if (!data.text || data.text.trim() === '') {
        throw new Error('Non è stato possibile estrarre testo dal PDF. Potrebbe essere protetto o contenere solo immagini.');
      }
      
      setProgress(100); // Completato
      
      // Breve pausa prima di chiamare il callback per mostrare il completamento
      setTimeout(() => {
        onFileProcessed(data.text);
        setUploading(false);
        setProgress(null);
      }, 500);
      
    } catch (err) {
      console.error('Errore:', err);
      setError(err instanceof Error ? err.message : 'Errore durante l\'upload');
      setUploading(false);
      setProgress(null);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Carica il tuo CV (PDF)</h5>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading || uploading}
          />
          <small className="form-text text-muted">
            Dimensione massima: 10MB. Assicurati che il PDF non sia protetto da password.
          </small>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}
        
        {file && <p className="mb-2">File selezionato: {file.name}</p>}
        
        {progress !== null && (
          <div className="progress mb-3">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${progress}%` }} 
              aria-valuenow={progress} 
              aria-valuemin={0} 
              aria-valuemax={100}
            >
              {progress}%
            </div>
          </div>
        )}
        
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || isLoading || uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Elaborazione in corso...
            </>
          ) : isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Attendi...
            </>
          ) : (
            'Carica CV'
          )}
        </button>
      </div>
    </div>
  );
} 