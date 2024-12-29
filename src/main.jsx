import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Wrap the render in a try-catch to catch any initialization errors
try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (error) {
  console.error('Error rendering application:', error);
  // Display a basic error message
  document.body.innerHTML = `
    <div style="
      display: flex;
      height: 100vh;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-family: sans-serif;
    ">
      <div>
        <h1 style="color: #ef4444;">Une erreur est survenue</h1>
        <p style="color: #666;">Impossible de charger l'application</p>
      </div>
    </div>
  `;
}
