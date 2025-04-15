import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const bgColor = darkMode ? '#121212' : '#f4f4f4';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const cardColor = darkMode ? '#1e1e1e' : '#ffffff';
  const borderColor = darkMode ? '#333' : '#ccc';

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setImageURL(null);
    setHtmlContent(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/run',
        { language, code },
        { responseType: 'blob' }
      );

      const contentType = response.headers['content-type'];

      if (contentType.startsWith('image/png')) {
        const blob = new Blob([response.data], { type: contentType });
        setImageURL(URL.createObjectURL(blob));
      } else if (contentType.startsWith('text/html')) {
        const reader = new FileReader();
        reader.onload = () => setHtmlContent(reader.result);
        reader.readAsText(response.data);
      } else {
        setError("Unsupported response type.");
      }
    } catch (err) {
      setError('Execution failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: bgColor, color: textColor, minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>📊 Multi-Language Visualization Tool</h2>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: darkMode ? '#444' : '#ddd',
              color: darkMode ? '#fff' : '#000',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: '0.9rem' }}>
            Language:
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                marginLeft: '0.5rem',
                padding: '0.4rem',
                borderRadius: '4px',
                border: `1px solid ${borderColor}`,
                backgroundColor: cardColor,
                color: textColor
              }}
            >
              <option value="python">Python</option>
              <option value="r">R</option>
            </select>
          </label>

          <textarea
            rows="12"
            placeholder="Write Python or R code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              backgroundColor: cardColor,
              color: textColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
              resize: 'none'
            }}
          />

          <button
            onClick={handleRun}
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1.4rem',
              backgroundColor: '#007acc',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>

        {/* Output Section */}
        {imageURL && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>🖼️ Static Visualization</h3>
            <img
              src={imageURL}
              alt="Generated Plot"
              style={{
                width: '100%',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px'
              }}
            />
          </div>
        )}

        {htmlContent && (
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>🌐 Interactive Visualization</h3>
            <iframe
              title="plotly-output"
              srcDoc={htmlContent}
              sandbox="allow-scripts"
              style={{
                width: '100%',
                height: '500px',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                backgroundColor: '#fff'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
