import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/app/utils/pdfParser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Nessun file caricato' },
        { status: 400 }
      );
    }

    // Verifica che sia un PDF
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Il file deve essere un PDF' },
        { status: 400 }
      );
    }
    
    // Verifica la dimensione del file (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Il file è troppo grande. La dimensione massima è 10MB' },
        { status: 400 }
      );
    }

    // Converti il file in buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Verifica che il buffer non sia vuoto
    if (buffer.length === 0) {
      return NextResponse.json(
        { error: 'Il file PDF è vuoto' },
        { status: 400 }
      );
    }
    
    // Estrai testo dal PDF
    const text = await extractTextFromPDF(buffer);
    
    // Verifica che sia stato estratto del testo
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Non è stato possibile estrarre testo dal PDF. Potrebbe essere protetto o contenere solo immagini.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Errore durante l\'elaborazione del PDF:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Errore durante l\'elaborazione del PDF';
      
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 