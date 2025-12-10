# my-spz-viewer

SPZ（3D Gaussian Splatting）ファイルをブラウザ上で表示するためのWebアプリケーションです。

## 仕様

### 機能

- **SPZファイルの表示**: SPZ形式の3D Gaussian Splattingファイルを高速にレンダリング
- **URLからの読み込み**: インターネット上のSPZファイルのURLを指定して読み込み
- **ローカルファイルからの読み込み**: ローカルに保存されたSPZ/PLYファイルを選択して読み込み
- **3D操作**: マウスでカメラを回転・ズーム・パン操作が可能
- **高速レンダリング**: SparkライブラリとWASMを使用した高速なレンダリング

### 対応ファイル形式

- `.spz` (SPZ形式)
- `.ply` (PLY形式)

### 技術スタック

- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite 5
- **3Dライブラリ**: Three.js 0.175.0
- **React Three Fiber**: @react-three/fiber 8.15.11
- **スプラットレンダラー**: @sparkjsdev/spark 0.1.7

## 起動方法

### 前提条件

- Node.js 18以上
- npm または yarn

### セットアップ

1. 依存関係のインストール

```bash
cd frontend
npm install
```

2. 開発サーバーの起動

```bash
npm run dev
```

3. ブラウザでアクセス

開発サーバーが起動すると、自動的にブラウザが開きます。開かない場合は、以下のURLにアクセスしてください：

```
http://localhost:5173
```

### その他のコマンド

- **ビルド**: `npm run build` - 本番用のビルドを作成
- **プレビュー**: `npm run preview` - ビルドしたアプリケーションをプレビュー
- **リント**: `npm run lint` - コードのリントを実行

## フォルダ構成

```
my-spz-viewer/
├── README.md                    # このファイル
└── frontend/                    # フロントエンドアプリケーション
    ├── index.html              # HTMLエントリーポイント
    ├── package.json            # 依存関係とスクリプト
    ├── vite.config.ts          # Vite設定ファイル
    ├── tsconfig.json           # TypeScript設定
    ├── tsconfig.node.json      # Node.js用TypeScript設定
    ├── .eslintrc.cjs           # ESLint設定
    ├── .gitignore              # Git除外設定
    └── src/                    # ソースコード
        ├── main.tsx            # Reactエントリーポイント
        ├── App.tsx             # メインアプリケーションコンポーネント
        ├── App.css             # アプリケーションスタイル
        ├── index.css           # グローバルスタイル
        └── components/         # Reactコンポーネント
            └── SplatViewerR3F.tsx  # SPZビューアコンポーネント（React Three Fiber統合）
```

### 主要ファイルの説明

- **`frontend/src/App.tsx`**: メインアプリケーションコンポーネント。URL入力とファイル選択のUIを提供
- **`frontend/src/components/SplatViewerR3F.tsx`**: Sparkライブラリを使用してSPZファイルをレンダリングするコンポーネント
- **`frontend/vite.config.ts`**: Viteの設定。WASMファイルの処理やThree.jsのエイリアス設定を含む
- **`frontend/package.json`**: プロジェクトの依存関係とnpmスクリプトを定義

## 使用方法

### URLから読み込む

1. 画面上部のテキスト入力欄にSPZファイルのURLを入力
2. 「URLから読み込む」ボタンをクリック
3. ファイルが読み込まれ、3Dビューアに表示されます

### ローカルファイルから読み込む

1. 「ファイルを選択」ボタンをクリック
2. ローカルに保存された`.spz`または`.ply`ファイルを選択
3. ファイルが自動的に読み込まれ、3Dビューアに表示されます

### 3D操作

- **回転**: マウスの左ボタンをドラッグ
- **ズーム**: マウスホイールを回転
- **パン**: マウスの右ボタンをドラッグ（またはShift + 左ドラッグ）

## トラブルシューティング

### WASMファイルの読み込みエラー

WASMファイルの読み込みに失敗する場合、開発サーバーを再起動してください：

```bash
# 開発サーバーを停止（Ctrl+C）してから再起動
npm run dev
```

### Three.jsのバージョンエラー

`THREE.Matrix2 is not a constructor`エラーが発生する場合、依存関係を再インストールしてください：

```bash
rm -rf node_modules package-lock.json
npm install
```

### CORSエラー

外部URLからSPZファイルを読み込む場合、サーバー側でCORSが許可されている必要があります。ローカルファイルを使用する場合はこの問題は発生しません。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。