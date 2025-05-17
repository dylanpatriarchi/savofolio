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
  logDebug('Start portfolio generation...');
  logDebug('Prompt:', prompt);
  
  try {
    // Verifica se l'API key è disponibile
    if (!API_KEY) {
      logDebug('API key not found');
      throw new Error('API key di Claude non trovata. Verifica il file .env con la variabile VITE_CLAUDE_API_KEY.');
    }

    logDebug('API key found, preparing request...');
    
    // Simuliamo una chiamata API reale con un ritardo
    logDebug('Sending request to Claude API...');
    
    try {
      // Questo è un placeholder per l'API di Claude
      // In una reale implementazione dovresti usare un backend per nascondere la chiave API
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
            'x-api-key': API_KEY
          }
        }
      );

      logDebug('Response received from Claude API!');
      const data = response.data as ClaudeResponse;
      const generatedText = data.content[0].text;

      // Estrazione di HTML, CSS e JS
      const htmlMatch = generatedText.match(/```html\n([\s\S]*?)```/);
      const cssMatch = generatedText.match(/```css\n([\s\S]*?)```/);
      const jsMatch = generatedText.match(/```js\n([\s\S]*?)```/);
      const jsMatch2 = generatedText.match(/```javascript\n([\s\S]*?)```/);

      logDebug('Successfully extracted code from Claude response');
      
      return {
        html: htmlMatch ? htmlMatch[1] : '<div>Errore: HTML non trovato nella risposta</div>',
        css: cssMatch ? cssMatch[1] : '/* CSS non trovato nella risposta */',
        js: jsMatch ? jsMatch[1] : (jsMatch2 ? jsMatch2[1] : '// JS non trovato o non necessario')
      };
    } catch (apiError) {
      // Log dettagliato dell'errore API
      logDebug('Error during API call', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Errore chiamando Claude API:', error);
    logDebug('Using fallback demo content generator...');
    
    // Simuliamo un ritardo realistico prima di fornire il contenuto demo
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Estraiamo informazioni dal prompt per personalizzare il contenuto demo
    const nameMatch = prompt.match(/for\s+([^\.]+?)\./) || ['', 'John Doe'];
    const userName = nameMatch[1].trim();
    
    const styleMatch = prompt.match(/STYLE:\s+(\w+)/);
    const style = styleMatch ? styleMatch[1] : 'modern';
    
    const colorsMatch = prompt.match(/MAIN COLORS:\s+([^]+?)(?:\n\n|$)/);
    const colors = colorsMatch ? colorsMatch[1].split(',').map(c => c.trim()) : ['#3498db', '#2ecc71'];
    const primaryColor = colors[0] || '#3498db';
    
    const bioMatch = prompt.match(/BIO:\s+([^]+?)(?:\n\n|$)/);
    const bio = bioMatch ? bioMatch[1].trim() : 'A passionate developer';
    
    const projectsSection = prompt.match(/PROJECTS:\s+([^]+?)(?:\n\n|$)/);
    const projectsList = projectsSection ? projectsSection[1].split('\n').filter(p => p.trim()) : [];
    
    const skillsMatch = prompt.match(/SKILLS:\s+([^]+?)(?:\n\n|$)/);
    const skills = skillsMatch ? skillsMatch[1].split(',').map(s => s.trim()) : ['HTML', 'CSS', 'JavaScript'];
    
    // Genera HTML demo personalizzato
    let demoHtml = generateDemoHtml(userName, bio, projectsList, skills, style);
    let demoCss = generateDemoCss(style, primaryColor);
    let demoJs = generateDemoJs();

    logDebug('Demo content generated successfully');
    
    return {
      html: demoHtml,
      css: demoCss,
      js: demoJs
    };
  }
}

function generateDemoHtml(name: string, bio: string, projects: string[], skills: string[], style: string) {
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
  let containerClass = "container";
  
  if (style === 'dark') {
    headerClass = "bg-dark text-white py-5";
  } else if (style === 'minimal') {
    headerClass = "bg-light text-dark py-5 border-bottom";
  } else if (style === 'neon' || style === 'cyberpunk') {
    headerClass = "bg-dark text-white py-5 neon-header";
  } else if (style === 'neobrutalism') {
    headerClass = "bg-warning text-dark py-5 brutalist-header";
    containerClass = "container brutalist-container";
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
    <div class="container">
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
    <div class="${containerClass}">
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
      <div class="${containerClass}">
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
      <div class="${containerClass}">
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
      <div class="${containerClass}">
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
      <div class="${containerClass}">
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
    <div class="${containerClass} text-center">
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

function generateDemoCss(style: string, primaryColor: string) {
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

.brutalist-container {
  transform: translateX(-5px);
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
  }
  
  return `body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  scroll-behavior: smooth;
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
  
  console.log('Portfolio loaded successfully!');
});`;
}

export default {
  generatePortfolio
}; 