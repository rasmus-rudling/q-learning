import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import EnvironmentProvider from './context/environmentContext.js'
import QLearningContext from './context/qLearningContext.js'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <EnvironmentProvider>
        <QLearningContext>
          <App />
        </QLearningContext>
      </EnvironmentProvider>
    </React.StrictMode>,
  )
} else {
  console.error('Root element not found')
}
