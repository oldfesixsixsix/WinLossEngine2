
## 本地電腦安裝 `gcloud`？

如果你目前電腦還沒有 `gcloud` 指令，請根據你的作業系統安裝：

### 1. Mac 使用者 (最快方式)

如果你有安裝 Homebrew，直接開終端機輸入：

Bash

```
brew install --cask google-cloud-sdk
```

## 安裝完後，如何「對準」你的 GCP 帳號？

安裝好之後，你只需要在自己電腦的終端機執行初始化設定：

Bash

```
gcloud init
```

這時候它會自動跳出瀏覽器，讓你登入你的 Google 帳號，並在終端機讓你選擇你創好的 **GCP 專案 (Project ID)**。

認證成功後，你的這台本地電腦就獲得了遠端遙控權限，接下來就可以直接流暢地下達 `gcloud run deploy` 來部署你的專案囉！

```
Your current project has been set to: your-project-name
```

看到這行提示，就代表你已經完全成功切換到 `your-project-name` 這個專案了。

## Cloud Run **不再允許直接填寫 `ghcr.io` 的網址**

```
ERROR: (gcloud.run.deploy) spec.template.spec.containers[0].image: Expected an image path like [host/]repo-path[:tag and/or @digest], where host is one of [region.]gcr.io, [region-]docker.pkg.dev or docker.io but obtained ghcr.io/oldfesixsixsix/winlossengine2:latest. To deploy container images from other public or private registries, set up an Artifact Registry remote repository. See https://cloud.google.com/artifact-registry/docs/repositories/remote-repo.
```

透過 `gcloud run deploy` 或是網頁主控台，Cloud Run **不再允許直接填寫 `ghcr.io` 的網址**。它規定鏡像路徑必須來自 Google 自家的來源（`gcr.io` 或 `docker.pkg.dev`），或者是官方的 `docker.io` (Docker Hub)。


## port

```
**ERROR:** (gcloud.run.services.update) The user-provided container failed to start and listen on the port defined provided by the PORT=8080 environment variable within the allocated timeout. This can happen when the container port is misconfigured or if the timeout is too short. The health check timeout can be extended. Logs for this revision might contain more information.
```

server.ts
```
const PORT = 3000; // 改成 8080
app.listen(PORT, '0.0.0.0', () => {

console.log(`[X4 Retro Engine] running at http://localhost:${PORT}`);

});
```
## (Mac) 架構不匹配（Architecture Mismatch）

```
ERROR: (gcloud.run.deploy) Cloud Run does not support image 'asia-east1-docker.pkg.dev/akkoma-local-test/my-repo/winlossengine2:latest': Container manifest type 'application/vnd.oci.image.index.v1+json' must support amd64/linux.
```

近年因為 M1/M2/M3 晶片 Mac 普及後，大家部署到雲端最常踩到的坑：**架構不匹配（Architecture Mismatch）**。

### 為什麼會這樣？

1. 你的本地電腦（很可能是 **Apple Silicon M晶片的 Mac**，架構是 `arm64`）在執行 `docker build` 時，預設會打包出一個適合你這台 Mac 跑的 `arm64/linux` 鏡像。
    
2. 但是 **Google Cloud Run 的伺服器底層是 Intel/AMD 的晶片（架構是 `amd64/linux`）**。
    
3. 你剛剛推上去的 `application/vnd.oci.image.index.v1+json` 格式，裡面包含了 `arm64` 的架構，Cloud Run 讀取後發現它不支援，所以直接拒絕部署。
    

## 強制打包成 `amd64` 架構

不用去動程式碼，你只需要在本地重新打包（Build）時，加入一個 `--platform linux/amd64` 的參數，明確告訴 Docker：「不管我目前的電腦是什麼晶片，請一律幫我編譯成適合雲端 Intel/AMD 跑的格式！」

請在你的本地終端機依序執行以下三行指令：

打包（加上平台參數）
```bash
docker build --platform linux/amd64 -t asia-east1-docker.pkg.dev/akkoma-local-test/my-repo/winlossengine2:latest .
```

推送到 GCP Artifact Registry
```bash
docker push asia-east1-docker.pkg.dev/akkoma-local-test/my-repo/winlossengine2:latest
```

部署到 Cloud Run
```bash
gcloud run deploy winlossengine2-service --image asia-east1-docker.pkg.dev/akkoma-local-test/my-repo/winlossengine2:latest --platform managed --region asia-east1 --allow-unauthenticated
```

## 更新
```bash
gcloud run services update winlossengine2-service \
  --region asia-east1 \
  --set-env-vars VITE_SUPABASE_URL="your-path",VITE_SUPABASE_ANON_KEY="your-key",SUPABASE_JWT_SECRET="your-secret"
```