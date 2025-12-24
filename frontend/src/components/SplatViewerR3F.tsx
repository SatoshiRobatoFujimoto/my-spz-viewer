import { useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { TrackballControls } from '@react-three/drei'
import * as THREE from 'three'

// Spark の型定義（必要に応じて調整）
declare module '@sparkjsdev/spark' {
  export class SplatMesh extends THREE.Object3D {
    constructor(options: { url: string })
  }
  export class SparkRenderer extends THREE.Object3D {
    constructor(options: { renderer: THREE.WebGLRenderer })
  }
}

// Three.jsのグローバルインスタンスを設定（複数インスタンス警告を防ぐ）
if (typeof window !== 'undefined' && !(window as any).THREE) {
  (window as any).THREE = THREE
}

function SparkScene({ url }: { url: string }) {
  const { scene, gl, camera } = useThree()
  const splatMeshRef = useRef<THREE.Object3D | null>(null)
  const sparkRendererRef = useRef<any>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadSplat = async () => {
      try {
        // Three.jsインスタンスをSparkに渡すためにグローバルに設定
        if (typeof window !== 'undefined') {
          (window as any).THREE = THREE
          
          // Matrix2の存在確認（デバッグ用）
          if (!(window as any).THREE.Matrix2) {
            console.warn('THREE.Matrix2 is not available in Three.js version', THREE.REVISION)
          }
        }

        // @sparkjsdev/spark を動的にインポート
        const sparkModule = await import('@sparkjsdev/spark')
        
        // SparkがThree.jsをグローバルから取得するように設定
        if (typeof window !== 'undefined' && sparkModule) {
          // SparkモジュールにThree.jsを注入（可能な場合）
          if ((sparkModule as any).setTHREE) {
            (sparkModule as any).setTHREE(THREE)
          }
        }
        
        const { SplatMesh, SparkRenderer } = sparkModule

        if (!mounted) return

        // 既存のオブジェクトをクリーンアップ
        if (splatMeshRef.current) {
          scene.remove(splatMeshRef.current)
          // リソースのクリーンアップ
          if ((splatMeshRef.current as any).dispose) {
            (splatMeshRef.current as any).dispose()
          }
          splatMeshRef.current = null
        }
        if (sparkRendererRef.current) {
          scene.remove(sparkRendererRef.current)
          if ((sparkRendererRef.current as any).dispose) {
            (sparkRendererRef.current as any).dispose()
          }
          sparkRendererRef.current = null
        }

        // SparkRenderer を作成（レンダラーを設定）
        // 注意: SparkがThree.jsの特定のバージョンを期待している可能性がある
        const sparkRenderer = new SparkRenderer({ renderer: gl })
        scene.add(sparkRenderer)
        sparkRendererRef.current = sparkRenderer

        // SplatMesh を作成してURLからロード
        const splatMesh = new SplatMesh({ url })
        splatMesh.position.set(0, 0, 0)
        scene.add(splatMesh)
        splatMeshRef.current = splatMesh

        // カメラを適切な位置に設定
        camera.position.set(0, 0.5, 2)
        camera.lookAt(0, 0, 0)
      } catch (error) {
        console.error('SPZファイルの読み込みに失敗しました:', error)
        console.error('エラー詳細:', error instanceof Error ? error.stack : error)
        console.error('Three.js version:', THREE.REVISION)
        console.error('THREE.Matrix2 available:', typeof (THREE as any).Matrix2 !== 'undefined')
        console.error('THREE object keys:', Object.keys(THREE).filter(k => k.includes('Matrix')))
      }
    }

    loadSplat()

    return () => {
      mounted = false
      if (splatMeshRef.current) {
        scene.remove(splatMeshRef.current)
        if ((splatMeshRef.current as any).dispose) {
          (splatMeshRef.current as any).dispose()
        }
      }
      if (sparkRendererRef.current) {
        scene.remove(sparkRendererRef.current)
        if ((sparkRendererRef.current as any).dispose) {
          (sparkRendererRef.current as any).dispose()
        }
      }
      // ObjectURLのクリーンアップ
      if (objectUrlRef.current && objectUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [scene, gl, camera, url])

  return null
}

function ControlsSetup() {
  return (
    <TrackballControls
      rotateSpeed={3.0}
      zoomSpeed={1.2}
      panSpeed={0.8}
    />
  )
}

export default function SplatViewerR3F({ url }: { url: string }) {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0.5, 2], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <SparkScene url={url} />
        <ControlsSetup />
      </Canvas>
    </div>
  )
}

