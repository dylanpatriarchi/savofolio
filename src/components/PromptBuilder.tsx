import { useState, useEffect } from 'react';
import type { UserData } from '../types';

interface PromptBuilderProps {
  userData: UserData;
  onGenerate: () => void;
  onPromptGenerated: (prompt: string) => void;
  isGenerating: boolean;
}

const PromptBuilder = ({ userData, onGenerate, onPromptGenerated, isGenerating }: PromptBuilderProps) => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [promptTemplate, setPromptTemplate] = useState<string>('');

  useEffect(() => {
    // Format the projects for the prompt
    const projectsFormatted = userData.projects.map(p => 
      `- ${p.title}: ${p.description}`
    ).join('\n');

    // Format the skills 
    const skillsFormatted = userData.pdfData?.skills?.join(', ') || '';

    // Extract relevant data from PDF
    const educationFormatted = userData.pdfData?.education?.map(edu => 
      `- ${edu}`
    ).join('\n') || '';

    const experienceFormatted = userData.pdfData?.experience?.map(exp => 
      `- ${exp}`
    ).join('\n') || '';

    // SEMPLIFICAZIONE MASSIMA DEL PROMPT
    const fullPrompt = `PORTFOLIO WEBSITE GENERATION

IMPORTANT: Create a website that STRICTLY follows these style and color requirements:

STYLE: ${userData.style}
PRIMARY COLOR: ${userData.colors[0]}
SECONDARY COLOR: ${userData.colors[1]}
ACCENT COLOR: ${userData.colors[2]}

NAME: ${userData.name}
BIO: ${userData.bio}

${skillsFormatted ? `SKILLS: ${skillsFormatted}` : ''}

${projectsFormatted ? `PROJECTS:\n${projectsFormatted}` : ''}

${educationFormatted ? `EDUCATION:\n${educationFormatted}` : ''}

${experienceFormatted ? `EXPERIENCE:\n${experienceFormatted}` : ''}

REQUIREMENTS:
1. USE FULL WIDTH LAYOUT (container-fluid, not container)
2. USE ALL THREE COLORS EXACTLY AS SPECIFIED 
3. IMPLEMENT THE ${userData.style.toUpperCase()} STYLE FAITHFULLY
4. MAKE IT RESPONSIVE
5. RETURN COMPLETE HTML, CSS, AND JS

Format your response with these code blocks:
\`\`\`html
(your HTML code)
\`\`\`

\`\`\`css
(your CSS code)
\`\`\`

\`\`\`js
(your JavaScript code)
\`\`\`
`;

    setPromptTemplate(fullPrompt);
    onPromptGenerated(fullPrompt);
  }, [userData, onPromptGenerated]);

  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">AI Portfolio Generator</h5>
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="showPrompt"
            checked={showPrompt}
            onChange={() => setShowPrompt(!showPrompt)}
          />
          <label className="form-check-label" htmlFor="showPrompt">
            Show Prompt
          </label>
        </div>
      </div>
      <div className="card-body">
        {showPrompt ? (
          <div className="mb-3">
            <label className="form-label">Prompt:</label>
            <textarea
              className="form-control font-monospace"
              style={{ height: '300px' }}
              value={promptTemplate}
              onChange={(e) => {
                setPromptTemplate(e.target.value);
                onPromptGenerated(e.target.value);
              }}
            />
          </div>
        ) : (
          <p className="card-text">
            Il sito verrà generato secondo le tue specifiche. Ecco il riepilogo:
          </p>
        )}
        
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2 mb-2">
            <strong>Stile:</strong>
            <span className="badge bg-primary">{userData.style}</span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <strong>Colori:</strong>
            {userData.colors.map((color, index) => (
              <div 
                key={index}
                className="color-preview d-flex align-items-center"
              >
                <div
                  style={{
                    backgroundColor: color,
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: '1px solid #dee2e6'
                  }}
                  title={color}
                />
                <small className="ms-1">{color}</small>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className="btn btn-primary w-100"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Generazione in corso...
            </>
          ) : (
            'Genera Portfolio'
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptBuilder; 