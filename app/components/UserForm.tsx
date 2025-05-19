'use client';

import { useState } from 'react';

interface UserFormProps {
  cvText: string | null;
  onSubmit: (profession: string, projects: string) => void;
  isLoading: boolean;
}

export default function UserForm({ cvText, onSubmit, isLoading }: UserFormProps) {
  const [profession, setProfession] = useState('');
  const [projects, setProjects] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profession.trim()) {
      setError('Inserisci la tua professione');
      return;
    }
    
    if (!projects.trim()) {
      setError('Inserisci informazioni sui tuoi progetti');
      return;
    }
    
    setError(null);
    onSubmit(profession, projects);
  };

  if (!cvText) {
    return null;
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Informazioni aggiuntive</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="profession" className="form-label">Professione</label>
            <input
              type="text"
              className="form-control"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              disabled={isLoading}
              placeholder="Es. Sviluppatore Web, Designer UX/UI, Project Manager"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="projects" className="form-label">Progetti</label>
            <textarea
              className="form-control"
              id="projects"
              rows={4}
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              disabled={isLoading}
              placeholder="Descrivi i tuoi progetti principali, tecnologie utilizzate e risultati ottenuti"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generazione in corso...
              </>
            ) : (
              'Genera Portfolio'
            )}
          </button>
        </form>
      </div>
    </div>
  );
} 