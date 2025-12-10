import React from 'react'
import ReactDOM from 'react-dom/client'
import * as THREE from 'three'
import App from './App.tsx'
import './index.css'

// Three.jsのグローバルインスタンスを設定（Sparkとの互換性のため）
if (typeof window !== 'undefined') {
  (window as any).THREE = THREE
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

