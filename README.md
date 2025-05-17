# SavoFolio

SavoFolio è un'applicazione web che consente agli utenti di generare facilmente un sito portfolio personalizzato utilizzando l'intelligenza artificiale di Claude 3.7 Sonnet.

## Funzionalità

- **Upload CV**: Carica il tuo CV in formato PDF per estrarre automaticamente informazioni rilevanti
- **Creazione Portfolio**: Personalizza il tuo portfolio con progetti, biografia e stile
- **Generazione AI**: Utilizza Claude 3.7 Sonnet per generare codice HTML, CSS e JavaScript
- **Editor Integrato**: Modifica il codice generato con Monaco Editor
- **Anteprima Live**: Visualizza in tempo reale le modifiche
- **Esportazione**: Scarica il tuo portfolio completo come file ZIP pronto per essere pubblicato

## Tecnologie

- React + Vite
- Bootstrap 5
- Monaco Editor
- JSZip
- API Claude (Anthropic)
- PDF.js (simulato)

## Installazione

```bash
# Clona il repository
git clone https://github.com/tuoutente/savofolio.git
cd savofolio

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

## Configurazione API Claude

Per utilizzare la generazione AI, è necessario configurare una chiave API di Claude:

1. Visita [Anthropic Console](https://console.anthropic.com/)
2. Crea un account e genera una chiave API
3. Crea un file `.env` nella directory principale del progetto
4. Aggiungi la tua chiave API nel file `.env` come segue:

```
VITE_CLAUDE_API_KEY=sk-ant-api03-...
```

**Nota importante**: Il file `.env` non viene tracciato da Git, assicurandosi che la tua chiave API rimanga privata. 
Non condividere mai direttamente la tua chiave API in repository pubblici.

Se ricevi un errore relativo alla chiave API durante la generazione del portfolio, verifica che:
- Il file `.env` sia nella directory principale del progetto
- La variabile sia esattamente chiamata `VITE_CLAUDE_API_KEY`
- Il valore della chiave API sia valido e attivo
- L'applicazione sia stata riavviata dopo l'aggiunta del file `.env`

## Utilizzo

1. Compila il form con i tuoi dati personali e carica il tuo CV
2. Scegli uno stile e una palette di colori per il tuo portfolio
3. Genera il portfolio con Claude
4. Modifica il codice se necessario
5. Scarica il portfolio completo in formato ZIP
6. Pubblica il tuo portfolio online

## Struttura del Progetto

```
src/
├── components/         # Componenti React
├── services/           # Servizi (API, ecc.)
├── types/              # Definizioni TypeScript
└── styles/             # File CSS
```

## Licenza

MIT

---

Creato con ❤️ utilizzando Claude 3.7 Sonnet
