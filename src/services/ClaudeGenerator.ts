import axios from 'axios';
import type { GeneratedCode } from '../types';

// Utilizziamo l'API key dalle variabili d'ambiente
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';

export interface ClaudeResponse {
  content: {
    type: string;
    text: string;
  }[];
  id: string;
  model: string;
  role: string;
  stop_reason: string;
  type: string;
}

// Logging per debug
function logDebug(message: string, data?: any) {
  console.log(`🤖 [ClaudeAPI] ${message}`);
  if (data) {
    console.log(data);
  }
}

export async function generatePortfolio(prompt: string): Promise<GeneratedCode> {
  logDebug('Inizio generazione portfolio...');
  
  // Stampa il prompt completo per debug
  console.log("PROMPT COMPLETO:", prompt);
  
  try {
    // Verifica se l'API key è disponibile
    if (!API_KEY) {
      logDebug('API key non trovata - uso il generatore demo');
      return generateDemoPortfolio(prompt);
    }

    logDebug('API key trovata, preparazione richiesta...');
    
    try {
      logDebug('Inviando richiesta a Claude API...');
      
      const systemMessage = `You are an expert web developer specializing in portfolio websites.
Your task is to create a responsive, full-width portfolio website that EXACTLY matches the style and colors specified by the user.
You MUST use the exact colors provided in the PRIMARY COLOR, SECONDARY COLOR, and ACCENT COLOR fields.
The style must match the STYLE specified. Use a full-width layout.
Return complete HTML, CSS, and JS code blocks.`;
      
      // Effettua una vera chiamata all'API di Claude 3.7 Sonnet
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 4000,
          system: systemMessage,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1, // Ridotta per avere output più deterministici
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      logDebug('Risposta ricevuta da Claude API!');
      const data = response.data as ClaudeResponse;
      const generatedText = data.content[0].text;

      logDebug('Testo generato:', generatedText.substring(0, 200) + '...');

      // Estrazione di HTML, CSS e JS
      const htmlMatch = generatedText.match(/```html\n([\s\S]*?)```/);
      const cssMatch = generatedText.match(/```css\n([\s\S]*?)```/);
      const jsMatch = generatedText.match(/```js\n([\s\S]*?)```/);
      const jsMatch2 = generatedText.match(/```javascript\n([\s\S]*?)```/);

      if (!htmlMatch) logDebug('ERRORE: HTML non trovato nella risposta');
      if (!cssMatch) logDebug('ERRORE: CSS non trovato nella risposta');
      if (!jsMatch && !jsMatch2) logDebug('ERRORE: JavaScript non trovato nella risposta');

      logDebug('Codice estratto con successo dalla risposta di Claude');
      
      return {
        html: htmlMatch ? htmlMatch[1] : '<div class="error-message">Errore: HTML non generato correttamente. Riprova con opzioni diverse.</div>',
        css: cssMatch ? cssMatch[1] : '/* CSS non trovato nella risposta */',
        js: jsMatch ? jsMatch[1] : (jsMatch2 ? jsMatch2[1] : '// JavaScript non trovato o non necessario')
      };
    } catch (apiError: any) {
      // Log dettagliato dell'errore API
      logDebug('Errore durante la chiamata API', apiError);
      if (apiError.response) {
        logDebug('Dettaglio errore:', apiError.response.data);
      }
      return generateDemoPortfolio(prompt);
    }
  } catch (error) {
    console.error('Errore chiamando Claude API:', error);
    return generateDemoPortfolio(prompt);
  }
}

