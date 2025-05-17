import { useState } from 'react';
import JSZip from 'jszip';
import type { GeneratedCode } from '../types';

interface DownloadZipProps {
  generatedCode: GeneratedCode;
  userName: string;
}

const DownloadZip = ({ generatedCode, userName }: DownloadZipProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateZip = async () => {
    try {
      setIsGenerating(true);
      const zip = new JSZip();
      
      // Aggiunge i file al pacchetto zip
      zip.file("index.html", createIndexHTML(generatedCode));
      zip.file("styles.css", generatedCode.css);
      
      if (generatedCode.js && generatedCode.js.trim() !== '') {
        zip.file("script.js", generatedCode.js);
      }
      
      // Aggiungi un file README.md
      zip.file("README.md", createReadme(userName));
      
      // Genera il file zip
      const content = await zip.generateAsync({ type: "blob" });
      
      // Crea un URL per il download
      const url = URL.createObjectURL(content);
      
      // Crea un link per il download e simula il click
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userName.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;
      document.body.appendChild(link);
      link.click();
      
      // Pulisci
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Errore durante la generazione dello ZIP:", error);
      alert("Si è verificato un errore durante la generazione del file ZIP.");
    } finally {
      setIsGenerating(false);
    }
  };

  const createIndexHTML = (code: GeneratedCode): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${userName} - Portfolio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${code.html}
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  ${code.js && code.js.trim() !== '' ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
  };

  const createReadme = (name: string): string => {
    return `# ${name}'s Portfolio

This portfolio was generated with SavoFolio.

## How to Use

1. Unzip the file
2. Open \`index.html\` in your browser
3. To publish online, upload all files to a hosting service

## Customization

- Edit \`index.html\` to update content
- Edit \`styles.css\` to customize styling
- Edit \`script.js\` to add JavaScript functionality

## Technologies

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (optional)

Generated with ❤️ by SavoFolio`;
  };

  return (
    <div className="download-section mt-4">
      <div className="card bg-light border-0">
        <div className="card-body">
          <h5 className="d-flex align-items-center mb-3">
            <i className="bi bi-cloud-download-fill text-primary me-2"></i>
            Download Your Portfolio
          </h5>
          
          <p className="text-muted mb-3">
            Your portfolio is ready! Download the ZIP file containing all necessary files to host your portfolio.
          </p>
          
          <div className="d-grid">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={generateZip}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Preparing Download...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download Portfolio
                </>
              )}
            </button>
          </div>
          
          <div className="mt-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-file-earmark-check text-success me-2"></i>
              <span>What's included in the download:</span>
            </div>
            <ul className="list-unstyled ps-4 mb-0 small">
              <li><i className="bi bi-file-earmark-code me-2"></i>index.html</li>
              <li><i className="bi bi-file-earmark-text me-2"></i>styles.css</li>
              {generatedCode.js && generatedCode.js.trim() !== '' && (
                <li><i className="bi bi-file-earmark-text me-2"></i>script.js</li>
              )}
              <li><i className="bi bi-file-earmark-text me-2"></i>README.md</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadZip; 