import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.log("✅ Content-Type received:", contentType);

      if (contentType.startsWith('image/png')) {
        const blob = new Blob([response.data], { type: contentType });
        setImageURL(URL.createObjectURL(blob));
        setHtmlContent(null);
      } else if (contentType.startsWith('text/html')) {
        const reader = new FileReader();
        reader.onload = () => setHtmlContent(reader.result);
        reader.readAsText(response.data);
        setImageURL(null);
      } else {
        console.warn("⚠️ Unexpected Content-Type:", contentType);
        setError("Unsupported response type.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError('Execution failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>📊 Language-Agnostic Visualization App</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="python">Python</option>
            <option value="r">R</option>
          </select>
        </label>
      </div>

      <textarea
        rows="10"
        cols="80"
        placeholder="Enter your visualization code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ fontFamily: 'monospace', padding: '1rem', width: '100%' }}
      />

      <div>
        <button onClick={handleRun} disabled={loading} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {imageURL && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Static Visualization</h3>
          <img src={imageURL} alt="Generated Visualization" style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
        </div>
      )}

      {htmlContent && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Interactive Visualization</h3>
          <iframe
            title="plotly-output"
            srcDoc={htmlContent}
            sandbox="allow-scripts"
            style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
