import { NextRequest, NextResponse } from 'next/server';
import { generatePortfolio, PortfolioData } from '@/app/utils/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.cvText || !body.profession || !body.projects) {
      return NextResponse.json(
        { error: 'Dati mancanti. Assicurati di fornire cvText, profession e projects' },
        { status: 400 }
      );
    }
    
    const portfolioData: PortfolioData = {
      cvText: body.cvText,
      profession: body.profession,
      projects: body.projects
    };
    
    const generatedFiles = await generatePortfolio(portfolioData);
    
    return NextResponse.json(generatedFiles);
  } catch (error) {
    console.error('Errore durante la generazione del portfolio:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione del portfolio' },
      { status: 500 }
    );
  }
} 