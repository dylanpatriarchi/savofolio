import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import type { UserData, GeneratedCode } from './types'
import UserForm from './components/UserForm'
import PromptBuilder from './components/PromptBuilder'
import CodeEditor from './components/CodeEditor'
import PreviewIframe from './components/PreviewIframe'
import DownloadZip from './components/DownloadZip'
import ClaudeGenerator from './services/ClaudeGenerator'

function App() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    bio: '',
    projects: [],
    style: 'modern',
    colors: ['#3498db', '#2ecc71', '#f39c12'],
    pdfData: null,
    colorPalette: 'custom'
  })

  const [generatedCode, setGeneratedCode] = useState<GeneratedCode>({
    html: '',
    css: '',
    js: ''
  })

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  
  // Stato per memorizzare il prompt generato
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const handleUserDataUpdate = (data: UserData) => {
    setUserData(data)
  }

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1)
  }

  const handlePromptGenerated = (prompt: string) => {
    setGeneratedPrompt(prompt);
  }

  const handleGeneratePortfolio = async () => {
    setIsGenerating(true)
    try {
      console.log('Generating portfolio with prompt:', generatedPrompt);
      
      const code = await ClaudeGenerator.generatePortfolio(generatedPrompt)
      setGeneratedCode(code)
      
      setCurrentStep(3)
    } catch (error) {
      console.error('Error during generation:', error)
      alert('An error occurred while generating your portfolio.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCodeChange = (updatedCode: GeneratedCode) => {
    setGeneratedCode(updatedCode)
  }

  return (
    <div className="app-container">
      <header className="header-section">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="site-title">SavoFolio</h1>
              <p className="site-description">Generate your custom portfolio with AI</p>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="steps">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Info</span>
                </div>
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Customize</span>
                </div>
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Generate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-section container">
        {currentStep === 1 && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card">
                <div className="card-header">
                  <h2>Your Information</h2>
                  <p>Let's gather everything we need to create your professional portfolio</p>
                </div>
                <div className="card-body">
                  <UserForm 
                    initialData={userData} 
                    onDataUpdate={handleUserDataUpdate} 
                    onNext={handleNextStep} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="content-card">
                <div className="card-header">
                  <h2>Customize & Generate</h2>
                  <p>Review the AI prompt and generate your portfolio</p>
                </div>
                <div className="card-body">
                  <PromptBuilder 
                    userData={userData} 
                    onGenerate={handleGeneratePortfolio}
                    onPromptGenerated={handlePromptGenerated}
                    isGenerating={isGenerating} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="row editor-preview-section">
            <div className="col-lg-6">
              <div className="content-card h-100">
                <div className="card-header">
                  <h2>Code Editor</h2>
                  <p>Customize your portfolio code</p>
                </div>
                <div className="card-body">
                  <CodeEditor 
                    generatedCode={generatedCode} 
                    onCodeChange={handleCodeChange} 
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="content-card h-100">
                <div className="card-header">
                  <h2>Preview</h2>
                  <p>See your portfolio in real-time</p>
                </div>
                <div className="card-body">
                  <PreviewIframe generatedCode={generatedCode} />
                  <DownloadZip generatedCode={generatedCode} userName={userData.name} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer-section">
        <div className="container py-3 text-center">
          <p className="mb-0">
            <small>Created with <i className="bi bi-stars text-warning"></i> using Claude 3.7 Sonnet</small>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
