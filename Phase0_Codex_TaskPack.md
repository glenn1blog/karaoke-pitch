# Phase 0 ｜卡拉 OK 音準圖 Demo（MVP）— 專案骨架任務包（給 Codex 用）

> 專案定位：純 Web（React + TypeScript + Vite），先上 itch.io（HTML5）。  
> 本階段目標：**把專案骨架與 PlayPage 畫面先跑起來**（先不做音訊分析／麥克風／Canvas 畫線）。  
> 嚴格要求：TypeScript strict、ESLint 嚴格、**禁止 `any`**。

---

## 0. 需求對齊（本階段要做到什麼）

### 要做（Phase 0）

-   建立 Vite + React + TypeScript 專案
-   設定 TypeScript strict（並開啟幾個更安全的檢查）
-   設定 ESLint（@typescript-eslint）並確保 `npm run lint` / `pnpm lint` 可過
-   建立最小 UI 骨架頁面 `PlayPage`（畫面先長出來）：
    -   檔案上傳（MP3/MP4）按鈕（先不解析）
    -   播放控制區（先放按鈕 placeholder）
    -   麥克風區（先放「開始麥克風」按鈕 placeholder）
    -   Canvas 區（先顯示一塊固定高度的畫布 placeholder）
    -   狀態文字區（顯示：是否已選檔、檔名、是否 ready）

### 不做（Phase 0 不處理）

-   音訊播放與 seek（這是 Phase 1）
-   麥克風權限與即時音高（Phase 2）
-   參考音準線（Phase 4）
-   IndexedDB（Phase 6）

---

## 1. Done 標準（驗收）

完成 Phase 0 的標準：

1. `pnpm dev`（或 `npm run dev`）可啟動，頁面可正常開啟
2. `pnpm lint`（或 `npm run lint`）可通過
3. `pnpm typecheck`（或 `npm run typecheck`）可通過
4. PlayPage 可看到 UI 骨架（上傳、控制列、Canvas 區、狀態文字）

---

## 2. 建議專案命名與路徑

-   專案名稱（建議）：`karaoke-pitch`
-   Node：建議 18+ 或 20+
-   套件管理：建議 pnpm（也可 npm）

---

## 3. 目錄結構（Phase 0 先建立）

```
src/
  app/
    App.tsx
    pages/
      PlayPage.tsx
  shared/
    types/
      ui.ts
  styles/
    app.css
  main.tsx
index.html
```

---

## 4. 型別草案（Phase 0 先放，避免 any）

> 先放 UI 會用到的狀態型別，後續 Phase 1~5 再擴充。

`src/shared/types/ui.ts`

-   `UploadFileType = "mp3" | "mp4" | "unknown"`
-   `UploadedMedia`
    -   `file: File`
    -   `objectUrl: string`
    -   `fileType: UploadFileType`
    -   `fileName: string`

---

## 5. NPM Scripts（Phase 0 要有）

`package.json` scripts（至少）：

-   `dev`
-   `build`
-   `preview`
-   `lint`
-   `typecheck`（建議：`tsc -p tsconfig.json --noEmit`）

---

## 6. Codex 通用前綴 Prompt（每次貼在最前面）

> 你接下來會把下方「任務 Prompt」貼給 Codex。每次貼任務前，先貼這段。

```text
你正在一個 Vite + React + TypeScript 的 Web 專案中工作，目標是做一個「卡拉 OK 音準圖 Demo（MVP）」。
要求：
- 全部使用繁體中文（含註解、README、訊息）
- TypeScript strict，禁止使用 any（包含隱性 any）
- ESLint 使用 @typescript-eslint，lint 與 typecheck 必須通過
- 檔案需模組化、命名清楚
- 需要新增的檔案請完整給出內容；需要修改的檔案請說明改動點（或直接給完整檔案內容）
- 不要引入重量級 UI 框架；Phase 0 先用原生 HTML/CSS 或最簡單的 CSS

請先按照任務需求產出可執行成果，避免留 TODO 造成無法編譯或無法 lint。
```

---

## 7. Codex 任務包（Phase 0）

### 任務 0-1：建立專案骨架（Vite React TS）

**Goal**

-   初始化 `karaoke-pitch` 專案（Vite + React + TS），可啟動 dev server。

**Scope**

-   建立專案、安裝依賴、確認 `dev/build/preview` 可用。

**Prompt（貼給 Codex）**

