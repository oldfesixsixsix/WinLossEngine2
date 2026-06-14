# DUEL WIN/LOSS TRACKER (WinLossEngine2)

致敬《洛克人X4》選單風格的極簡霓虹像素風輸贏紀錄 App。

## 🚀 快速開始 (Docker)

### 1. 準備環境
建立必要的資料夾並設定環境變數：
```bash
mkdir -p data
cp .env.example .env
```

### 2. 啟動服務
```bash
docker-compose up --build -d
```
服務將運行在 `http://localhost:3000`。

---

## 📁 數據與檔案架構 (Data Management)

專案使用 Docker 進行部署，核心邏輯如下：

### Docker 映射關係
在 `docker-compose.yml` 中：
- `./data:/app/data`: **持久化數據區**。存放 JSON 資料庫（紀錄、設定）以及使用者上傳的檔案。
- `defaults`: **系統預設資源區**。內建於 Docker 鏡像中，存放預設的圖片與音效。

### 預設路徑抓取邏輯 (Fallback Mechanism)
系統會自動判斷資源來源：
1. **優先**：檢查 `/app/data/assets` (對應主機的 `./data/assets`) 是否有使用者自定義上傳的檔案。
2. **備援**：若無上傳檔案，自動抓取 `/app/defaults/` (鏡像內建) 的資源。

**如果 `defaults` 也沒放東西會發生什麼？**
- 系統會嘗試在 `/defaults/` 下尋找對應檔案，若找不到，前端將顯示破圖或靜音。
- 程式碼內建基本的 `Audio` 錯誤處理，會嘗試切換到合成音效（Beep音）作為最後防線。

---

## 🔑 Supabase 驗證配置

本專案支援 Supabase Auth (Google/Github 登入)，配置方式如下：

### 本地開發 (Local Dev)
1. 在 `.env` 檔案中填寫：
   - `VITE_SUPABASE_URL`: 您的 Supabase 專案 URL。
   - `VITE_SUPABASE_ANON_KEY`: 您的 Anon Public Key。
2. 啟動 `npm run dev` 後，Vite 會自動讀取並開啟登入介面。

### 上雲部署 (Cloud Run / Production)
由於生產環境是動態讀取，請在 Cloud Run 設定以下環境變數：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_JWT_SECRET`: (強烈建議) 用於後端驗證 Token 安全性。

**生效原理：**
前端會先檢查 Vite 硬編碼變數，若無（如 Docker Build 時），會向後端 `/api/config` 接口動態請求 Cloud Run 上的變數。這確保了您不需要在 Docker 建置時暴露金鑰。

---

## 🛠️ 開發指令
- `npm run dev`: 啟動開發伺服器（含 Vite HMR）。
- `npm run build`: 建置前端靜態檔案並打包後端 Server。
- `npm run start`: 執行編譯後的生產環境服務。

---

## 📝 授權
MIT License.
