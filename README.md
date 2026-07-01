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


# 部署至 Google Cloud Run 手動
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

環境變數檢查

```
gcloud run services describe winlossengine2-service \
  --region=asia-east1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

改完後

打包（加上平台參數）

推送到 GCP Artifact Registry

部署到 Cloud Run



# 部署至 Google Cloud Run 透過腳本

專案中提供了兩個自動化腳本，方便快速進行建置、部署與環境變數管理。

## 1. 部署與建置腳本 (`deploy.sh`)

此腳本用於在本地建置 Docker 映像檔（適用於 `linux/amd64` 平台）、推送至 GCP Artifact Registry，並一鍵部署至 Cloud Run。

### 使用步驟：
1. 編輯 [deploy.sh](file:///Users/paul.mac/Desktop/Projects/app/winloss/WinLossEngine2/deploy.sh)，修改最上方的設定變數（如專案名稱、映像檔名稱與 Region 等）：
   ```bash
   GCP_REGION="asia-east1"
   GCP_PROJECT="akkoma-local-test"
   ARTIFACT_REPO="my-repo"
   IMAGE_NAME="winlossengine2"
   IMAGE_TAG="latest"
   SERVICE_NAME="winlossengine2-service"
   ```
2. 在終端機中執行腳本：
   ```bash
   ./deploy.sh
   ```

---

## 2. 環境變數設定腳本 (`set_env.sh`)

此腳本用於快速新增或更新 Cloud Run 服務上的環境變數（例如 Supabase 連線資訊與安全金鑰）。

### 使用步驟：
1. 編輯 [set_env.sh](file:///Users/paul.mac/Desktop/Projects/app/winloss/WinLossEngine2/set_env.sh)，修改最上方的連線與密鑰變數（如 `SUPABASE_SERVICE_ROLE_KEY`）：
   ```bash
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   SUPABASE_JWT_SECRET="your-jwt-secret"
   ```
2. 在終端機中執行腳本更新環境變數：
   ```bash
   ./set_env.sh
   ```

---

## 常見錯誤排除

### 1. Port 8080 啟動失敗錯誤
```
ERROR: (gcloud.run.services.update) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout.
```
**原因與解決方案：**
Cloud Run 預設容器會監聽 `8080` 埠號。請確保 [server.ts](file:///Users/paul.mac/Desktop/Projects/app/winloss/WinLossEngine2/server.ts) 內設定的連接埠正確，或是直接以環境變數 `PORT` 讀取：
```typescript
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