```text
請用 Vite 建立一個 React + TypeScript 專案，專案名稱 karaoke-pitch。
需求：
1) 建好後可執行 dev server
2) 保留預設的基本結構即可
3) 請提供我在 Windows / PowerShell 可直接執行的指令（含進入目錄、安裝依賴、啟動）
```

---

### 任務 0-2：設定 TypeScript strict + typecheck script

**Goal**

-   強化 TS 設定，並加入 `typecheck` script。

**Scope**

-   修改 `tsconfig*.json`（若 Vite 產生多個 tsconfig，依 Vite 模板調整）
-   `package.json` 加入 `typecheck`

**Prompt（貼給 Codex）**

```text
請在現有 Vite + React + TS 專案中：
1) 開啟 TypeScript strict
2) 額外啟用更安全的設定（例如 noUncheckedIndexedAccess、exactOptionalPropertyTypes 若不會造成大量衝突）
3) 在 package.json 新增 typecheck script：tsc --noEmit（需指向正確的 tsconfig）
4) 確保 typecheck 可通過

請列出你改了哪些檔案，以及每個檔案的完整內容。
```

---

### 任務 0-3：設定 ESLint（@typescript-eslint，禁 any）並加入 lint script

**Goal**

-   建立 ESLint 設定，確保 TS/React 專案 lint 通過，並明確禁止 `any`。

**Scope**

-   新增/調整 `.eslintrc.*` 或 `eslint.config.*`（依專案模板）
-   加入必要 plugin：`@typescript-eslint`、`react-hooks`、`react-refresh`（若使用 Vite）
-   設定規則：禁止 `any`（`@typescript-eslint/no-explicit-any: "error"`）、避免 unsafe 規則常見坑

**Prompt（貼給 Codex）**

```text
請為此 Vite + React + TS 專案加入 ESLint（使用 @typescript-eslint）。
需求：
1) npm/pnpm lint 可執行
2) 明確禁止 any：@typescript-eslint/no-explicit-any 必須是 error
3) React hooks 規則要啟用
4) 盡量符合 typescript-eslint 的推薦規則（recommended / recommended-type-checked 若可行）
5) 確保 lint 可以通過

請輸出需要新增/修改的檔案完整內容與安裝指令。
```

---

### 任務 0-4：建立 PlayPage UI 骨架（不上音訊、不上麥克風）

**Goal**

-   建立 `PlayPage.tsx`，畫面先長出來（上傳、控制列、Canvas 區、狀態文字）。

**Scope**

-   新增 `src/app/pages/PlayPage.tsx`
-   `src/app/App.tsx` 顯示 PlayPage
-   `src/styles/app.css` 做最小排版（不要依賴 UI 框架）
-   型別：新增 `src/shared/types/ui.ts`（UploadedMedia 等）

**UI 規格（Phase 0）**

-   上方：標題（例如「卡拉 OK 音準圖 Demo」）
-   區塊 1：上傳檔案（accept mp3/mp4），顯示檔名
-   區塊 2：播放控制（按鈕 placeholder：播放/暫停/停止/重播，先 disabled）
-   區塊 3：麥克風控制（按鈕 placeholder：開始麥克風，先 disabled 或顯示「Phase 2」）
-   區塊 4：Canvas 區（例如高度 240px，背景深/淺皆可，先畫文字「Pitch Graph Placeholder」）
-   區塊 5：狀態資訊（是否已選檔、是否 ready、目前階段）

**Prompt（貼給 Codex）**

```text
請建立 Phase 0 的 PlayPage UI 骨架（不做音訊、不做麥克風、不做 Canvas 畫線）。
需求：
1) 使用 React + TypeScript，禁止 any
2) 新增 src/shared/types/ui.ts 定義 UploadedMedia 等型別
3) PlayPage 上要有：上傳區、播放控制 placeholder、麥克風控制 placeholder、Canvas placeholder、狀態文字
4) App.tsx 要渲染 PlayPage
5) 需要基本 CSS（src/styles/app.css）讓畫面清楚、區塊分明
6) 確保 lint/typecheck 都通過

請給出你新增/修改的每個檔案完整內容。
```

---

## 8. 建議的 Commit（可選）

-   `chore: 初始化 Vite React TS 專案骨架`
-   `chore: 啟用 TS strict 與 typecheck`
-   `chore: 加入 ESLint（禁 any）`
-   `feat: 建立 PlayPage UI 骨架`

---

## 9. Phase 0 完成後下一步（預告）

Phase 1 會做：

-   上傳檔案後建立 ObjectURL
-   `<audio>` 播放/暫停/停止/seek
-   定義「主時間軸」：以 audio.currentTime 作為唯一時鐘
