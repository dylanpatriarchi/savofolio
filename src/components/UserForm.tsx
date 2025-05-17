import { useState } from 'react';
import type { UserData, Project, PDFData, PortfolioStyle } from '../types';
import PDFUploader from './PDFUploader';
import StylePreview from './StylePreview';

interface UserFormProps {
  initialData: UserData;
  onDataUpdate: (data: UserData) => void;
  onNext: () => void;
}

interface StyleOption {
  value: PortfolioStyle;
  label: string;
  description: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

const UserForm = ({ initialData, onDataUpdate, onNext }: UserFormProps) => {
  const [userData, setUserData] = useState<UserData>({
    ...initialData,
    colorPalette: initialData.colorPalette || 'custom'
  });

  const styleOptions: StyleOption[] = [
    { 
      value: 'minimal', 
      label: 'Minimal', 
      description: 'Clean, simple design with plenty of white space and elegant typography' 
    },
    { 
      value: 'modern', 
      label: 'Modern', 
      description: 'Contemporary style with smooth transitions and balanced layout' 
    },
    { 
      value: 'dark', 
      label: 'Dark Mode', 
      description: 'Sleek dark theme with high contrast elements' 
    },
    { 
      value: 'neon', 
      label: 'Neon', 
      description: 'Vibrant glowing effects with bright colors against dark backgrounds' 
    },
    { 
      value: 'retro', 
      label: 'Retro', 
      description: 'Vintage aesthetics with nostalgic typography and color schemes' 
    },
    { 
      value: 'neobrutalism', 
      label: 'Neo-Brutalism', 
      description: 'Bold, raw design with strong colors, thick borders and shadows' 
    },
    { 
      value: 'glassmorphism', 
      label: 'Glassmorphism', 
      description: 'Frosted glass effect with transparency and subtle borders' 
    },
    { 
      value: 'cyberpunk', 
      label: 'Cyberpunk', 
      description: 'Futuristic style with neon accents and digital elements' 
    },
    { 
      value: 'neumorphism', 
      label: 'Neumorphism', 
      description: 'Soft UI with subtle shadows creating a semi-3D effect' 
    },
    { 
      value: 'gradient', 
      label: 'Gradient', 
      description: 'Smooth color transitions creating depth and movement' 
    }
  ];

  const colorPalettes: ColorPalette[] = [
    {
      id: 'custom',
      name: 'Custom',
      colors: userData.colors,
      description: 'Choose your own colors'
    },
    {
      id: 'midnight-blue',
      name: 'Midnight Blue',
      colors: ['#1a237e', '#283593', '#3949ab'],
      description: 'Deep blue tones inspired by the night sky'
    },
    {
      id: 'emerald-green',
      name: 'Emerald Green',
      colors: ['#004d40', '#00695c', '#00796b'],
      description: 'Rich green tones evoking natural landscapes'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      colors: ['#ff9e80', '#ff6e40', '#ff3d00'],
      description: 'Warm orange and red tones like a setting sun'
    },
    {
      id: 'lavender',
      name: 'Lavender Dream',
      colors: ['#7e57c2', '#9575cd', '#b39ddb'],
      description: 'Soft purple gradient reminiscent of lavender fields'
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      colors: ['#212121', '#616161', '#9e9e9e'],
      description: 'Classic black and gray tones for a timeless look'
    },
    {
      id: 'ocean',
      name: 'Ocean Breeze',
      colors: ['#006064', '#0097a7', '#00bcd4'],
      description: 'Cool blue-teal gradient inspired by the sea'
    },
    {
      id: 'forest',
      name: 'Forest',
      colors: ['#1b5e20', '#2e7d32', '#388e3c'],
      description: 'Deep green tones representing dense forests'
    },
    {
      id: 'berry',
      name: 'Berry',
      colors: ['#880e4f', '#ad1457', '#c2185b'],
      description: 'Rich pink and purple tones like summer berries'
    },
    {
      id: 'pastel',
      name: 'Pastel',
      colors: ['#ffccbc', '#b2dfdb', '#d1c4e9'],
      description: 'Soft, muted colors that work well together'
    }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...userData.colors];
    newColors[index] = color;
    setUserData((prev) => ({ ...prev, colors: newColors }));
  };

  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paletteId = e.target.value;
    const palette = colorPalettes.find(p => p.id === paletteId);
    
