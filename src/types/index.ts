export interface UserData {
  name: string;
  bio: string;
  projects: Project[];
  style: PortfolioStyle;
  colors: string[];
  pdfData: PDFData | null;
  colorPalette: string;
}

export type PortfolioStyle = 
  'minimal' | 
  'modern' | 
  'dark' | 
  'neon' | 
  'retro' | 
  'neobrutalism' | 
  'glassmorphism' | 
  'cyberpunk' | 
  'neumorphism' | 
  'gradient';

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface Education {
  degree: string;
  institution: string;
  years: string;
}

export interface Experience {
  position: string;
  company: string;
  years: string;
  description: string;
}

export interface PDFData {
  name: string;
  experience: string[];
  education: string[];
  skills: string[];
  rawText: string;
}

export interface GeneratedCode {
  html: string;
  css: string;
  js: string;
} 