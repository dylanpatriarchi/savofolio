import { useEffect, useRef, useState } from 'react';
import type { GeneratedCode } from '../types';

interface PreviewIframeProps {
  generatedCode: GeneratedCode;
}

const PreviewIframe = ({ generatedCode }: PreviewIframeProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const updateIframeContent = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const { html, css, js } = generatedCode;
      
      // Combine HTML, CSS, and JS
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
          <style>${css}</style>
          <title>Portfolio Preview</title>
        </head>
        <body>
          ${html}
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
          <script>${js}</script>
        </body>
        </html>
      `;

      // Update iframe content
      const iframeDocument = iframe.contentDocument;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(content);
        iframeDocument.close();
      }
    };

    updateIframeContent();
  }, [generatedCode]);

  const getPreviewWidth = () => {
    switch(viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <div className="preview-container mb-4">
      <div className="preview-header mb-3 d-flex align-items-center">
        <div className="responsive-controls btn-group me-2">
          <button 
            type="button" 
            className={`btn btn-sm ${viewMode === 'desktop' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('desktop')}
            title="Desktop Preview"
          >
            <i className="bi bi-display"></i>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${viewMode === 'tablet' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('tablet')}
            title="Tablet Preview"
          >
            <i className="bi bi-tablet"></i>
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${viewMode === 'mobile' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('mobile')}
            title="Mobile Preview"
          >
            <i className="bi bi-phone"></i>
          </button>
        </div>
        
        <div className="preview-tag badge bg-secondary ms-auto">
          Live Preview
        </div>
      </div>
      
      <div className="iframe-wrapper-container d-flex justify-content-center bg-light rounded p-2">
        <div 
          className="iframe-wrapper shadow-sm" 
          style={{ 
            width: getPreviewWidth(),
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <iframe
            ref={iframeRef}
            title="Portfolio Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
            }}
          ></iframe>
        </div>
      </div>
      
      <div className="text-center text-muted small mt-2">
        <i className="bi bi-arrows-angle-expand me-1"></i>
        Preview updates in real-time as you edit the code
      </div>
    </div>
  );
};

export default PreviewIframe; 