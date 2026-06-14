# 🎮 X4 Retro Meme Arena - Default Assets Folder (預設音效與圖片設定指南)

Here, you can drop your default sounds and images. The application will automatically detect and use them as fallbacks if no custom files are uploaded through the browser Settings UI.

任何放置在此處的音效與圖片，在網頁未透過後台頁面另外上傳時，皆會作為預設（Fallback）素材自動撥放。

---

## 🎵 Sounds Directory Layout (音效檔案路徑)
Place your custom sound files directly inside the `./sounds/` directory. Must use the exact filenames below:
請將您的音效檔案放置至 `./sounds/` 資料夾，並依照指定的檔名進行配置：

1. `bgm.mp3`         - Background Loop Track (背景循環配樂)
2. `win.mp3`         - Victory/Win Theme audio (戰勝/贏戰吼音效)
3. `loss.mp3`        - Lose/Failure Theme audio (戰敗/輸戰吼音效)
4. `tab.mp3`         - Bottom tab navigation select (頁籤切換音效)
5. `select_win.mp3`  - Selecting "WIN" Hero card (在紀錄頁選擇 WIN 卡片音效)
6. `select_loss.mp3` - Selecting "LOSS" Hero card (在紀錄頁選擇 LOSS 卡片音效)
7. `submit.mp3`      - Clicking "Register Record/Save Settings" (記錄登錄或儲存設定音效)

*(Supported formats: `.mp3`, `.wav`, `.ogg`)*

---

## 🖼️ Images Directory Layout (圖片檔案路徑)
Place your default meme images directly inside the `./images/` directory:
請將您的梗圖放置至 `./images/` 資料夾中，並使用以下名稱：

1. `rockman_win.png` - Used when a "WIN" outcome is recorded/selected (預設獲勝梗圖)
2. `zero_lose.png`   - Used when a "LOSS" outcome is recorded/selected (預設失敗梗圖)
3. `tie_meme.png`    - Used when a "DRAW" outcome is recorded/selected (預設平手梗圖)

*(These will be copied automatically on server boot if not already present. You can replace them anytime with your own files!)*
