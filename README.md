# Savofolio

Savofolio è un'applicazione web che ti permette di generare automaticamente un portfolio professionale a partire dal tuo CV e da altre informazioni che fornisci.

## Caratteristiche

- Caricamento del CV in formato PDF
- Estrazione automatica del testo dal PDF
- Inserimento di informazioni professionali aggiuntive
- Generazione di un sito web portfolio completo (HTML, CSS, JavaScript) tramite OpenAI GPT-4
- Editor di codice integrato per modificare il portfolio generato
- Anteprima in tempo reale delle modifiche
- Esportazione del portfolio come archivio ZIP

## Stack Tecnologico

- **Frontend**: Next.js (React), Bootstrap
- **Backend API**: Next.js API Routes
- **Librerie principali**:
  - `pdf-parse`: Per l'estrazione del testo dai PDF
  - `monaco-editor`: Editor di codice avanzato
  - `jszip`: Per la creazione dell'archivio ZIP
  - `openai`: Per l'integrazione con l'API di OpenAI

## Installazione

1. Clona questo repository:
   ```
   git clone https://github.com/tuoutente/savofolio.git
   cd savofolio
   ```

2. Installa le dipendenze:
   ```
   npm install
   ```

3. Crea un file `.env.local` nella radice del progetto con la tua chiave API di OpenAI:
   ```
   OPENAI_API_KEY=la-tua-chiave-api
   ```

4. Avvia il server di sviluppo:
   ```
   npm run dev
   ```

5. Apri [http://localhost:3000](http://localhost:3000) nel tuo browser.

## Utilizzo

1. Carica il tuo CV in formato PDF
2. Inserisci la tua professione e descrivi i tuoi progetti principali
3. Clicca su "Genera Portfolio"
4. Visualizza e modifica il codice HTML, CSS e JavaScript generato
5. Controlla l'anteprima del portfolio
6. Scarica il portfolio come file ZIP

## Licenza

MIT

## Note

Questo progetto è stato creato come esempio di integrazione tra Next.js e OpenAI. Non memorizza dati personali e tutti i dati vengono elaborati in memoria.
