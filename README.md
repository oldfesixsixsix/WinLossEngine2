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
 No newline at end of file
