<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/5e3df3b0-76ce-428c-ac99-adff6aa29d28

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

   `npm run dev`


# cloudrun

打包（加上平台參數）
```bash
docker build --platform linux/amd64 -t asia-east1-docker.pkg.dev/your-project-name/my-repo/winlossengine2:latest .
```

推送到 GCP Artifact Registry
```bash
docker push asia-east1-docker.pkg.dev/your-project-name/my-repo/winlossengine2:latest
```

部署到 Cloud Run

```bash
部署到 Cloud Run
```bash
gcloud run deploy winlossengine2-service --image asia-east1-docker.pkg.dev/your-project-name/my-repo/winlossengine2:latest --platform managed --region asia-east1 --allow-unauthenticated
```
環境變數更新
```
gcloud run services update winlossengine2-service \
  --region asia-east1 \
  --set-env-vars VITE_SUPABASE_URL="https://xxx.supabase.co",VITE_SUPABASE_ANON_KEY="eyJhbGc...E6TS9OCg4tI"
```

## ERROR port 8080

```
                                                       
ERROR: (gcloud.run.services.update) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.
```


server.ts
```
const PORT = 3000; // 改成cloudrun容器預設埠號 8080 或是在容器設置中換埠號
app.listen(PORT, '0.0.0.0', () => {

console.log(`[X4 Retro Engine] running at http://localhost:${PORT}`);

});
```

改完後

打包（加上平台參數）

推送到 GCP Artifact Registry

部署到 Cloud Run

---

## 🛠️ 常見問題與技術補充 (Troubleshooting & Technical Supplements)

以下整理了關於 **Unclereal Login 插件** 與 **PWA (Progressive Web App) 快取** 的問題排查與解決方案說明：

### 1. Unclereal Login 登入與登出行為修正說明

#### ❓ 遇到的問題：
1. **點擊登出後返回仍是登入狀態：** 
   * **原因：** `unclereal-login` 插件在執行 `logout()` 時，僅將頁面重導向（Redirect）至認證伺服器的登出頁面，但**未在瀏覽器本端清除 Session 狀態**。因此當用戶被跳轉回首頁時，代碼呼叫 `getSession()` 依然會讀取到先前的 Session，導致看起來「依然是登入狀態，資料也都還在」。
   * **解決方案：** 我們在前端覆蓋（Override）了 `unclerealAuth.logout` 的行為，在進行重導向之前，強制呼叫一次 `this.clearSession()` 來清除瀏覽器本地快取的 Session 狀態。
2. **在未登出狀態下直接點擊登入覆蓋帳號：**
   * **原因：** 原先沒有阻擋「已登入」狀態下重複呼叫登入的邏輯，可能導致多個帳號的 Token 或 Guest Session 在 SessionStorage 混淆。
   * **解決方案：** 我們覆蓋了 `unclerealAuth.login` 的行為，在用戶嘗試登入前先透過 `getSession()` 檢查。若已偵測到 active 登入狀態，將會彈出提示「您已處於登入狀態，請先登出再切換帳號」，並阻止重複觸發登入。同時在點選登入時，主動清除訪客模式的 Session ID (`guest_user_id`)，以避免資料交叉污染。

---

### 2. PWA (sw.js) 快取導致手機重整無效之說明

#### ❓ 遇到的問題：
* **手機點擊重整卻依然顯示舊內容：**
  * **原因：** 先前的 Service Worker (`sw.js`) 對頁面（例如 `/index.html`）進行了極其強勢的**離線快取（Offline Caching）**。當手機或瀏覽器載入頁面時，Service Worker 會攔截網路請求並直接從快取（Cache Storage）提供舊版本的檔案，**完全繞過網路**。因此不論是用戶點擊重整、還是開發者更新了伺服器程式碼，手機瀏覽器都只會載入存在本機的舊版快取。
  * **解決方案：**
    1. **自我銷毀型 Service Worker (Self-Destroying SW)：** 我們重新覆寫了 `/public/sw.js`，將其改為「自我銷毀」模式。在安裝 (`install`) 與啟用 (`activate`) 時，它會主動掃描並刪除所有本機的 `caches` 空間，隨後自動呼叫 `unregister()` 註銷自己。
    2. **前端強制清除與註銷邏輯：** 在 `/src/app.js` 中，我們移成了主動註冊 `sw.js` 的邏輯，並加入了一段全域常設檢查：一旦偵測到瀏覽器有註冊任何 Service Worker，便會立即註銷它，同時清空所有的 Cache Storage 快取。
  * **修正後的重整效果：**
    當上述機制生效後，瀏覽器的 PWA 快取將被徹底清空。此時**操作手機點選重整**便會直接向 Cloud Run / 伺服器發送全新的網路請求，**能夠即時且 100% 成功載入最新部署的網頁內容與資料。**

---

### 3. Supabase 資料庫未寫入問題排查與解決方案

#### ❓ 遇到的問題：
* **「資料都沒有寫入到 Supabase 的 public.winloss_records 表中」：**
  * **現象：** 前端操作一切流暢正常、無報錯，但到 Supabase Dashboard 查看表格時，發現沒有任何資料。
  * **主因分析：**
    1. **`user_id` 欄位型態轉換錯誤 (UUID vs Text)：** 原先表格設計中，`winloss_records.user_id` 宣告為 `uuid` 類型。然而，在 **「訪客模式」** 下，產生的 `guest_user_id` 是以 `guest_xxxx` 開頭的字串；而在 **「登入模式」** 下，`unclereal-login` 回傳的使用者 ID 也不一定能保證完全符合 UUID 標準格式。當嘗試把非 UUID 字串寫入 `uuid` 欄位時，PostgreSQL 會丟出強烈的 `invalid input syntax for type uuid` 錯誤！
    2. **RLS 規則型態衝突：** 即使單純將欄位改成 `text` 類型，原先 RLS 政策中的 `(auth.uid() = user_id)`，因為 `auth.uid()` 回傳 `uuid` 而 `user_id` 是 `text`，比對時會觸發 `operator does not exist: uuid = text` 導致寫入失敗。
    3. **靜默 fallback 吞噬錯誤：** 後端 `server.ts` 為了維護使用者體驗與高可用性，只要 Supabase 回傳任何錯誤（或未配置環境變數），代碼便會**悄悄地將資料改寫入伺服器本機的 local JSON 檔案 (`data/records.json`)** 並回傳 200 OK。這會使前端看起來新增成功，但其實全部儲存在本機 fallback 中，未進 Supabase。

#### 💡 解決與優化方案：

##### 第一步：在 Supabase SQL Editor 執行「一鍵熱修復 (Hotfix)」
如果您已經建立了表格，請**不要刪除它**，只需在 Supabase 專案的 **SQL Editor** 貼上並執行以下 SQL 命令。這會安全地將欄位轉為 `text` 類型，並升級 RLS 比對政策，不丟失現有資料：

```sql
-- 1. 安全地將 user_id 轉為 text 類型，相容客製化 ID 與 guest_xxx 字串
ALTER TABLE public.winloss_records ALTER COLUMN user_id TYPE text USING user_id::text;

