'use client';

import { useEffect, useState, useRef } from 'react';
import { editor } from 'monaco-editor';
import JSZip from 'jszip';

interface CodeEditorProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
}

export default function CodeEditor({ htmlCode, cssCode, jsCode }: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState('html');
  const htmlEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const cssEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const jsEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);
  const jsContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Importa dinamicamente Monaco Editor solo lato client
    const loadMonaco = async () => {
      try {
        // Importa Monaco Editor
        const monaco = await import('monaco-editor');
        
        // Inizializza gli editor
        if (htmlContainerRef.current && !htmlEditorRef.current) {
          htmlEditorRef.current = monaco.editor.create(htmlContainerRef.current, {
            value: htmlCode,
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
          });
        }
        
        if (cssContainerRef.current && !cssEditorRef.current) {
          cssEditorRef.current = monaco.editor.create(cssContainerRef.current, {
            value: cssCode,
            language: 'css',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
          });
        }
        
        if (jsContainerRef.current && !jsEditorRef.current) {
          jsEditorRef.current = monaco.editor.create(jsContainerRef.current, {
            value: jsCode,
            language: 'javascript',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
          });
        }

        // Aggiorna anteprima
        updatePreview();
        
        // Aggiungi event listeners per aggiornare l'anteprima
        htmlEditorRef.current?.onDidChangeModelContent(() => updatePreview());
        cssEditorRef.current?.onDidChangeModelContent(() => updatePreview());
        jsEditorRef.current?.onDidChangeModelContent(() => updatePreview());
      } catch (error) {
        console.error('Errore durante il caricamento di Monaco Editor:', error);
      }
    };

    loadMonaco();

    // Cleanup
    return () => {
      htmlEditorRef.current?.dispose();
      cssEditorRef.current?.dispose();
      jsEditorRef.current?.dispose();
    };
  }, [htmlCode, cssCode, jsCode]);

  const updatePreview = () => {
    if (!previewRef.current || !htmlEditorRef.current || !cssEditorRef.current || !jsEditorRef.current) return;
    
    const html = htmlEditorRef.current.getValue();
    const css = cssEditorRef.current.getValue();
    const js = jsEditorRef.current.getValue();
    
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
        </body>
      </html>
    `;
    
    const iframe = previewRef.current;
    const iframeDoc = iframe.contentWindow?.document;
    
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(previewContent);
      iframeDoc.close();
    }
  };

  const downloadZip = async () => {
    try {
      if (!htmlEditorRef.current || !cssEditorRef.current || !jsEditorRef.current) return;
      
      const zip = new JSZip();
      
      // Aggiungi i file al pacchetto ZIP
      zip.file("index.html", htmlEditorRef.current.getValue());
      zip.file("style.css", cssEditorRef.current.getValue());
      zip.file("script.js", jsEditorRef.current.getValue());
      
      // Genera il blob ZIP
      const content = await zip.generateAsync({ type: "blob" });
      
      // Crea un URL temporaneo per il download
      const url = URL.createObjectURL(content);
      
      // Crea un link per il download e fai clic su di esso
      const link = document.createElement("a");
      link.href = url;
      link.download = "portfolio.zip";
      document.body.appendChild(link);
      link.click();
      
      // Pulisci dopo il download
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Errore durante la creazione del file ZIP:', error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Editor e Anteprima</h5>
        
        <div className="d-flex justify-content-between mb-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'html' ? 'active' : ''}`}
                onClick={() => setActiveTab('html')}
              >
                HTML
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'css' ? 'active' : ''}`}
                onClick={() => setActiveTab('css')}
              >
                CSS
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'js' ? 'active' : ''}`}
                onClick={() => setActiveTab('js')}
              >
                JavaScript
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Anteprima
              </button>
            </li>
          </ul>
          
          <button
            className="btn btn-success"
            onClick={downloadZip}
          >
            Scarica ZIP
          </button>
        </div>
        
        {/* Editor di codice per HTML */}
        <div
          ref={htmlContainerRef}
          style={{
            height: '400px',
            width: '100%',
            display: activeTab === 'html' ? 'block' : 'none',
            border: '1px solid #ddd'
          }}
        />
        
        {/* Editor di codice per CSS */}
        <div
          ref={cssContainerRef}
          style={{
            height: '400px',
            width: '100%',
            display: activeTab === 'css' ? 'block' : 'none',
            border: '1px solid #ddd'
          }}
        />
        
        {/* Editor di codice per JavaScript */}
        <div
          ref={jsContainerRef}
          style={{
            height: '400px',
            width: '100%',
            display: activeTab === 'js' ? 'block' : 'none',
            border: '1px solid #ddd'
          }}
        />
        
        {/* Anteprima */}
        <iframe
          ref={previewRef}
          style={{
            height: '400px',
            width: '100%',
            display: activeTab === 'preview' ? 'block' : 'none',
            border: '1px solid #ddd'
          }}
          title="Anteprima"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </div>
  );
} 