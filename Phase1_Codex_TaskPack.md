# Phase 1｜卡拉 OK 音準圖 Demo（MVP）— 播放控制任務包（給 Codex 用）

> 專案：`karaoke-pitch`（Vite + React + TypeScript）  
> 本階段目標：把「上傳 → 可播放 → 可控制 → 主時間軸」完成。  
> 嚴格要求：TypeScript strict、ESLint type-aware、**禁止 `any`**。

---

## 1) Phase 1 要做的事

### 要做（Phase 1）
- 在 `PlayPage` 接上 `<audio>`（或 `<video>`）播放上傳檔案（ObjectURL）
- 播放控制按鈕可用：播放 / 暫停 / 停止 / 重播
- 顯示播放時間：`目前時間 / 總時長`
- 進度條（seek）：可拖曳跳轉
- 建立「主時間軸」：以 `mediaRef.currentTime` 當唯一時間來源（之後 Phase 2/3/4 都靠它同步）
- 處理常見狀態：未選檔、載入中、可播放、播放中、暫停、結束、播放錯誤

### 不做（Phase 1 不處理）
- 麥克風權限 / 即時音高（Phase 2）
- Canvas 畫音準線（Phase 3/4）
- 參考音準線分析（Phase 4）
- IndexedDB（Phase 6）

---

## 2) Done 標準（驗收）

完成 Phase 1 的標準：
1. 選擇 MP3/MP4 後，可播放音訊（至少 MP3 必須可播放；MP4 以可播放音訊為目標）
2. 播放/暫停/停止/重播按鈕可用且行為正確
3. 顯示 `mm:ss / mm:ss`
4. 進度條可拖曳跳轉
5. `pnpm dev` / `pnpm lint` / `pnpm typecheck` 全部通過

---

## 3) 建議型別（可放在 src/shared/types/ui.ts 或 PlayPage 內）

可選新增（若你想更清楚的狀態管理）：
- `PlaybackState = "idle" | "ready" | "playing" | "paused" | "ended" | "error"`

> 如果你覺得改動太多，也可以先把狀態放在 `PlayPage` 的 local state 內。

---

## 4) Codex 通用前綴 Prompt（每次貼在最前面）

```text
你正在一個 Vite + React + TypeScript 的 Web 專案（karaoke-pitch）中工作，目標是做「卡拉 OK 音準圖 Demo（MVP）」。
要求：
- 全部使用繁體中文（含註解、README、訊息）
- TypeScript strict，禁止使用 any（包含隱性 any）
- ESLint 使用 @typescript-eslint（type-aware），pnpm lint 與 pnpm typecheck 必須通過
- 以最小可行的方式完成需求，不要引入重量級框架
- 需要新增的檔案請完整給出內容；需要修改的檔案請提供清楚的改動點或完整檔案內容
- Phase 1 只做播放控制，不做麥克風與音準偵測
```

---

## 5) Codex 任務包（Phase 1）

### 任務 1-1：在 PlayPage 接上 Audio 播放 + 控制按鈕
**Goal**
- 有檔案時可播放；控制按鈕可用；狀態正確更新。

**Scope**
- 修改 `src/app/pages/PlayPage.tsx`
-（可選）微調 `src/styles/app.css`

**實作規格**
- 新增 `mediaRef = useRef<HTMLAudioElement | null>(null)`
- 畫面加入 `<audio ref={mediaRef} src={uploadedMedia?.objectUrl ?? ""} />`
  - 建議：隱藏原生 controls（用你的按鈕控制），但保留 element 在 DOM
- 監聽事件：
  - `onLoadedMetadata`：取得 `duration`（秒）→ 存成 `durationMs`
  - `onTimeUpdate`：更新 `currentTimeMs`
  - `onPlay` / `onPause` / `onEnded`：更新 `playbackState`
  - `onError`：顯示錯誤訊息（例如「此檔案無法播放」）
- 按鈕行為（都要 type-safe）：
  - 播放：`await media.play()`（注意 play 可能 throw，需 try/catch）
  - 暫停：`media.pause()`
  - 停止：`media.pause(); media.currentTime = 0`
  - 重播：`media.currentTime = 0; await media.play()`
- enable/disable 規則（建議）：
  - 未選檔：全部 disabled
  - ready/paused/ended：播放 enabled
  - playing：暫停、停止 enabled；播放 disabled（或顯示不同狀態）

**Prompt（貼給 Codex）**
```text
請執行 Phase 1-1：在 src/app/pages/PlayPage.tsx 接上音訊播放與控制按鈕。
需求：
1) 使用 HTMLAudioElement（<audio>）播放上傳檔案的 ObjectURL
2) 加入 playbackState、currentTimeMs、durationMs、errorMessage 等 state（型別要嚴格，禁止 any）
3) 播放/暫停/停止/重播按鈕改為可用（依狀態 disabled）
4) 監聽 onLoadedMetadata / onTimeUpdate / onPlay / onPause / onEnded / onError 來更新狀態
5) play() 需 try/catch（避免瀏覽器阻擋或播放失敗造成未處理例外）
6) 狀態區更新為 Phase 1（顯示：是否可播放、播放狀態、目前時間、總時長）
7) 確保 pnpm lint 與 pnpm typecheck 通過

請輸出你修改的檔案完整內容，以及你驗證用的指令與結果（pnpm dev / lint / typecheck）。
```

---

### 任務 1-2：加入時間顯示 + Seek 進度條（主時間軸）
**Goal**
- 顯示 `mm:ss / mm:ss`，可拖曳 seek；主時間軸以 `media.currentTime` 為準。

**Scope**
- 修改 `src/app/pages/PlayPage.tsx`
- 修改 `src/styles/app.css`（加入進度條排版）
-（可選）新增 `src/shared/time.ts` 放格式化函式

**實作規格**
- 時間格式化：
  - 輸入 `ms: number` → 輸出 `"mm:ss"`（至少到 99:59 也能正常）
- Seek：
  - 使用 `<input type="range">`
  - `min=0`、`max=durationMs`、`value=currentTimeMs`
  - onChange：把 slider 值轉成 ms → 設定 `media.currentTime = valueMs / 1000`
  - durationMs = 0 時，range disabled

**Prompt（貼給 Codex）**
```text
請執行 Phase 1-2：在 PlayPage 加入時間顯示與 Seek 進度條。
需求：
1) 顯示目前時間與總時長（格式 mm:ss）
2) 加入進度條 slider，可拖曳跳轉
3) 主時間軸以 mediaRef.current.currentTime 為準（以 ms 顯示）
4) durationMs = 0 或尚未載入時，進度條 disabled
5) 需要的 CSS 請加在 src/styles/app.css（區塊分明、可讀性好）
6) 確保 pnpm lint 與 pnpm typecheck 通過

請輸出你修改/新增的檔案完整內容，以及 pnpm dev / lint / typecheck 的結果。
```

---

## 6) 常見坑（提醒 Codex 避免踩）
- `audio.play()` 可能因瀏覽器政策 throw（需 try/catch）
- 切換檔案時要重置狀態（currentTimeMs、durationMs、playbackState、errorMessage）
- `onLoadedMetadata` 才能拿到 duration；不要在未載入就用 duration
- `input[type="range"]` 的 value 是字串，需用 `Number()` 並做 NaN 防護

---

## 7) Phase 1 完成後預告（Phase 2）
Phase 2 會做：
- 麥克風 `getUserMedia`
- AudioWorklet 即時音高偵測
- 畫面顯示即時 Hz（先不畫線）
