import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='App'>
      <div className='App-container'>
        <App />
      </div>
    </div>
  </StrictMode>,
)
