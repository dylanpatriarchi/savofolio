import { useState, useEffect } from 'react';
import type { UserData } from '../types';

interface PromptBuilderProps {
  userData: UserData;
  onGenerate: () => void;
  isGenerating: boolean;
}

const PromptBuilder = ({ userData, onGenerate, isGenerating }: PromptBuilderProps) => {
  const [promptTemplate, setPromptTemplate] = useState<string>('');

  useEffect(() => {
    // Generate the prompt based on the selected style
    let styleSpecificInstructions = '';
    
    switch(userData.style) {
      case 'minimal':
        styleSpecificInstructions = 'Clean, minimalist design with ample white space, subtle animations, and elegant typography. Focus on readability and content.';
        break;
      case 'modern':
        styleSpecificInstructions = 'Contemporary design with balanced layout, smooth transitions, and professional aesthetics.';
        break;
      case 'dark':
        styleSpecificInstructions = 'Dark theme with high contrast elements. Use dark backgrounds with vibrant accent colors.';
        break;
      case 'neon':
        styleSpecificInstructions = 'Vibrant glowing effects with bright colors against dark backgrounds. Include neon-like text effects and borders.';
        break;
      case 'retro':
        styleSpecificInstructions = 'Vintage aesthetics with retro typography, patterns, and color schemes. Consider pixel art elements or 80s/90s inspired design.';
        break;
      case 'neobrutalism':
        styleSpecificInstructions = 'Bold, raw design with strong colors, thick borders and shadows. Include slightly off-grid elements, chunky buttons, and high contrast.';
        break;
      case 'glassmorphism':
        styleSpecificInstructions = 'Frosted glass effect with transparency and subtle borders. Include blur effects, subtle gradients, and layered elements with transparency.';
        break;
      case 'cyberpunk':
        styleSpecificInstructions = 'Futuristic style with neon accents and digital elements. Include glitch effects, tech-inspired graphics, and bold typography.';
        break;
      case 'neumorphism':
        styleSpecificInstructions = 'Soft UI with subtle shadows creating a semi-3D effect. Use soft, extruded elements that appear to push out from the background.';
        break;
      case 'gradient':
        styleSpecificInstructions = 'Smooth color transitions creating depth and movement. Use gradient backgrounds, buttons, and cards that transition between the main colors.';
        break;
      default:
        styleSpecificInstructions = 'Clean, modern design with balanced layout and professional aesthetics.';
    }

    const newPrompt = `Create a professional portfolio website in English for ${userData.name || 'me'}.

STYLE: ${userData.style}
STYLE DETAILS: ${styleSpecificInstructions}

MAIN COLORS: ${userData.colors.join(', ')}
COLOR PALETTE: ${userData.colorPalette}

BIO:
${userData.bio || 'To be filled'}

PROJECTS:
${userData.projects.map(p => `- ${p.title}: ${p.description}`).join('\n') || 'No projects specified'}

EXPERIENCE:
${userData.pdfData?.experience.join('\n') || 'Not specified'}

EDUCATION:
${userData.pdfData?.education.join('\n') || 'Not specified'}

SKILLS:
${userData.pdfData?.skills.join(', ') || 'Not specified'}

IMPORTANT INSTRUCTIONS:
1. Create the portfolio entirely in ENGLISH
2. Use responsive, professional, and modern design with Bootstrap 5 (NO Tailwind)
3. Create a full-width layout using Bootstrap containers properly
4. Include a responsive navigation with appropriate sections
5. Use the "${userData.style}" style consistently throughout the design
6. Apply the specified color palette effectively
7. Make sure all content sections are properly displayed and formatted
8. Use semantic HTML5 elements and ensure the site is accessible
9. Include appropriate animations or transitions based on the style
10. Use Bootstrap 5 classes for responsive behavior across all device sizes

Special requirements for the ${userData.style} style:
- ${getStyleRequirements(userData.style)}

Additional details:
- Use proper semantic HTML5 elements
- Ensure layout uses full container width (no centering issues)
- Create responsive design that works on mobile, tablet and desktop
- Include smooth transitions and animations when appropriate
- Optimize for accessibility
`;

    setPromptTemplate(newPrompt);
  }, [userData]);

  // Helper function to get style-specific requirements
  const getStyleRequirements = (style: string): string => {
    switch(style) {
      case 'minimal':
        return 'Prioritize whitespace, use subtle animations, keep elements clean and simple';
      case 'modern':
        return 'Use modern layout techniques, subtle shadows, and appropriate spacing';
      case 'dark':
        return 'Use dark backgrounds with high contrast text, add subtle glow effects to important elements';
      case 'neon':
        return 'Implement neon-like glowing text effects, use bright colors against dark backgrounds';
      case 'retro':
        return 'Include retro typography, vintage color schemes, and possibly pixelated elements';
      case 'neobrutalism':
        return 'Use bold colors, thick borders, chunky elements, and strong shadows. Elements should have a raw, unrefined look';
      case 'glassmorphism':
        return 'Create translucent, frosted glass effects with blur and transparency. Layer elements for depth';
      case 'cyberpunk':
        return 'Add tech-inspired graphics, glitch effects, neon accents, and futuristic elements';
      case 'neumorphism':
        return 'Create soft UI elements with subtle shadows that give a 3D extruded effect. Use monochromatic color schemes';
      case 'gradient':
        return 'Incorporate smooth gradient transitions between main colors in backgrounds, buttons, and cards';
      default:
        return 'Focus on clean design, readability, and professional presentation';
    }
  };

  return (
    <div>
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <i className="bi bi-stars text-primary fs-4 me-2"></i>
          <h4 className="mb-0 fw-bold">AI Prompt</h4>
        </div>
        <p className="text-muted">
          This is the prompt that will be sent to Claude to generate your portfolio.
          You can edit it to further customize your request.
        </p>

        <div className="mb-3">
          <label htmlFor="promptTemplate" className="form-label">Prompt Template</label>
          <textarea
            className="form-control font-monospace"
            id="promptTemplate"
            rows={12}
            value={promptTemplate}
            onChange={(e) => setPromptTemplate(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="mb-4">
        <div className="card bg-light border-0">
          <div className="card-body">
            <h5 className="d-flex align-items-center">
              <i className="bi bi-lightbulb-fill text-warning me-2"></i>
              Prompt Tips
            </h5>
            <ul className="mb-0">
              <li>Be specific about the style you want</li>
              <li>Include any special sections you'd like to have</li>
              <li>Mention if you want any interactive elements</li>
              <li>Specify if you have any accessibility requirements</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="d-grid gap-2">
        <button
          type="button"
          className="btn btn-success btn-lg"
          onClick={onGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
              Generating Your Portfolio...
            </>
          ) : (
            <>
              <i className="bi bi-magic me-2"></i>
              Generate Portfolio
            </>
          )}
        </button>
        <p className="text-center text-muted small mt-2">
          Generation typically takes about 15-30 seconds
        </p>
      </div>
    </div>
  );
};

export default PromptBuilder; 