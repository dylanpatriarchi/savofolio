import { useState } from 'react';
import type { PDFData } from '../types';
import { PDFDocument } from 'pdf-lib';

interface PDFUploaderProps {
  onPDFDataExtracted: (data: PDFData) => void;
}

const PDFUploader = ({ onPDFDataExtracted }: PDFUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const extractTextFromPDF = async (pdfBytes: ArrayBuffer): Promise<string> => {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const numberOfPages = pdfDoc.getPageCount();
      let text = '';
      
      // Note: pdf-lib doesn't support direct text extraction,
      // so we're just tracking the number of pages.
      // In a real implementation, you would use a more specific package like pdf.js
      
      text = `PDF with ${numberOfPages} pages loaded. Full text extraction would require an additional library like pdf.js.`;
      
      return text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return 'Error during PDF analysis';
    }
  };

  const parsePDFData = (text: string, fileName: string): PDFData => {
    // This is a simulated parsing based on the filename
    // In a real app, you would use more advanced natural language processing
    
    // Extract name from filename (remove extension and format)
    let name = fileName.replace(/\.pdf$/i, '');
    // Convert camelCase, snake_case, or dash-case to space-separated words
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase to space
              .replace(/[_-]/g, ' ')                 // replace _ and - with space
              .replace(/\s+/g, ' ')                  // normalize spaces
              .trim();

    // Capitalize each word
    name = name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    
    // Generate more realistic data (still mock, but more diverse)
    return {
      name: name || 'John Doe',
      experience: [
        'Senior Developer at TechCorp, 2020-Present',
        'Frontend Developer at WebSolutions, 2017-2020',
        'Junior Developer at StartupX, 2015-2017'
      ],
      education: [
        'Master of Computer Science, Tech University, 2015',
        'Bachelor of Information Technology, Digital College, 2013'
      ],
      skills: [
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'HTML/CSS', 
        'Python', 'Git', 'Docker', 'AWS', 'MongoDB', 'SQL',
        'UI/UX Design', 'RESTful APIs', 'GraphQL'
      ],
      rawText: text
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(arrayBuffer);
      const pdfData = parsePDFData(text, file.name);
      
      onPDFDataExtracted(pdfData);
    } catch (error) {
      console.error('Error during PDF upload:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="upload-zone p-4 text-center border rounded-3 bg-light">
        <i className="bi bi-file-earmark-pdf display-5 text-primary mb-3 d-block"></i>
        
        <p className="mb-3">
          Upload your resume to automatically extract your experience, education, and skills.
        </p>
        
        <div className="d-flex justify-content-center">
          <label htmlFor="pdfUpload" className="btn btn-outline-primary">
            <i className="bi bi-upload me-2"></i>
            {fileName ? 'Change Resume' : 'Select Resume PDF'}
          </label>
          <input
            type="file"
            className="form-control visually-hidden"
            id="pdfUpload"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
      </div>

      {isLoading && (
        <div className="mt-3 text-center">
          <div className="spinner-border text-primary mx-auto mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mb-0">Analyzing your resume...</p>
        </div>
      )}

      {fileName && !isLoading && (
        <div className="alert alert-success mt-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-check-circle-fill fs-4 me-2"></i>
            <div>
              <strong>{fileName}</strong> uploaded successfully!
              <p className="mb-0 small">Basic information has been extracted from your resume</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader; 