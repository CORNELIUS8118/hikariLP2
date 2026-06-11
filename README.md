# 光回線「まるっと10ヶ月」無料キャンペーン LP

Next.js + Google Apps Script + Google Sheets による、無料で運用できる申込LP。

---

## 機能

- 事前申込フォーム（18項目）
- 申込意思による分岐（A → LINE表示、D → 非表示）
- Google Sheetsへの自動保存
- 流入元管理（`?ref=xxx`）
- LINEボタンクリック追跡
- LINE URLはサーバーサイドのみ管理（JSバンドルに含まれない）

---

## 環境変数

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `GAS_URL` | ✓ | Google Apps Script Web App URL |
| `LINE_URL` | ✓ | 公式LINE URL（サーバーサイドのみ） |
| `NEXT_PUBLIC_CAMPAIGN_NAME` | | サイトタイトル（省略時はデフォルト値） |

---

## セットアップ手順

### 1. インストール

```bash
cd hikariLP2
npm install
```

### 2. Google スプレッドシートの準備

1. [Google スプレッドシート](https://sheets.google.com) で新しいシートを作成
2. URLから **シートID** をコピー
   - 例: `https://docs.google.com/spreadsheets/d/【ここがID】/edit`

### 3. Google Apps Script の設定

1. [Google Apps Script](https://script.google.com/) を開く
2. 「新しいプロジェクト」を作成
3. `gas/Code.gs` の内容をエディタに**全選択して貼り付け**
4. **スクリプトプロパティを設定**
   - 左メニュー「プロジェクトの設定」→「スクリプトプロパティ」
   - プロパティ名: `SHEET_ID`
   - 値: 手順2でコピーしたスプレッドシートID
5. 「デプロイ」→「新しいデプロイ」
6. 種類: **ウェブアプリ**
7. 次のユーザーとして実行: **自分**
8. アクセスできるユーザー: **全員**
9. 「デプロイ」ボタンを押してURLをコピー（これが `GAS_URL`）

> **注意**: 初回デプロイ時に「承認が必要」と表示されます。「アクセスを承認」→ Googleアカウントを選択 → 「詳細」→「安全ではないページに移動」→「許可」

### 4. ローカル環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local` を開いて以下を設定：

```
GAS_URL=（手順3でコピーしたGAS URL）
LINE_URL=（公式LINEのURL）
```

### 5. ローカル動作確認

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く。

---

## Vercel デプロイ手順

### 方法A: GitHub経由（推奨）

1. このプロジェクトをGitHubにpush
2. [Vercel](https://vercel.com) でリポジトリをインポート
3. 「Environment Variables」に以下を登録：
   - `GAS_URL`
   - `LINE_URL`
   - `NEXT_PUBLIC_CAMPAIGN_NAME`（任意）
4. 「Deploy」ボタンを押す

### 方法B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel env add GAS_URL
vercel env add LINE_URL
vercel --prod
```

---

## 流入元管理

URLに `?ref=` パラメータを付与することで流入元をスプレッドシートに記録できます。

| URL例 | 用途 |
|-------|------|
| `https://your-domain.vercel.app/?ref=pop001` | POPからの流入 |
| `https://your-domain.vercel.app/?ref=instagram` | Instagramからの流入 |
| `https://your-domain.vercel.app/?ref=bni` | BNIからの流入 |
| `https://your-domain.vercel.app/?ref=murakami` | 担当者別管理 |

---

## スプレッドシートの列構成

> **既存シートへの自動対応**
> GASは送信のたびにヘッダー行を確認し、不足している列があれば末尾に自動追加します。
> 既存データは削除されません。列への書き込みはヘッダー名で照合するため、列順が変わっても正しい列に保存されます。
> 新規シートの場合は下表の順序でヘッダーが自動作成されます。

| 列 | 項目 | 備考 |
|----|------|------|
| A | 送信日時 | JST |
| B | submission_id | UUIDv4（LINEクリック追跡用・内部管理） |
| C | 名前（漢字） | |
| D | 名前（フリガナ） | |
| E | 生年月日 | |
| F | 携帯番号 | |
| G | メールアドレス | |
| H | 郵便番号 | 例：810-0000 |
| I | 住所 | 都道府県・市区町村・番地 |
| J | 建物名（部屋番号） | 建物名・部屋番号。なし可 |
| K | 住居区分 | 持ち家 / 賃貸 |
| L | 屋号名・事業所名 | |
| M | 銀行名 | |
| N | 支店名 | |
| O | 口座番号 | |
| P | 口座名義（カナ） | |
| Q | 申込意思 | 「今すぐ申し込みしたい」または「考えたい」 |
| R | LINE表示有無 | あり / なし |
| S | LINEクリック有無 | あり / なし（ボタン押下時に更新） |
| T | 流入元ref | URLの?ref=の値 |
| U | UserAgent | |
| V | FAQ確認済み | 確認済み / 未確認 |
| W | FAQ確認日時 | ISO 8601形式 |
| X | FAQ確認数 | 例：9/9 |
| Y | 紹介者 | 必須 |

---

## 申込意思の分岐ロジック

```
A（今すぐ申し込みしたい） → Page2（LINEボタン表示）
D（考えたい）            → 送信完了（LINE非表示）
```

**LINE URLは D ユーザーには一切送信されません**（サーバーAPIでフィルタリング）。  
`LINE_URL` は `NEXT_PUBLIC_` なしのサーバー専用環境変数のため、クライアントのJSバンドルにも含まれません。

---

## GASを更新した場合

コードを変更した際は**必ず新バージョンとしてデプロイ**してください。

「デプロイ」→「デプロイを管理」→「編集（鉛筆アイコン）」→「バージョン: 新しいバージョン」→「デプロイ」
