import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import TimeTrackingForm from './time.tsx'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <TimeTrackingForm />
  </React.StrictMode>,
)