function generateDemoHtml(name: string, bio: string, projects: string[], skills: string[], style: string, colors: string[]) {
  const primaryColor = colors[0];
  
  // Prepare projects HTML
  const projectsHtml = projects.length > 0 
    ? projects.map(p => {
        const titleMatch = p.match(/- ([^:]+):/);
        const title = titleMatch ? titleMatch[1].trim() : 'Project';
        const description = p.replace(/- [^:]+:/, '').trim();
        
        return `
          <div class="col-md-4 mb-4">
            <div class="card h-100 project-card">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description || 'Project description goes here.'}</p>
                <a href="#" class="btn btn-primary">View Project</a>
              </div>
            </div>
          </div>
        `;
      }).join('\n')
    : `
      <div class="col-md-4 mb-4">
        <div class="card h-100 project-card">
          <div class="card-body">
            <h5 class="card-title">Sample Project</h5>
            <p class="card-text">This is a sample project description for ${name}.</p>
            <a href="#" class="btn btn-primary">View Project</a>
          </div>
        </div>
      </div>
    `;
  
  // Prepare skills HTML
  const skillsHtml = skills.map(skill => `<span class="badge skill-badge">${skill}</span>`).join(' ');
  
  // Choose appropriate classes based on style
  let headerClass = "bg-dark text-white py-5";
  
  if (style === 'dark') {
    headerClass = "bg-dark text-white py-5";
  } else if (style === 'minimal') {
    headerClass = "bg-light text-dark py-5 border-bottom";
  } else if (style === 'neon' || style === 'cyberpunk') {
    headerClass = "bg-dark text-white py-5 neon-header";
  } else if (style === 'neobrutalism') {
    headerClass = "bg-warning text-dark py-5 brutalist-header";
  }
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Portfolio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>
<body class="${style}-theme">
  <nav class="navbar navbar-expand-lg ${style === 'dark' || style === 'neon' || style === 'cyberpunk' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} sticky-top">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="#">${name.split(' ')[0]}</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link active" href="#home">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#about">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#projects">Projects</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#skills">Skills</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#contact">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <header id="home" class="${headerClass}">
    <div class="container-fluid px-5">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h1 class="display-4 fw-bold">${name}</h1>
          <p class="lead">Web Developer & Designer</p>
          <div class="mt-4">
            <a href="#contact" class="btn btn-primary btn-lg me-2">Contact Me</a>
            <a href="#projects" class="btn btn-outline-light btn-lg">View Work</a>
          </div>
        </div>
        <div class="col-md-6 d-none d-md-block text-center">
          <img src="https://via.placeholder.com/500" class="img-fluid rounded-circle header-img" alt="Profile">
        </div>
      </div>
    </div>
  </header>
  
  <main>
    <section id="about" class="py-5">
      <div class="container-fluid px-5">
        <div class="section-header text-center mb-5">
          <h2 class="fw-bold">About Me</h2>
          <div class="section-divider"></div>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <p class="lead text-center about-text">${bio}</p>
          </div>
        </div>
      </div>
    </section>
    
    <section id="projects" class="py-5 bg-light">
      <div class="container-fluid px-5">
        <div class="section-header text-center mb-5">
          <h2 class="fw-bold">My Projects</h2>
          <div class="section-divider"></div>
        </div>
        <div class="row">
          ${projectsHtml}
        </div>
      </div>
    </section>
    
    <section id="skills" class="py-5">
      <div class="container-fluid px-5">
        <div class="section-header text-center mb-5">
          <h2 class="fw-bold">Skills</h2>
          <div class="section-divider"></div>
        </div>
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <div class="skills-container text-center">
              ${skillsHtml}
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="contact" class="py-5 bg-light">
      <div class="container-fluid px-5">
        <div class="section-header text-center mb-5">
          <h2 class="fw-bold">Get In Touch</h2>
          <div class="section-divider"></div>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <form>
              <div class="mb-3">
                <input type="text" class="form-control" placeholder="Your Name" required>
              </div>
              <div class="mb-3">
                <input type="email" class="form-control" placeholder="Your Email" required>
              </div>
              <div class="mb-3">
                <textarea class="form-control" rows="5" placeholder="Your Message" required></textarea>
              </div>
              <div class="text-center">
                <button type="submit" class="btn btn-primary btn-lg">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
  
  <footer class="${style === 'dark' || style === 'neon' || style === 'cyberpunk' ? 'bg-dark text-white' : 'bg-light text-dark'} py-4">
    <div class="container-fluid px-5 text-center">
      <div class="social-icons mb-3">
        <a href="#" class="me-3"><i class="bi bi-github"></i></a>
        <a href="#" class="me-3"><i class="bi bi-linkedin"></i></a>
        <a href="#" class="me-3"><i class="bi bi-twitter"></i></a>
        <a href="#" class="me-3"><i class="bi bi-envelope"></i></a>
      </div>
      <p class="mb-0">© ${new Date().getFullYear()} ${name}. All rights reserved.</p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}

