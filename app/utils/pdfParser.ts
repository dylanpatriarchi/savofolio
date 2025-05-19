import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Aggiungi opzioni per migliorare l'estrazione del testo
    const options = {
      // Abilita l'estrazione di tutto il testo, compreso il testo in layout complessi
      pagerender: function(pageData: any) {
        return pageData.getTextContent()
          .then(function(textContent: any) {
            let lastY, text = '';
            for (let item of textContent.items) {
              if (lastY == item.transform[5] || !lastY) {
                text += item.str;
              } else {
                text += '\n' + item.str;
              }
              lastY = item.transform[5];
            }
            return text;
          });
      },
      // Imposta il limite delle pagine a 0 per elaborare tutte le pagine
      max: 0
    };

    const data = await pdfParse(buffer, options);
    
    // Verifica che il testo non sia vuoto
    if (!data.text || data.text.trim() === '') {
      throw new Error('Nessun testo estratto dal PDF');
    }
    
    return data.text;
  } catch (error) {
    console.error('Errore durante l\'analisi del PDF:', error);
    
    // Fornisci un messaggio di errore più dettagliato
    if (error instanceof Error) {
      throw new Error(`Impossibile analizzare il PDF: ${error.message}`);
    } else {
      throw new Error('Impossibile analizzare il PDF: formato non supportato');
    }
  }
} 