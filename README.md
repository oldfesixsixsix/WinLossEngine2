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
 No newline at end of file