function generateDemoCss(style: string, colors: string[]) {
  const primaryColor = colors[0];
  const secondaryColor = colors[1];
  const accentColor = colors[2];
  
  let specialStyles = '';
  
  if (style === 'dark') {
    specialStyles = `
body {
  background-color: #121212;
  color: #f8f9fa;
}

.bg-light {
  background-color: #1e1e1e !important;
}

.card {
  background-color: #2a2a2a;
  color: #f8f9fa;
  border: none;
}`;
  } else if (style === 'neon') {
    specialStyles = `
body {
  background-color: #0a0a1a;
  color: #ffffff;
}

.neon-header {
  box-shadow: 0 0 20px ${primaryColor}80;
}

.section-divider {
  box-shadow: 0 0 10px ${primaryColor};
}

.nav-link:hover, .navbar-brand:hover {
  text-shadow: 0 0 8px ${primaryColor};
}

.skill-badge {
  box-shadow: 0 0 8px ${primaryColor}80;
}`;
  } else if (style === 'neobrutalism') {
    specialStyles = `
.brutalist-header {
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.9);
  border: 3px solid #000;
}

.card {
  border: 3px solid #000;
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.9);
  border-radius: 0;
}

.btn {
  border: 3px solid #000;
  border-radius: 0;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.9);
  transform: rotate(-1deg);
}

.form-control {
  border: 3px solid #000;
  border-radius: 0;
}`;
  } else if (style === 'glassmorphism') {
    specialStyles = `
body {
  background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20);
  background-attachment: fixed;
}

.card, .navbar, section {
  background-color: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.btn {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
}`;
  } else if (style === 'cyberpunk') {
    specialStyles = `
body {
  background-color: #0a0a1a;
  color: #ffffff;
  font-family: 'Courier New', monospace;
}

h1, h2, h3 {
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, ${primaryColor}, transparent);
}

.card {
  border: 1px solid ${primaryColor};
  background-color: #0a0a1a;
}

.btn {
  background: ${primaryColor};
  color: #000;
  font-weight: bold;
  text-transform: uppercase;
  border: none;
}

.navbar, footer {
  background-color: #000 !important;
  border-bottom: 2px solid ${primaryColor};
}`;
  }
  
  return `body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  scroll-behavior: smooth;
  width: 100%;
  overflow-x: hidden;
}

/* Header Styles */
.header-img {
  max-width: 80%;
}

/* Section Styles */
.section-header {
  position: relative;
  margin-bottom: 2rem;
}

.section-divider {
  width: 80px;
  height: 4px;
  background-color: ${primaryColor};
  margin: 0 auto;
  margin-top: 1rem;
}

/* Project Cards */
.project-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Skills */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.skill-badge {
  background-color: ${primaryColor};
  font-size: 1rem;
  padding: 8px 15px;
  border-radius: 30px;
  color: white;
}

/* Social Icons */
.social-icons a {
  font-size: 1.5rem;
  color: ${primaryColor};
  transition: transform 0.3s ease;
}

.social-icons a:hover {
  transform: translateY(-3px);
}

/* Primary buttons */
.btn-primary {
  background-color: ${primaryColor};
  border-color: ${primaryColor};
}

.btn-primary:hover {
  background-color: ${primaryColor}dd;
  border-color: ${primaryColor}dd;
}

/* Secondary elements */
.btn-secondary, .bg-secondary, .text-secondary {
  background-color: ${secondaryColor};
  border-color: ${secondaryColor};
  color: white;
}

/* Accent elements */
.btn-accent, .accent-border {
  border-color: ${accentColor};
}

.accent-text, .accent-icon {
  color: ${accentColor};
}

/* Container fluid fixes */
.container-fluid {
  max-width: 100%;
  width: 100%;
}

/* Specific Style Customizations */
${specialStyles}

/* Animation */
@media (prefers-reduced-motion: no-preference) {
  .header-img {
    animation: pulse 3s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
}

/* Full width layout fixes */
section {
  width: 100%;
}

.row {
  width: 100%;
  margin-left: 0;
  margin-right: 0;
}`;
}

