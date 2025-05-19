import OpenAI from 'openai';

// Inizializza il client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PortfolioData {
  cvText: string;
  profession: string;
  projects: string;
}

export interface GeneratedFiles {
  html: string;
  css: string;
  js: string;
}

export async function generatePortfolio(data: PortfolioData): Promise<GeneratedFiles> {
  const prompt = `
Crea un portfolio professionale basato sulle seguenti informazioni:

CV: ${data.cvText}

Professione: ${data.profession}

Progetti: ${data.projects}

Genera un sito web completo con una buona UI/UX, responsive e moderno.
Rispondi SOLO con tre blocchi di codice: HTML, CSS e JavaScript separati dai tag di delimitazione.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto sviluppatore web. Devi generare HTML, CSS e JavaScript per un portfolio professionale.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Estrai i blocchi di codice
    const htmlMatch = content.match(/<html>([\s\S]*?)<\/html>|```html([\s\S]*?)```/);
    const cssMatch = content.match(/<css>([\s\S]*?)<\/css>|```css([\s\S]*?)```/);
    const jsMatch = content.match(/<javascript>([\s\S]*?)<\/javascript>|```javascript([\s\S]*?)```|```js([\s\S]*?)```/);

    return {
      html: htmlMatch ? (htmlMatch[1] || htmlMatch[2] || '').trim() : '',
      css: cssMatch ? (cssMatch[1] || cssMatch[2] || '').trim() : '',
      js: jsMatch ? (jsMatch[1] || jsMatch[2] || jsMatch[3] || '').trim() : ''
    };
  } catch (error) {
    console.error('Errore durante la generazione del portfolio:', error);
    throw new Error('Impossibile generare il portfolio');
  }
} 