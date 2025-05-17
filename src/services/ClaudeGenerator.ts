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

export async function generatePortfolio(prompt: string): Promise<GeneratedCode> {
  try {
    // Verifica se l'API key è disponibile
    if (!API_KEY) {
      throw new Error('API key di Claude non trovata. Verifica il file .env con la variabile VITE_CLAUDE_API_KEY.');
    }

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

    const data = response.data as ClaudeResponse;
    const generatedText = data.content[0].text;

    // Estrazione di HTML, CSS e JS
    const htmlMatch = generatedText.match(/```html\n([\s\S]*?)```/);
    const cssMatch = generatedText.match(/```css\n([\s\S]*?)```/);
    const jsMatch = generatedText.match(/```js\n([\s\S]*?)```/);
    const jsMatch2 = generatedText.match(/```javascript\n([\s\S]*?)```/);

    return {
      html: htmlMatch ? htmlMatch[1] : '<div>Errore: HTML non trovato nella risposta</div>',
      css: cssMatch ? cssMatch[1] : '/* CSS non trovato nella risposta */',
      js: jsMatch ? jsMatch[1] : (jsMatch2 ? jsMatch2[1] : '// JS non trovato o non necessario')
    };
  } catch (error) {
    console.error('Errore chiamando Claude API:', error);

    // Modello fittizio di risposta per test di sviluppo
    return {
      html: `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Esempio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <header class="bg-dark text-white py-5">
    <div class="container">
      <h1>Nome Utente</h1>
      <p class="lead">Sviluppatore Web</p>
    </div>
  </header>
  
  <main class="container my-5">
    <section id="about" class="mb-5">
      <h2>Chi Sono</h2>
      <p>Questo è un esempio di bio.</p>
    </section>
    
    <section id="projects" class="mb-5">
      <h2>Progetti</h2>
      <div class="row">
        <div class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Progetto Esempio</h5>
              <p class="card-text">Descrizione progetto di esempio.</p>
              <a href="#" class="btn btn-primary">Vedi Progetto</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section id="skills">
      <h2>Competenze</h2>
      <div class="row">
        <div class="col-md-6">
          <ul class="list-group">
            <li class="list-group-item">HTML</li>
            <li class="list-group-item">CSS</li>
            <li class="list-group-item">JavaScript</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
  
  <footer class="bg-dark text-white py-4">
    <div class="container text-center">
      <p>© 2024 Nome Utente. Tutti i diritti riservati.</p>
    </div>
  </footer>
</body>
</html>`,
      css: `body {
  font-family: 'Arial', sans-serif;
}

header {
  background-color: #3498db;
}

.section-title {
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}`,
      js: `// Esempio di JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Portfolio caricato!');
});`
    };
  }
}

export default {
  generatePortfolio
}; 