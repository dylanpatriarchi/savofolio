import type { PortfolioStyle } from '../types';

interface StylePreviewProps {
  style: PortfolioStyle;
  colors: string[];
}

const StylePreview = ({ style, colors }: StylePreviewProps) => {
  const primaryColor = colors[0] || '#3498db';
  const secondaryColor = colors[1] || '#2ecc71';
  const accentColor = colors[2] || '#f39c12';
  
  const getStylePreview = () => {
    switch(style) {
      case 'minimal':
        return (
          <div className="style-preview-minimal" style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ width: '40%', height: '10px', backgroundColor: primaryColor, marginBottom: '15px' }}></div>
            <div style={{ width: '80%', height: '6px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
            <div style={{ width: '60%', height: '6px', backgroundColor: '#e0e0e0', marginBottom: '15px' }}></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: primaryColor }}></div>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: secondaryColor }}></div>
            </div>
          </div>
        );
      
      case 'modern':
        return (
          <div className="style-preview-modern" style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ width: '50%', height: '12px', backgroundColor: primaryColor, marginBottom: '12px', borderRadius: '3px' }}></div>
            <div style={{ width: '80%', height: '6px', backgroundColor: '#e9e9e9', marginBottom: '8px', borderRadius: '3px' }}></div>
            <div style={{ width: '70%', height: '6px', backgroundColor: '#e9e9e9', marginBottom: '15px', borderRadius: '3px' }}></div>
            <div style={{ 
              width: '80%', 
              padding: '8px', 
              borderLeft: `3px solid ${secondaryColor}`,
              backgroundColor: '#f8f9fa',
              borderRadius: '0 4px 4px 0'
            }}></div>
          </div>
        );
      
      case 'dark':
        return (
          <div className="style-preview-dark" style={{ 
            backgroundColor: '#222',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ width: '50%', height: '10px', backgroundColor: primaryColor, marginBottom: '15px' }}></div>
            <div style={{ width: '80%', height: '6px', backgroundColor: '#444', marginBottom: '10px' }}></div>
            <div style={{ width: '60%', height: '6px', backgroundColor: '#444', marginBottom: '15px' }}></div>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              backgroundColor: '#333',
              border: `2px solid ${secondaryColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '15px', height: '15px', borderRadius: '50%', backgroundColor: secondaryColor }}></div>
            </div>
          </div>
        );
        
      case 'neon':
        return (
          <div className="style-preview-neon" style={{ 
            backgroundColor: '#121212',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: `0 0 15px ${primaryColor}`
          }}>
            <div style={{ 
              width: '60%', 
              height: '12px', 
              backgroundColor: 'transparent', 
              marginBottom: '15px',
              border: `2px solid ${primaryColor}`,
              boxShadow: `0 0 10px ${primaryColor}`,
              borderRadius: '4px'
            }}></div>
            <div style={{ width: '80%', height: '6px', backgroundColor: '#333', marginBottom: '10px' }}></div>
            <div style={{ width: '60%', height: '6px', backgroundColor: '#333', marginBottom: '15px' }}></div>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              backgroundColor: 'transparent',
              border: `2px solid ${secondaryColor}`,
              boxShadow: `0 0 10px ${secondaryColor}`,
              display: 'inline-block',
              marginRight: '10px'
            }}></div>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              backgroundColor: 'transparent',
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 10px ${accentColor}`,
              display: 'inline-block'
            }}></div>
          </div>
        );
        
      case 'retro':
        return (
          <div className="style-preview-retro" style={{ 
            backgroundColor: '#f8f5e4',
            borderRadius: '0',
            padding: '15px',
            boxShadow: '5px 5px 0 rgba(0, 0, 0, 0.8)',
            border: '2px solid #000'
          }}>
            <div style={{ 
              width: '60%', 
              height: '12px', 
              backgroundColor: primaryColor, 
              marginBottom: '15px',
              border: '1px solid #000'
            }}></div>
            <div style={{ 
              width: '80%', 
              height: '6px', 
              backgroundColor: '#ddd8c4', 
              marginBottom: '10px',
              border: '1px solid #000'
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '6px', 
              backgroundColor: '#ddd8c4', 
              marginBottom: '15px',
              border: '1px solid #000'
            }}></div>
            <div style={{ 
              display: 'inline-block',
              paddingLeft: '10px',
              paddingRight: '10px',
              backgroundColor: secondaryColor,
              border: '1px solid #000',
              boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)'
            }}>
              <div style={{ width: '30px', height: '15px' }}></div>
            </div>
          </div>
        );
        
      case 'neobrutalism':
        return (
          <div className="style-preview-neobrutalism" style={{ 
            backgroundColor: 'white',
            padding: '15px',
            boxShadow: '8px 8px 0 rgba(0, 0, 0, 0.9)',
            border: '3px solid #000',
            position: 'relative'
          }}>
            <div style={{ 
              width: '60%', 
              height: '20px', 
              backgroundColor: primaryColor, 
              marginBottom: '15px',
              border: '3px solid #000',
              boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.9)'
            }}></div>
            <div style={{ 
              width: '80%', 
              height: '8px', 
              backgroundColor: '#f3f3f3', 
              marginBottom: '10px',
              border: '1px solid #000'
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '8px', 
              backgroundColor: '#f3f3f3', 
              marginBottom: '15px',
              border: '1px solid #000'
            }}></div>
            <div style={{ 
              display: 'inline-block',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingTop: '5px',
              paddingBottom: '5px',
              backgroundColor: secondaryColor,
              border: '3px solid #000',
              boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.9)',
              fontWeight: 'bold',
              transform: 'rotate(-2deg)'
            }}></div>
          </div>
        );
        
      case 'glassmorphism':
        return (
          <div className="style-preview-glassmorphism" style={{ 
            background: 'linear-gradient(135deg, ' + colors.map(c => c + '20').join(', ') + ')',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '15px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ 
              width: '60%', 
              height: '12px', 
              backgroundColor: primaryColor + '80', 
              marginBottom: '15px',
              borderRadius: '6px'
            }}></div>
            <div style={{ 
              width: '80%', 
              height: '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              marginBottom: '10px',
              borderRadius: '3px'
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              marginBottom: '15px',
              borderRadius: '3px'
            }}></div>
            <div style={{ 
              width: '40%',
              padding: '8px', 
              backgroundColor: secondaryColor + '40',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)'
            }}></div>
          </div>
        );
        
      case 'cyberpunk':
        return (
          <div className="style-preview-cyberpunk" style={{ 
            backgroundColor: '#0a0a20',
            borderRadius: '0',
            padding: '15px',
            boxShadow: `0 0 20px ${primaryColor}80, 0 0 40px ${secondaryColor}40`,
            border: `1px solid ${primaryColor}`,
            position: 'relative'
          }}>
            <div style={{ 
              width: '70%', 
              height: '12px', 
              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`, 
              marginBottom: '15px',
              clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)'
            }}></div>
            <div style={{ 
              width: '90%', 
              height: '1px', 
              background: secondaryColor, 
              marginBottom: '12px',
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '6px', 
              backgroundColor: '#222244', 
              marginBottom: '15px',
              border: `1px solid ${secondaryColor}`
            }}></div>
            <div style={{ 
              backgroundColor: 'transparent',
              border: `1px solid ${primaryColor}`,
              padding: '3px 10px',
              display: 'inline-block',
              clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0% 100%)',
              color: primaryColor
            }}>
              <div style={{ width: '40px', height: '15px' }}></div>
            </div>
          </div>
        );
        
      case 'neumorphism':
        return (
          <div className="style-preview-neumorphism" style={{ 
            backgroundColor: '#e0e5ec',
            borderRadius: '20px',
            padding: '15px',
            boxShadow: `8px 8px 15px #a3b1c6, -8px -8px 15px #ffffff`
          }}>
            <div style={{ 
              width: '60%', 
              height: '12px', 
              backgroundColor: primaryColor, 
              marginBottom: '15px',
              borderRadius: '6px'
            }}></div>
            <div style={{ 
              width: '80%', 
              height: '6px', 
              backgroundColor: '#e0e5ec', 
              marginBottom: '10px',
              borderRadius: '3px',
              boxShadow: 'inset 2px 2px 5px #a3b1c6, inset -2px -2px 5px #ffffff'
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '6px', 
              backgroundColor: '#e0e5ec', 
              marginBottom: '15px',
              borderRadius: '3px',
              boxShadow: 'inset 2px 2px 5px #a3b1c6, inset -2px -2px 5px #ffffff'
            }}></div>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              backgroundColor: '#e0e5ec',
              borderRadius: '50%',
              boxShadow: `5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff`,
              display: 'inline-block'
            }}></div>
          </div>
        );
        
      case 'gradient':
        return (
          <div className="style-preview-gradient" style={{ 
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
            borderRadius: '12px',
            padding: '15px',
            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              width: '60%', 
              height: '12px', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '15px',
              borderRadius: '6px'
            }}></div>
            <div style={{ 
              width: '80%', 
              height: '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              marginBottom: '10px',
              borderRadius: '3px'
            }}></div>
            <div style={{ 
              width: '60%', 
              height: '6px', 
              backgroundColor: 'rgba(255, 255, 255, 0.5)', 
              marginBottom: '15px',
              borderRadius: '3px'
            }}></div>
            <div style={{ 
              display: 'inline-block',
              paddingLeft: '15px',
              paddingRight: '15px',
              paddingTop: '5px',
              paddingBottom: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
            }}></div>
          </div>
        );
        
      default:
        return (
          <div className="style-preview-default" style={{ 
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '15px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ width: '50%', height: '10px', backgroundColor: primaryColor, marginBottom: '15px' }}></div>
            <div style={{ width: '80%', height: '6px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
            <div style={{ width: '60%', height: '6px', backgroundColor: '#e0e0e0', marginBottom: '15px' }}></div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: primaryColor }}></div>
              <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: secondaryColor }}></div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="style-preview">
      {getStylePreview()}
    </div>
  );
};

export default StylePreview; 