function generateDemoJs() {
  return `// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const href = this.getAttribute('href');
      if (!href) return;
      
      const target = document.querySelector(href);
      if (!target) return;
      
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  });
  
  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', function() {
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
  
  console.log('Portfolio loaded successfully! Full-width layout applied.');
});`;
}

// Funzione separata per generare un portfolio demo
function generateDemoPortfolio(prompt: string): GeneratedCode {
  logDebug('Utilizzo generatore di contenuto demo...');
  
  // Estrai stile e colori dal prompt con regex precise
  const styleMatch = prompt.match(/STYLE:\s*(\w+)/i);
  const style = styleMatch ? styleMatch[1].toLowerCase() : 'modern';
  
  // Estrai i colori esatti dal prompt
  let colors = ['#3498db', '#2ecc71', '#f39c12']; // default
  
  const primaryColorMatch = prompt.match(/PRIMARY COLOR:\s*(#[0-9a-fA-F]{6})/i);
  if (primaryColorMatch && primaryColorMatch[1]) {
    colors[0] = primaryColorMatch[1];
  }
  
  const secondaryColorMatch = prompt.match(/SECONDARY COLOR:\s*(#[0-9a-fA-F]{6})/i);
  if (secondaryColorMatch && secondaryColorMatch[1]) {
    colors[1] = secondaryColorMatch[1];
  }
  
  const accentColorMatch = prompt.match(/ACCENT COLOR:\s*(#[0-9a-fA-F]{6})/i);
  if (accentColorMatch && accentColorMatch[1]) {
    colors[2] = accentColorMatch[1];
  }
  
  // Estrai nome e bio
  const nameMatch = prompt.match(/NAME:\s*([^\n]+)/i);
  const userName = nameMatch ? nameMatch[1].trim() : 'John Doe';
  
  const bioMatch = prompt.match(/BIO:\s*([^\n]+(?:\n[^\n]+)*)/i);
  const bio = bioMatch ? bioMatch[1].trim() : 'A passionate developer';
  
  // Estrai progetti, skills, ecc.
  let projectsList: string[] = [];
  const projectsSection = prompt.match(/PROJECTS:\s*\n((?:- [^\n]+\n?)+)/i);
  if (projectsSection && projectsSection[1]) {
    projectsList = projectsSection[1].split('\n').filter(line => line.trim().startsWith('-'));
  }
  
  let skills: string[] = ['HTML', 'CSS', 'JavaScript'];
  const skillsMatch = prompt.match(/SKILLS:\s*([^]*?)(?=\n\n|\n[A-Z]+:)/i);
  if (skillsMatch && skillsMatch[1]) {
    skills = skillsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }
  
  // Genera HTML, CSS e JS
  logDebug('Generazione HTML con stile:', style);
  logDebug('Colori usati:', colors);
  
  const html = generateDemoHtml(userName, bio, projectsList, skills, style, colors);
  const css = generateDemoCss(style, colors);
  const js = generateDemoJs();
  
  return {
    html,
    css,
    js
  };
}

export default {
  generatePortfolio
}; 