    if (palette) {
      setUserData(prev => ({
        ...prev,
        colorPalette: paletteId,
        colors: paletteId === 'custom' ? prev.colors : [...palette.colors]
      }));
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      link: ''
    };
    setUserData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const handleProjectChange = (id: string, field: keyof Project, value: string) => {
    setUserData((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const handleRemoveProject = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id)
    }));
  };

  const handlePDFDataExtracted = (pdfData: PDFData) => {
    setUserData((prev) => ({
      ...prev,
      name: pdfData.name || prev.name,
      pdfData
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDataUpdate(userData);
    onNext();
  };

  const selectedStyle = styleOptions.find(style => style.value === userData.style);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h4 className="mb-3 fw-bold d-flex align-items-center">
          <i className="bi bi-file-earmark-person me-2 text-primary"></i>
          Resume Upload
        </h4>
        <PDFUploader onPDFDataExtracted={handlePDFDataExtracted} />
      </div>

      <div className="mb-4">
        <h4 className="mb-3 fw-bold d-flex align-items-center">
          <i className="bi bi-person-vcard me-2 text-primary"></i>
          Personal Information
        </h4>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Bio / About Me</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            rows={3}
            value={userData.bio}
            onChange={handleInputChange}
            placeholder="I'm a passionate developer with experience in..."
            required
          ></textarea>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="mb-3 fw-bold d-flex align-items-center">
          <i className="bi bi-briefcase me-2 text-primary"></i>
          Projects
          <span className="ms-auto">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={handleAddProject}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Project
            </button>
          </span>
        </h4>

        {userData.projects.length === 0 && (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            No projects added yet. Click the "Add Project" button to add your first project.
          </div>
        )}

        {userData.projects.map((project) => (
          <div key={project.id} className="project-card mb-3">
            <div className="mb-2">
              <label htmlFor={`project-title-${project.id}`} className="form-label">Project Title</label>
              <input
                type="text"
                className="form-control"
                id={`project-title-${project.id}`}
                value={project.title}
                onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                placeholder="E-commerce Website"
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor={`project-desc-${project.id}`} className="form-label">Description</label>
              <textarea
                className="form-control"
                id={`project-desc-${project.id}`}
                rows={2}
                value={project.description}
                onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                placeholder="A responsive website built with React, Node.js, and MongoDB..."
                required
              ></textarea>
            </div>
            <div className="mb-2">
              <label htmlFor={`project-link-${project.id}`} className="form-label">Project Link</label>
              <input
                type="url"
                className="form-control"
                id={`project-link-${project.id}`}
                value={project.link}
                onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="text-end">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveProject(project.id)}
              >
                <i className="bi bi-trash me-1"></i>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="mb-3 fw-bold d-flex align-items-center">
          <i className="bi bi-palette me-2 text-primary"></i>
          Portfolio Style
        </h4>
        
        <div className="mb-4">
          <label htmlFor="style" className="form-label">Design Style</label>
          <div className="row">
            <div className="col-md-8">
              <select
                className="form-select"
                id="style"
                name="style"
                value={userData.style}
                onChange={handleInputChange}
              >
                {styleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {selectedStyle && (
                <div className="form-text mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  {selectedStyle.description}
                </div>
              )}
            </div>
            <div className="col-md-4">
              <div className="style-preview-container">
                <StylePreview style={userData.style} colors={userData.colors} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="colorPalette" className="form-label">Color Palette</label>
          <select
            className="form-select"
            id="colorPalette"
            name="colorPalette"
            value={userData.colorPalette}
            onChange={handlePaletteChange}
          >
            {colorPalettes.map((palette) => (
              <option key={palette.id} value={palette.id}>
                {palette.name}
              </option>
            ))}
          </select>
          
          <div className="form-text mt-2 mb-3">
            <i className="bi bi-info-circle me-1"></i>
            {colorPalettes.find(p => p.id === userData.colorPalette)?.description || "Choose your color palette"}
          </div>
          
          <div className="color-preview mt-3">
            <div className="d-flex gap-2 mb-2">
              {userData.colors.map((color, index) => (
                <div 
                  key={index} 
                  className="color-block rounded" 
                  style={{ 
                    backgroundColor: color,
                    width: '40px',
                    height: '40px',
                    border: '1px solid #dee2e6'
                  }}
                ></div>
              ))}
            </div>
            
            {userData.colorPalette === 'custom' && (
              <div className="mt-2">
                <label className="form-label">Customize Colors</label>
                <div className="row g-2">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="col-4">
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={userData.colors[index] || '#ffffff'}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        title={`Color ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-grid mt-5">
        <button type="submit" className="btn btn-primary btn-lg">
          <i className="bi bi-arrow-right-circle me-2"></i>
          Continue to Step 2
        </button>
      </div>
    </form>
  );
};

export default UserForm; 