-- 2. 刪除原有的舊 RLS 政策
DROP POLICY IF EXISTS "Allow read access to owner or guests" ON public.winloss_records;
DROP POLICY IF EXISTS "Allow insert access to anyone" ON public.winloss_records;
DROP POLICY IF EXISTS "Allow delete access to owners or guests" ON public.winloss_records;

-- 3. 建立相容的 RLS 政策 (明確將 auth.uid() 強制定型為 text 來比對 text 型態的 user_id)
CREATE POLICY "Allow read access to owner or guests" ON public.winloss_records 
    FOR SELECT USING ((user_id IS NULL) OR (auth.uid()::text = user_id));

CREATE POLICY "Allow insert access to anyone" ON public.winloss_records 
    FOR INSERT WITH CHECK ((user_id IS NULL) OR (auth.uid()::text = user_id));

CREATE POLICY "Allow delete access to owners or guests" ON public.winloss_records 
    FOR DELETE USING ((user_id IS NULL) OR (auth.uid()::text = user_id));
```

##### 第二步：我們已完成的代碼診斷優化 (自動檢測與警告)
為了讓往後的開發排查極度輕鬆透明，我們已經做出了以下功能升級：
1. **診斷 API 強化：**
   我們大幅度強化了健康檢查端點：`https://您的網址/api/health`。現在當您訪問 `/api/health` 時，伺服器會自動對 Supabase 進行一次輕量連線測試。若是連線不通、環境變數缺失、或是 RLS policies 出錯，**端點會直接在 JSON 中呈現完整的資料庫錯誤訊息 (`supabase.error`)**！
2. **開發者主控台錯誤亮起 (F12 Console)：**
   我們重寫了前端與後端的回傳通道。現在，只要 Supabase 在寫入時發生錯誤並 fallback 到本機 json，後端會將錯誤回傳，且**前端會立即在瀏覽器 F12 審查元素的 Console 中印出詳細的錯誤原因、Details 和 Hint**。再也不用盲目通靈，直接打開 Console 即可找到答案！
3. **安全配置：**
   請確保已在伺服器環境變數（如 Cloud Run）中設定：
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
   * `SUPABASE_JWT_SECRET` (選填，用於認證 token 解析)
 No newline at end of file
