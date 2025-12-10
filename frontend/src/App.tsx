import React, { useState, useRef, useEffect } from 'react'
import SplatViewerR3F from './components/SplatViewerR3F'
import './App.css'

function App() {
  const [url, setUrl] = useState<string>(
    'https://sparkjs.dev/assets/splats/butterfly.spz'
  )
  const [inputUrl, setInputUrl] = useState<string>(url)
  const [file, setFile] = useState<File | null>(null)
  const [fileUrl, setFileUrl] = useState<string>(url)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLoad = () => {
    if (inputUrl.trim()) {
      setUrl(inputUrl.trim())
      setFile(null) // ファイル選択をクリア
      setFileUrl(inputUrl.trim())
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // .spz または .ply ファイルか確認
      if (selectedFile.name.endsWith('.spz') || selectedFile.name.endsWith('.ply')) {
        setFile(selectedFile)
        setUrl('') // URL入力をクリア
        setInputUrl('')
        // ObjectURLを作成
        const objectUrl = URL.createObjectURL(selectedFile)
        setFileUrl(objectUrl)
      } else {
        alert('SPZまたはPLYファイルを選択してください。')
      }
    }
  }

  const handleFileButtonClick = () => {
    fileInputRef.current?.click()
  }

  // ファイルが変更されたときにObjectURLをクリーンアップ
  useEffect(() => {
    return () => {
      if (fileUrl && fileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl])

  return (
    <div className="app">
      <div className="controls">
        <div className="input-group">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="SPZファイルのURLを入力"
            className="url-input"
          />
          <button onClick={handleLoad} className="load-button">
            URLから読み込む
          </button>
        </div>
        <div className="file-group">
          <input
            ref={fileInputRef}
            type="file"
            accept=".spz,.ply"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button onClick={handleFileButtonClick} className="file-button">
            ファイルを選択
          </button>
          {file && (
            <span className="file-name">{file.name}</span>
          )}
        </div>
      </div>
      <SplatViewerR3F url={fileUrl} />
    </div>
  )
}

export default App

