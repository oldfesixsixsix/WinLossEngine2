// Rockman X4 Duel Win/Loss Tracker - CLIENT CONTROLLER

// Translation Bundles
const TRANSLATIONS = {
  ja: {
    headerStage: "ST-04: ミームフィールド",
    headerTitle: "決闘記録システム",
    recPrompt: ">> 結果を選択してください <<",
    recWinDesc: "勝利",
    recLossDesc: "敗北",
    recDrawBtn: "引き分けを記録する",
    lblReason: "原因・メモ (200文字以下):",
    lblProof: "決闘証拠のスクリーンショット (任意):",
    chooseFile: "ファイル選択",
    decideLbl: "決闘記録を登録する",
    tab2Title: "決闘履歴タイムライン",
    tab4Title: "システム設定 & カスタムリソース",
    lblLang: "言語選択:",
    lblQuotes: "カスタムミーム語録 (パイプ | で区切る):",
    saveText: "テキスト設定を保存",
    lblAssets: "アセットファイルをアップロード:",
    winImg: "「勝利」ミーム画像:",
    drawImg: "「引き分け」ミーム画像:",
    lossImg: "「敗北」ミーム画像:",
    bgmUrl: "カスタムBGM音源:",
    winSe: "勝利SE音声:",
    lossSe: "敗北SE音声:",
    saveAssets: "素材ファイルをアップロードする",
    day: "[ 日次 ]",
    week: "週次",
    month: "月次",
    win: "勝利数",
    loss: "敗北数",
    rate: "勝率",
    winRatio: "勝率割合",
    victories: "勝利数",
    defeats: "敗北数",
    statusWin: "お見事！絶好調！",
    statusLoss: "作戰失敗... 出直しましょう",
    statusEqual: "五分五分！引き分け",
    toastTitle: "PWA 検出: インストールしますか？",
    toastBody: "ホーム画面に決闘記録アプリを追加！",
    install: "追加",
    close: "閉じる",
    on: "オン",
    off: "オフ",
    optionDrawChosen: ">> 引き分けが選択されました <<",
    noFileChosen: "ファイル選択なし",
    submitting: "データベースに登録中...",
    deployingAssets: "アセットファイルを展開中...",
    registryCompleted: "登録完了！",
    recsTemplate: "{count}件の記録",
    alertAssetsSuccess: "アセットが正常に更新されました！システムに適用中...",
    alertAssetsReject: "更新エラー：サーバーがファイルを拒否しました。",
    alertAssetsError: "エラー：ファイルのアップロードに失敗しました。",
    alertTextSavedSuccess: "テキスト設定と表示言語を保存しました。",
    alertTextSavedError: "エラー：データベースへの保存に失敗しました。",
    alertRecordSavedError: "エラー：データベースが記録を拒否しました。",
    alertRecordNetworkError: "エラー：Expressサーバーに接続できません。",
    subWinQuote: "勝利時のカスタム語録 (勝):",
    subDrawQuote: "引き分け時のカスタム語録 (分):",
    subLossQuote: "敗北時のカスタム語録 (負):",
    avatarSystem: "⚖️ システム",
    avatarX: "⚡ 勝利",
    avatarZero: "🔥 敗北",
    outcomeDraw: "引き分け / 和局",
    outcomeWin: "勝利",
    outcomeLoss: "敗北",
    noComments: "メモはありません。",
    deleteBtnText: "記録を削除する",
    confirmDelete: "削除の確認：この決闘記録をSQLiteデータベースから永久に削除しますか？",
    alertDeleteFailure: "エラー：サーバーが削除リクエストを拒否しました。",
    noRecordsYet: "記録がまだありません。上のボタンから決闘結果を記録しましょう！",
    lightboxMeta: "決闘証拠アタッチメント",
    tabSe: "下部タブ切替SE音:",
    selectWinSe: "記録-勝利選択SE音:",
    selectLossSe: "記録-敗北選択SE音:",
    submitSe: "登録・保存SE音:"
  },
  'zh-TW': {
    headerStage: "ST-04: 梗圖戰場",
    headerTitle: "輸贏紀錄系統",
    recPrompt: ">> 請選擇這次的決鬥結果 <<",
    recWinDesc: "勝利",
    recLossDesc: "敗北",
    recDrawBtn: "可選: 記錄一筆 平手 (和局)",
    lblReason: "原因/備註 (200字以內):",
    lblProof: "輸贏憑證截圖 (選填):",
    chooseFile: "選擇檔案",
    decideLbl: "決定登錄決鬥紀錄",
    tab2Title: "決鬥歷史動態",
    tab4Title: "系統設定與自定義資源",
    lblLang: "語系設定:",
    lblQuotes: "自定義迷因語錄 (用直線 | 隔開):",
    saveText: "儲存文字設定",
    lblAssets: "上傳/替換實體資源:",
    winImg: "「贏」迷因梗圖:",
    drawImg: "「平局」迷因梗圖:",
    lossImg: "「輸」迷因梗圖:",
    bgmUrl: "自訂背景音樂:",
    winSe: "上傳獲勝音效:",
    lossSe: "上傳落敗音效:",
    saveAssets: "上傳並部署實體資源",
    day: "[ 當日 ]",
    week: "本週",
    month: "本月",
    win: "總贏次數",
    loss: "總輸次數",
    rate: "勝率",
    winRatio: "勝率分佈",
    victories: "獲勝次數",
    defeats: "落敗次數",
    statusWin: "不愧是你！絕好調",
    statusLoss: "投降輸一半！任務失敗",
    statusEqual: "沒輸沒贏！五五開",
    toastTitle: "偵測到 PWA: 要安裝嗎？",
    toastBody: "將輸贏紀錄器新增至您的主螢幕！",
    install: "安裝",
    close: "關閉",
    on: "開啟",
    off: "關閉",
    optionDrawChosen: ">> 已選取平手狀態 <<",
    noFileChosen: "尚未選擇檔案",
    submitting: "正在與伺服器資料庫進行同步中...",
    deployingAssets: "正在傳輸並部署多媒體實體資源...",
    registryCompleted: "決鬥紀錄登錄成功！",
    recsTemplate: "{count} 筆紀錄",
    alertAssetsSuccess: "素材與實體資源已成功更新！系統正在熱重載配置...",
    alertAssetsReject: "更新失敗：伺服器拒絕了上傳的空白或無效二進位資料。",
    alertAssetsError: "傳輸失敗：無法將實體資料上傳至 Node 伺服器。",
    alertTextSavedSuccess: "文字設定與語系已成功儲存至 SQLite 資料庫。",
    alertTextSavedError: "儲存失敗：無法寫入資料庫設定。",
    alertRecordSavedError: "傳輸失敗：資料庫拒絕登錄此帳目紀錄。",
    alertRecordNetworkError: "連接失敗：無法連線至 Express 後端伺服器。",
    subWinQuote: "勝利狀態語錄 (贏):",
    subDrawQuote: "和局狀態語錄 (和):",
    subLossQuote: "落敗狀態語錄 (輸):",
    avatarSystem: "⚖️ 系統頻道",
    avatarX: "⚡ 勝利",
    avatarZero: "🔥 敗北",
    outcomeDraw: "和局 / 平手",
    outcomeWin: "勝利",
    outcomeLoss: "敗北",
    noComments: "無任何備註說明喔。",
    deleteBtnText: "刪除歷史紀錄",
    confirmDelete: "確認消除：您確定要從 SQLite 資料庫中永久移除此筆決鬥紀錄嗎？",
    alertDeleteFailure: "操作失敗：伺服器拒絕了該筆紀錄的刪除請求。",
    noRecordsYet: "尚未登錄任何決鬥紀錄。請在上方登錄今日的輸贏吧！",
    lightboxMeta: "決鬥現場實體憑證",
    tabSe: "下方頁籤切換音效:",
    selectWinSe: "紀錄 WIN 選擇音效:",
    selectLossSe: "紀錄 LOSS 選擇音效:",
    submitSe: "登錄提交儲存音效:"
  },
  'zh-CN': {
    headerStage: "ST-04: 梗图战场",
    headerTitle: "输赢纪录系统",
    recPrompt: ">> 请选择这次的决斗结果 <<",
    recWinDesc: "胜利",
    recLossDesc: "败北",
    recDrawBtn: "可选: 记录一笔 平手 (和局)",
    lblReason: "原因/备注 (200字以内):",
    lblProof: "输赢凭证截图 (选填):",
    chooseFile: "选择文件",
    decideLbl: "决定登录决斗纪录",
    tab2Title: "决斗历史动态",
    tab4Title: "系统设定与自定义资源",
    lblLang: "语系设定:",
    lblQuotes: "自定义迷因语录 (用直线 | 隔开):",
    saveText: "保存文字设定",
    lblAssets: "上传/替换实体资源:",
    winImg: "「赢」迷因梗图:",
    drawImg: "「平局」迷因梗图:",
    lossImg: "「输」迷因梗图:",
    bgmUrl: "自定背景音乐:",
    winSe: "上传获胜音效:",
    lossSe: "上传落败音效:",
    saveAssets: "上传并部署实体资源",
    day: "[ 当日 ]",
    week: "本周",
    month: "本月",
    win: "总赢次数",
    loss: "总输次数",
    rate: "胜率",
    winRatio: "胜率分布",
    victories: "获胜次数",
    defeats: "落败次数",
    statusWin: "不愧是你！绝好调",
    statusLoss: "投降输一半！任务失败",
    statusEqual: "没输没赢！五开",
    toastTitle: "侦测到 PWA: 要安装吗？",
    toastBody: "将输赢纪录器新增至您的主屏幕！",
    install: "安装",
    close: "关闭",
    on: "开启",
    off: "关闭",
    optionDrawChosen: ">> 已选取平手状态 <<",
    noFileChosen: "尚未选择文件",
    submitting: "正在与服务器数据库进行同步中...",
    deployingAssets: "正在传输并部署多媒体实体资源...",
    registryCompleted: "决斗纪录登录成功！",
    recsTemplate: "{count} 笔纪录",
    alertAssetsSuccess: "素材与实体资源已成功更新！系统正在热重载配置...",
    alertAssetsReject: "更新失败：服务器拒绝了上传的空白或无效二进制数据。",
    alertAssetsError: "传输失败：无法将实体数据上传至 Node 服务器。",
    alertTextSavedSuccess: "文字设定与语系已成功保存至 SQLite 数据库。",
    alertTextSavedError: "保存失败：无法写入数据库设定。",
    alertRecordSavedError: "传输失败：数据库拒绝登录此账目纪录。",
    alertRecordNetworkError: "连接失败：无法连线至 Express 后端服务器。",
    subWinQuote: "胜利状态语录 (赢):",
    subDrawQuote: "和局状态语录 (和):",
    subLossQuote: "落败状态语录 (输):",
    avatarSystem: "⚖️ 系统频道",
    avatarX: "⚡ 胜利",
    avatarZero: "🔥 败北",
    outcomeDraw: "和局 / 平手",
    outcomeWin: "胜利",
    outcomeLoss: "败北",
    noComments: "无任何备注说明喔。",
    deleteBtnText: "删除历史纪录",
    confirmDelete: "确认消除：您确定要从 SQLite 数据库中永久移除此笔决斗纪录吗？",
    alertDeleteFailure: "操作失败：服务器拒绝了该笔纪录的删除请求。",
    noRecordsYet: "尚未登录任何决斗纪录。请在上方登录今日的输赢吧！",
    lightboxMeta: "决斗现场实体凭证",
    tabSe: "下方面签切换音效:",
    selectWinSe: "记录 WIN 选择音效:",
    selectLossSe: "记录 LOSS 选择音效:",
    submitSe: "登录提交保存音效:"
  },
  en: {
    headerStage: "ST-04: MEME ARENA",
    headerTitle: "WIN/LOSS Tracker",
    recPrompt: ">> SELECT YOUR DUEL STATE <<",
    recWinDesc: "VICTORY",
    recLossDesc: "DEFEATED",
    recDrawBtn: "Record a DRAW (TIE) OUTCOME",
    lblReason: "Reason / Memo (Max 200 chars):",
    lblProof: "Proof Voucher Screenshot (Optional):",
    chooseFile: "CHOOSE FILE",
    decideLbl: "SUBMIT DUEL REGISTRATION",
    tab2Title: "DUEL TIMELINE HISTORY",
    tab4Title: "SYS CONFIGS & ASSETS MANAGEMENT",
    lblLang: "Language Select:",
    lblQuotes: "Custom Meme Quotes (Split by pipe |):",
    saveText: "SAVE TEXT CONFIGS",
    lblAssets: "Replace Static Media Files:",
    winImg: "Win Meme Graphic:",
    drawImg: "Draw Meme Graphic:",
    lossImg: "Loss Meme Graphic:",
    bgmUrl: "Background Music (BGM):",
    winSe: "Upload Win Sound (SE):",
    lossSe: "Upload Loss Sound (SE):",
    saveAssets: "UPLOAD AND DEPLOY ASSETS",
    day: "[ DAILY ]",
    week: "WEEKLY",
    month: "MONTHLY",
    win: "TOTAL WINS",
    loss: "TOTAL LOSS",
    rate: "WIN RATE",
    winRatio: "WIN RATIO",
    victories: "VICTORIES",
    defeats: "DEFEATS",
    statusWin: "Outstanding! Unbeatable!",
    statusLoss: "Mission Failed! Try Again!",
    statusEqual: "Even Duel! Tie Play!",
    toastTitle: "PWA DETECTED: INSTALL?",
    toastBody: "Add Win/Loss Tracker to your home screen!",
    install: "INSTALL",
    close: "CLOSE",
    on: "ON",
    off: "OFF",
    optionDrawChosen: ">> OPTION CHOSEN: DRAW <<",
    noFileChosen: "NO FILE CHOSEN",
    submitting: "COMMUNICATING WITH RETRO DATABASE...",
    deployingAssets: "DEPLOYING MULTIPART BINARY DATA...",
    registryCompleted: "REGISTRY COMPLETED!",
    recsTemplate: "{count} RECS",
    alertAssetsSuccess: "16-Bit assets successfully updated! Hardwriting system...",
    alertAssetsReject: "Replacement error: server rejected uploaded binaries.",
    alertAssetsError: "Failure uploading files to node server.",
    alertTextSavedSuccess: "Database text settings updated successfully.",
    alertTextSavedError: "Failed to write settings to SQLite database.",
    alertRecordSavedError: "Transmission error: database rejected record.",
    alertRecordNetworkError: "Network failure reaching Express backend.",
    subWinQuote: "Win State Quotes:",
    subDrawQuote: "Draw State Quotes:",
    subLossQuote: "Loss State Quotes:",
    avatarSystem: "⚖️ SYSTEM",
    avatarX: "⚡ WIN",
    avatarZero: "🔥 LOSS",
    outcomeDraw: "TIE / DRAW",
    outcomeWin: "VICTORY",
    outcomeLoss: "DEFEATED",
    noComments: "No comments left.",
    deleteBtnText: "DELETE",
    confirmDelete: "CONFIRM ELIMINATION: Erase this record from SQLite database permanently?",
    alertDeleteFailure: "Failure: Server rejected deletion request.",
    noRecordsYet: "NO RECORDS RECORDED YET. GET YOUR DUEL STARTED ABOVE!",
    lightboxMeta: "RECORD ATTACHMENT",
    tabSe: "Bottom Tab Select SE:",
    selectWinSe: "Record WIN Select SE:",
    selectLossSe: "Record LOSS Select SE:",
    submitSe: "Submit & Save SE:"
  }
};

// Exception-safe LocalStorage utility wrapper
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('LocalStorage is blocked or non-accessible:', e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('LocalStorage is blocked or non-accessible:', e);
    }
  }
};

// Global App State
let currentLang = 'ja';
let scoreRecordsList = [];
let backendSettings = {};
let selectedOutcome = 'win'; // 'win', 'loss', or 'draw'

// BGM / Synth State
let synthesizedIntervalId = null;
let currentSynthAudioCtx = null;
let customBgmInstance = null; // HTMLAudioElement for custom uploaded BGM
let isBgmPlaying = false;

// Resolve quotes properly depending on current selected language
function getLocalizedQuote(rawQuoteStr, fallbackDefault) {
  if (!rawQuoteStr) return fallbackDefault;
  const parts = rawQuoteStr.split('|').map(s => s.trim()).filter(Boolean);
  if (parts.length === 0) return fallbackDefault;
  if (parts.length === 3) {
    if (currentLang === 'zh-TW' || currentLang === 'zh-CN') {
      return parts[0];
    } else if (currentLang === 'en') {
      return parts[1];
    } else {
      return parts[2]; // ja or other
    }
  }
  return parts[Math.floor(Math.random() * parts.length)];
}

// 1. Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettingsFromServer();
  await refreshRecords();
  initMainEventBindings();
  setupPWAInstaller();
  
  // Set default active tab
  switchActiveTab('record');
});

// Load backend configs from SQLite
// Safe DOM manipulation helpers to guarantee 100% crash-free UI updates
function safeSetInnerText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = text;
  }
}

function safeSetInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.value = value;
  }
}

function safeSetImgSrc(id, src) {
  const el = document.getElementById(id);
  if (el) {
    el.src = src;
  }
}

async function safeParseJson(response) {
  try {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.warn('[X4 API Warning] Expected JSON but received:', contentType, text.substring(0, 150));
      return null;
    }
    return await response.json();
  } catch (err) {
    console.error('[X4 API Error] Failed to parse JSON:', err);
    return null;
  }
}

async function loadSettingsFromServer() {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      const data = await safeParseJson(response);
      if (data) {
        backendSettings = data;
      }
      
      // Preserve active language stored in localStorage, fallback to backend setting or 'ja'
      const savedLocal = safeStorage.getItem('app_lang');
      currentLang = savedLocal || backendSettings.lang || 'ja';
      
      // Update selections without overriding selectedOutcome
      safeSetInputValue('select-lang', currentLang);

      // Populate text setting boxes
      safeSetInputValue('set-quote-win', backendSettings.win_meme_quote || '');
      safeSetInputValue('set-quote-draw', backendSettings.draw_meme_quote || '');
      safeSetInputValue('set-quote-loss', backendSettings.loss_meme_quote || '');

      // Update default display pictures if they changed
      safeSetImgSrc('display-win-image', backendSettings.win_meme_url || '/defaults/images/rockman_win.png');
      safeSetImgSrc('display-loss-image', backendSettings.loss_meme_url || '/defaults/images/zero_lose.png');

      applyLocalizationBundle();
    }
  } catch (err) {
    console.error('Failed to communicate with API Settings:', err);
  }
}

// Fetch all duel records and load statistics dashboards
async function refreshRecords() {
  try {
    const response = await fetch('/api/records');
    if (response.ok) {
      const data = await safeParseJson(response);
      if (data) {
        scoreRecordsList = data;
        renderTimelineLayout();
        updateStatisticsMetrics('day'); // default
      }
    }
  } catch (err) {
    console.error('Failed to refresh records:', err);
  }
}

// Translate elements directly based on current selection
function applyLocalizationBundle() {
  const dictionary = TRANSLATIONS[currentLang] || TRANSLATIONS.ja;

  // Header
  safeSetInnerText('header-stage-info', dictionary.headerStage);
  safeSetInnerText('header-title', dictionary.headerTitle);

  // Record Form Labels
  const recPrompt = document.getElementById('rec-prompt');
  if (recPrompt) {
    if (selectedOutcome === 'draw') {
      recPrompt.innerText = dictionary.optionDrawChosen;
    } else {
      recPrompt.innerText = dictionary.recPrompt;
    }
  }
  safeSetInnerText('rec-win-desc', dictionary.recWinDesc);
  safeSetInnerText('rec-loss-desc', dictionary.recLossDesc);
  safeSetInnerText('rec-draw-btn', dictionary.recDrawBtn);
  safeSetInnerText('lbl-reason', dictionary.lblReason);
  safeSetInnerText('lbl-proof', dictionary.lblProof);
  safeSetInnerText('btn-upload-lbl', dictionary.chooseFile);
  safeSetInnerText('btn-decide-lbl', dictionary.decideLbl);

  // Timeline & Stats Tabs
  safeSetInnerText('tab2-title', dictionary.tab2Title);
  safeSetInnerText('span-day', dictionary.day);
  safeSetInnerText('span-week', dictionary.week);
  safeSetInnerText('span-month', dictionary.month);
  safeSetInnerText('stat-win-lbl', dictionary.win);
  safeSetInnerText('stat-loss-lbl', dictionary.loss);
  safeSetInnerText('stat-rate-lbl', dictionary.rate);
  safeSetInnerText('stat-win-desc', dictionary.victories);
  safeSetInnerText('stat-loss-desc', dictionary.defeats);
  safeSetInnerText('stat-rate-desc', dictionary.winRatio);

  // Settings
  safeSetInputValue('select-lang', currentLang);
  safeSetInnerText('tab4-title', dictionary.tab4Title);
  safeSetInnerText('set-lbl-lang', dictionary.lblLang);
  safeSetInnerText('set-lbl-quotes', dictionary.lblQuotes);
  safeSetInnerText('set-btn-save-txt', dictionary.saveText);
  safeSetInnerText('set-lbl-assets', dictionary.lblAssets);
  safeSetInnerText('set-btn-save-assets', dictionary.saveAssets);

  // Custom Quote specific sub-block labels
  safeSetInnerText('set-sub-win', dictionary.subWinQuote);
  safeSetInnerText('set-sub-draw', dictionary.subDrawQuote);
  safeSetInnerText('set-sub-loss', dictionary.subLossQuote);

  // Custom Assets replacement individual file inputs labels
  safeSetInnerText('set-lbl-win-img', dictionary.winImg);
  safeSetInnerText('set-lbl-draw-img', dictionary.drawImg);
  safeSetInnerText('set-lbl-loss-img', dictionary.lossImg);
  safeSetInnerText('set-lbl-bgm', dictionary.bgmUrl);
  safeSetInnerText('set-lbl-win-se', dictionary.winSe);
  safeSetInnerText('set-lbl-loss-se', dictionary.lossSe);
  safeSetInnerText('set-lbl-tab-se', dictionary.tabSe);
  safeSetInnerText('set-lbl-select-win-se', dictionary.selectWinSe);
  safeSetInnerText('set-lbl-select-loss-se', dictionary.selectLossSe);
  safeSetInnerText('set-lbl-submit-se', dictionary.submitSe);

  // Footer Navigation Bar
  const isChinese = currentLang === 'zh-TW' || currentLang === 'zh-CN';
  const recNavTxt = isChinese ? (currentLang === 'zh-TW' ? '決鬥登錄' : '决斗登录') : (currentLang === 'ja' ? '記録' : 'RECORD');
  const logNavTxt = isChinese ? (currentLang === 'zh-TW' ? '歷史動態' : '历史动态') : (currentLang === 'ja' ? '履歴' : 'LOGS');
  const statNavTxt = isChinese ? (currentLang === 'zh-TW' ? '勝率分析' : '胜率分析') : (currentLang === 'ja' ? '統計' : 'STATS');
  const setNavTxt = isChinese ? (currentLang === 'zh-TW' ? '更換資源' : '更换资源') : (currentLang === 'ja' ? '設定' : 'SETTINGS');

  safeSetInnerText('nav-lbl-record', recNavTxt);
  safeSetInnerText('nav-lbl-timeline', logNavTxt);
  safeSetInnerText('nav-lbl-stats', statNavTxt);
  safeSetInnerText('nav-lbl-settings', setNavTxt);

  // PWA Toast
  safeSetInnerText('pwa-toast-title', dictionary.toastTitle);
  safeSetInnerText('pwa-toast-body', dictionary.toastBody);
  safeSetInnerText('btn-pwa-install', dictionary.install);
  safeSetInnerText('btn-pwa-close', dictionary.close);

  // Lightbox Media Attachment Label
  safeSetInnerText('lightbox-meta', dictionary.lightboxMeta);

  // BGM Active Status Text Indicator
  safeSetInnerText('bgm-status-text', isBgmPlaying ? dictionary.on : dictionary.off);

  // Ensure dynamic statistics metrics & quotes match the dictionary instantly
  try {
    const activeStatsBtn = document.querySelector('.stats-period-btn.active');
    const activePeriod = activeStatsBtn ? activeStatsBtn.getAttribute('data-period') : 'day';
    updateStatisticsMetrics(activePeriod);
  } catch (e) {
    console.debug('Statistics metrics display is not ready or has been skipped during applyLocalizationBundle setup.');
  }
}

// Main Events Coordinator
function initMainEventBindings() {
  
  // Tab change triggers
  const navButtons = document.querySelectorAll('.stats-tab-nav');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabTarget = btn.getAttribute('data-tab');
      switchActiveTab(tabTarget);
      playTabSelectSound(); // click interface tab sound
    });
  });

  // RECORD OUTCOME SELECTIONS
  const winHeroPanel = document.getElementById('btn-outcome-win');
  const lossHeroPanel = document.getElementById('btn-outcome-loss');
  const drawSecButton = document.getElementById('btn-outcome-draw');

  winHeroPanel.addEventListener('click', () => {
    selectedOutcome = 'win';
    winHeroPanel.classList.add('active');
    lossHeroPanel.classList.remove('active');
    if (drawSecButton) {
      drawSecButton.style.borderStyle = 'solid';
      drawSecButton.style.borderColor = '#d63bff';
      drawSecButton.style.backgroundColor = '#1c0e2c';
    }
    document.getElementById('rec-prompt').innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).recPrompt;
    document.getElementById('rec-prompt').style.color = '#00f2ff';
    playRecordSelectWinSound();
  });

  lossHeroPanel.addEventListener('click', () => {
    selectedOutcome = 'loss';
    lossHeroPanel.classList.add('active');
    winHeroPanel.classList.remove('active');
    if (drawSecButton) {
      drawSecButton.style.borderStyle = 'solid';
      drawSecButton.style.borderColor = '#d63bff';
      drawSecButton.style.backgroundColor = '#1c0e2c';
    }
    document.getElementById('rec-prompt').innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).recPrompt;
    document.getElementById('rec-prompt').style.color = '#00f2ff';
    playRecordSelectLossSound();
  });

  if (drawSecButton) {
    drawSecButton.addEventListener('click', () => {
      selectedOutcome = 'draw';
      lossHeroPanel.classList.remove('active');
      winHeroPanel.classList.remove('active');
      drawSecButton.style.borderStyle = 'double';
      drawSecButton.style.borderColor = '#00ff66';
      drawSecButton.style.backgroundColor = 'rgba(214, 59, 255, 0.2)';
      
      // update label status prompt
      document.getElementById('rec-prompt').innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).optionDrawChosen;
      document.getElementById('rec-prompt').style.color = '#d63bff';
      playSynthesizedTick();
    });
  }

  // Screenshot Upload Click trigger hook
  const hiddenFileInput = document.getElementById('input-file');
  const triggerBtn = document.getElementById('btn-trigger-upload');
  const filenameIndicator = document.getElementById('file-name-indicator');

  triggerBtn.addEventListener('click', () => {
    hiddenFileInput.click();
  });

  hiddenFileInput.addEventListener('change', () => {
    if (hiddenFileInput.files && hiddenFileInput.files[0]) {
      filenameIndicator.innerText = hiddenFileInput.files[0].name.toUpperCase();
      filenameIndicator.classList.add('text-[#00ff66]');
    } else {
      filenameIndicator.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).noFileChosen;
      filenameIndicator.classList.remove('text-[#00ff66]');
    }
  });

  // SUBMIT DUEL RECORD
  document.getElementById('btn-submit-record').addEventListener('click', async () => {
    const reasonValue = document.getElementById('input-reason').value.trim();
    
    const formData = new FormData();
    formData.append('type', selectedOutcome);
    formData.append('reason', reasonValue);
    if (hiddenFileInput.files && hiddenFileInput.files[0]) {
      formData.append('image', hiddenFileInput.files[0]);
    }

    try {
      const submitBtn = document.getElementById('btn-submit-record');
      submitBtn.disabled = true;
      submitBtn.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).submitting;

      const response = await fetch('/api/records', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        // Play submit success chime and epic result sound
        playSubmitSaveSound();
        
        if (selectedOutcome === 'win') {
          playResultTheme(true);
        } else if (selectedOutcome === 'loss') {
          playResultTheme(false);
        } else {
          // Draw plays sound
          playSynthesizedWinSound();
        }

        // Reset fields
        document.getElementById('input-reason').value = "";
        hiddenFileInput.value = "";
        filenameIndicator.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).noFileChosen;
        filenameIndicator.classList.remove('text-[#00ff66]');

        // flash notification
        const headerTitle = document.getElementById('header-title');
        const oldTitleText = headerTitle.innerText;
        headerTitle.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).registryCompleted;
        headerTitle.style.color = "#00ff66";
        setTimeout(() => {
          headerTitle.innerText = oldTitleText;
          headerTitle.style.color = "#00f2ff";
        }, 2200);

        await refreshRecords();
        // Redirect to timeline Tab
        switchActiveTab('timeline');
      } else {
        alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertRecordSavedError);
      }
    } catch (err) {
      console.error(err);
      alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertRecordNetworkError);
    } finally {
      const submitBtn = document.getElementById('btn-submit-record');
      submitBtn.disabled = false;
      submitBtn.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).decideLbl;
    }
  });

  // Stats filter intervals binding
  const filterBtns = document.querySelectorAll('.stats-period-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'text-[#00f2ff]');
        b.classList.add('text-[#005a70]');
      });
      btn.classList.add('active', 'text-[#00f2ff]');
      btn.classList.remove('text-[#005a70]');

      const period = btn.getAttribute('data-period');
      updateStatisticsMetrics(period);
      playSynthesizedTick();
    });
  });

  // Settings Lang Select change
  document.getElementById('select-lang').addEventListener('change', (e) => {
    currentLang = e.target.value;
    safeStorage.setItem('app_lang', currentLang);
    applyLocalizationBundle();
    playSynthesizedTick();
  });

  // Save textual Quotes settings
  document.getElementById('btn-save-text-settings').addEventListener('click', async () => {
    const langVal = document.getElementById('select-lang').value;
    const quoteWin = document.getElementById('set-quote-win').value.trim();
    const quoteDraw = document.getElementById('set-quote-draw').value.trim();
    const quoteLoss = document.getElementById('set-quote-loss').value.trim();

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          lang: langVal,
          win_meme_quote: quoteWin,
          draw_meme_quote: quoteDraw,
          loss_meme_quote: quoteLoss
        })
      });

      if (response.ok) {
        currentLang = langVal;
        safeStorage.setItem('app_lang', currentLang);
        backendSettings.win_meme_quote = quoteWin;
        backendSettings.draw_meme_quote = quoteDraw;
        backendSettings.loss_meme_quote = quoteLoss;
        applyLocalizationBundle();
        playSubmitSaveSound();
        alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertTextSavedSuccess);
      }
    } catch (err) {
      console.error(err);
      alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertTextSavedError);
    }
  });

  // Upload Assets replacing form submissions
  const assetsForm = document.getElementById('settings-assets-form');
  assetsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('btn-submit-assets');
    saveBtn.disabled = true;
    saveBtn.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).deployingAssets;

    const formData = new FormData(assetsForm);
    try {
      const response = await fetch('/api/settings/assets', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await safeParseJson(response);
        if (result) {
          playSubmitSaveSound();
          alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertAssetsSuccess);
          await loadSettingsFromServer();
          // Clear file selections
          assetsForm.reset();
        } else {
          alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertAssetsReject);
        }
      } else {
        alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertAssetsReject);
      }
    } catch (err) {
      console.error(err);
      alert((TRANSLATIONS[currentLang] || TRANSLATIONS.ja).alertAssetsError);
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).saveAssets;
    }
  });

  // Toggle Background BGM Loop Sound Control
  const bgmBtn = document.getElementById('bgm-ctrl-btn');
  bgmBtn.addEventListener('click', () => {
    const stateSpan = document.getElementById('bgm-status-text');
    if (!isBgmPlaying) {
      isBgmPlaying = true;
      if (stateSpan) stateSpan.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).on;
      bgmBtn.style.borderColor = '#00ff66';
      bgmBtn.style.color = '#00ff66';
      startLoopingMusic();
    } else {
      isBgmPlaying = false;
      if (stateSpan) stateSpan.innerText = (TRANSLATIONS[currentLang] || TRANSLATIONS.ja).off;
      bgmBtn.style.borderColor = '#00f2ff';
      bgmBtn.style.color = '#00f2ff';
      stopLoopingMusic();
    }
  });

  // Modal Lightbox controller close hooks
  document.getElementById('lightbox-close-btn').addEventListener('click', () => {
    document.getElementById('lightbox-modal').style.display = 'none';
  });
  document.getElementById('lightbox-modal').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox-modal') {
      document.getElementById('lightbox-modal').style.display = 'none';
    }
  });
}

// Manage tab UI display states toggler
function switchActiveTab(targetTab) {
  // Hide all screens
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(elm => {
    elm.classList.add('hidden');
    elm.classList.remove('block');
  });

  // Show active screen
  const activeSection = document.getElementById(`tab-${targetTab}`);
  if (activeSection) {
    activeSection.classList.remove('hidden');
    activeSection.classList.add('block');
  }

  // Update navbar visual indicators
  const navButtons = document.querySelectorAll('.stats-tab-nav');
  navButtons.forEach(btn => {
    const anchor = btn.getAttribute('data-tab');
    if (anchor === targetTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Special refreshers
}

// Generate Timeline Record Card listings dynamically
function renderTimelineLayout() {
  const dictionary = TRANSLATIONS[currentLang] || TRANSLATIONS.ja;
  const container = document.getElementById('timeline-container');
  container.innerHTML = "";

  if (scoreRecordsList.length === 0) {
    container.innerHTML = `
      <div class="border-2 border-dashed border-[#005a70] p-6 text-center text-[#005a70]">
        ${dictionary.noRecordsYet}
      </div>
    `;
    document.getElementById('timeline-count').innerText = dictionary.recsTemplate.replace('{count}', '0');
    return;
  }

  document.getElementById('timeline-count').innerText = dictionary.recsTemplate.replace('{count}', scoreRecordsList.length);

  scoreRecordsList.forEach(rec => {
    const cardEl = document.createElement('div');
    
    // Choose border colors mirroring Rockman or Zero theme styles
    let borderClass = 'border-neon-cyan';
    let labelColor = 'text-[#00f2ff] glow-text-blue';
    let outcomeText = dictionary.outcomeDraw;
    let avatarName = dictionary.avatarSystem;

    if (rec.type === 'win') {
      borderClass = 'border-[#00f2ff] neon-border-blue';
      labelColor = 'text-[#00f2ff] glow-text-blue';
      outcomeText = dictionary.outcomeWin;
      avatarName = dictionary.avatarX;
    } else if (rec.type === 'loss') {
      borderClass = 'border-[#ff0055] neon-border-red';
      labelColor = 'text-[#ff0055] glow-text-red font-bold';
      outcomeText = dictionary.outcomeLoss;
      avatarName = dictionary.avatarZero;
    }

    // Format date string beautifully
    const recordDateString = new Date(rec.created_at).toLocaleString();

    cardEl.className = `x4-hero-panel ${borderClass} p-3 flex flex-col relative my-1`;
    cardEl.innerHTML = `
      <div class="x4-corner-bracket"></div>
      <div class="flex justify-between items-start mb-1 gap-2">
        <div class="flex items-center gap-1">
          <span class="font-bold uppercase text-[10px] ${labelColor}">${outcomeText}</span>
        </div>
        <span class="font-mono text-[8px] text-[#005a70]">${recordDateString}</span>
      </div>
      <p class="text-white text-[10px] font-mono leading-relaxed mt-1 mb-2 whitespace-pre-wrap">${rec.reason || dictionary.noComments}</p>
      
      ${rec.image_path ? `
        <div class="w-full flex justify-start my-1.5">
          <div class="max-w-[120px] max-h-[90px] overflow-hidden border border-[#00f2ff] bg-black cursor-pointer rounded scale-button duration-200 hover:scale-105 select-none proof-image" data-src="${rec.image_path}">
            <img src="${rec.image_path}" class="w-full h-full object-cover" alt="Voucher screenshot" referrerPolicy="no-referrer">
          </div>
        </div>
      ` : ''}

      <div class="flex justify-end gap-2 mt-1">
        <button class="pixel-btn pixel-btn-red text-[8px] py-0.5 px-2 delete-record-action-btn" data-id="${rec.id}">
          ${dictionary.deleteBtnText}
        </button>
      </div>
    `;

    container.appendChild(cardEl);
  });

  // Bind individual image lightbox click hooks
  const images = container.querySelectorAll('.proof-image');
  images.forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('data-src');
      document.getElementById('lightbox-img').src = src;
      document.getElementById('lightbox-modal').style.display = 'flex';
    });
  });

  // Bind deletion action APIs
  const deleteBtnElements = container.querySelectorAll('.delete-record-action-btn');
  deleteBtnElements.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm(dictionary.confirmDelete)) {
        try {
          const res = await fetch(`/api/records/${id}`, { method: 'DELETE' });
          if (res.ok) {
            playSynthesizedLossSound();
            refreshRecords();
          } else {
            alert(dictionary.alertDeleteFailure);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  });
}

// Filter and recalculate stats dimensions based on period selectors
function updateStatisticsMetrics(period = 'day') {
  const now = new Date();
  let filteredRecords = [];

  // Categorize logic based on local timestamp
  if (period === 'day') {
    filteredRecords = scoreRecordsList.filter(rec => {
      const recDate = new Date(rec.created_at);
      return recDate.toDateString() === now.toDateString();
    });
  } else if (period === 'week') {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredRecords = scoreRecordsList.filter(rec => {
      return new Date(rec.created_at) >= oneWeekAgo;
    });
  } else if (period === 'month') {
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredRecords = scoreRecordsList.filter(rec => {
      return new Date(rec.created_at) >= oneMonthAgo;
    });
  }

  // Count victories vs defeats
  const wins = filteredRecords.filter(r => r.type === 'win').length;
  const losses = filteredRecords.filter(r => r.type === 'loss').length;
  const draws = filteredRecords.filter(r => r.type === 'draw').length;
  const total = wins + losses;

  // Render text counts
  safeSetInnerText('stat-val-win', wins);
  safeSetInnerText('stat-val-loss', losses);
  
  const winRatePercentageValue = total === 0 ? 0 : Math.round((wins / total) * 100);
  safeSetInnerText('stat-val-rate', `${winRatePercentageValue}%`);

  // Render Dynamic Meme block according to outcome
  const memeImg = document.getElementById('stats-meme-display');
  const quoteDiv = document.getElementById('stats-meme-quote');
  const badgeSpan = document.getElementById('stats-status-badge');
  const dictionary = TRANSLATIONS[currentLang] || TRANSLATIONS.ja;

  if (wins > losses) {
    // Win Status
    if (memeImg) memeImg.src = backendSettings.win_meme_url || '/defaults/images/rockman_win.png';
    if (badgeSpan) {
      badgeSpan.innerText = dictionary.statusWin;
      badgeSpan.style.color = '#00f2ff';
      badgeSpan.classList.add('glow-text-blue');
      badgeSpan.classList.remove('glow-text-red');
    }
    
    const activeQuote = getLocalizedQuote(backendSettings.win_meme_quote, dictionary.statusWin);
    if (quoteDiv) quoteDiv.innerText = `"${activeQuote}"`;
  } else if (wins < losses) {
    // Loss Status
    if (memeImg) memeImg.src = backendSettings.loss_meme_url || '/defaults/images/zero_lose.png';
    if (badgeSpan) {
      badgeSpan.innerText = dictionary.statusLoss;
      badgeSpan.style.color = '#ff0055';
      badgeSpan.classList.add('glow-text-red');
      badgeSpan.classList.remove('glow-text-blue');
    }

    const activeQuote = getLocalizedQuote(backendSettings.loss_meme_quote, dictionary.statusLoss);
    if (quoteDiv) quoteDiv.innerText = `"${activeQuote}"`;
  } else {
    // Equal Draw Status (including 0 records)
    if (memeImg) memeImg.src = backendSettings.draw_meme_url || '/defaults/images/tie_meme.png';
    if (badgeSpan) {
      badgeSpan.innerText = dictionary.statusEqual;
      badgeSpan.style.color = '#d63bff';
      if (badgeSpan.className.includes('glow-text-blue') || badgeSpan.className.includes('glow-text-red')) {
        badgeSpan.classList.remove('glow-text-blue', 'glow-text-red');
      }
    }

    const activeQuote = getLocalizedQuote(backendSettings.draw_meme_quote, dictionary.statusEqual);
    if (quoteDiv) quoteDiv.innerText = `"${activeQuote}"`;
  }
}

// PWA Installer toaster configurations hook
let deferredPromptInstance = null;
function setupPWAInstaller() {
  const tokenToast = document.getElementById('pwa-toast');
  const btnInstall = document.getElementById('btn-pwa-install');
  const btnClose = document.getElementById('btn-pwa-close');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPromptInstance = e;
    
    // Display our pixel PWA prompt
    tokenToast.classList.add('opacity-100', 'translate-y-0');
    tokenToast.classList.remove('pointer-events-none');
    playSynthesizedWinSound();
  });

  btnInstall.addEventListener('click', async () => {
    if (deferredPromptInstance) {
      deferredPromptInstance.prompt();
      const choice = await deferredPromptInstance.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('User embraced direct application installation.');
      }
      deferredPromptInstance = null;
    }
    closeToast();
  });

  btnClose.addEventListener('click', () => {
    closeToast();
    playSynthesizedTick();
  });

  function closeToast() {
    tokenToast.classList.add('opacity-0', 'pointer-events-none');
    tokenToast.classList.remove('opacity-100', 'translate-y-0');
  }
}


// AUDIO ENGINE - 16-BIT REAL-TIME SYNTHESIS (WEB AUDIO API)

// Ascent scale selection click melody
function playSynthesizedWinSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // Ascending C Major-ish arpeggios
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square'; // 16-bit arcade chip buzz
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);
    
    gain.gain.setValueAtTime(0.08, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.05);
    osc.stop(now + (idx + 1.5) * 0.05);
  });
}

// Descending chord defeat arpeggios
function playSynthesizedLossSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  const notes = [311.13, 293.66, 246.94, 196.00, 155.56]; // Heavy epic falling minor arps
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + idx * 0.075);
    
    gain.gain.setValueAtTime(0.12, now + idx * 0.075);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1.3) * 0.075);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.075);
    osc.stop(now + (idx + 1.5) * 0.075);
  });
}

// Light menu ticking audio tone
function playSynthesizedTick() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.value = 880;
  
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

// Snappy arcade selection sound for WIN
function playSynthesizedSelectWinSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  
  // Quick double ascending high pitches
  const pitches = [523.25, 659.25, 783.99]; // C5, E5, G5
  pitches.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);
    
    gain.gain.setValueAtTime(0.07, now + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.06);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + idx * 0.06);
    osc.stop(now + (idx + 1) * 0.06 + 0.03);
  });
}

// Low buzz selection sound for LOSS
function playSynthesizedSelectLossSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  
  // Quick descending flat warm alarm buzz
  const pitches = [293.66, 220.00]; // D4, A3
  pitches.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + idx * 0.09);
    
    gain.gain.setValueAtTime(0.06, now + idx * 0.09);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * 0.09);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + idx * 0.09);
    osc.stop(now + (idx + 1) * 0.09 + 0.03);
  });
}

// Custom and fallback audio players for newly requested features
function playTabSelectSound() {
  const chosenPath = (backendSettings && backendSettings.tab_sound_path) || '/defaults/sounds/tab.mp3';
  const audio = new Audio(chosenPath);
  audio.volume = 0.55;
  audio.play().catch(() => playSynthesizedTabSound());
}

function playSynthesizedTabSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  
  // High-pitch sci-fi bubble blip
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
  
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.09);
}

function playRecordSelectWinSound() {
  const chosenPath = (backendSettings && backendSettings.select_win_sound_path) || '/defaults/sounds/select_win.mp3';
  const audio = new Audio(chosenPath);
  audio.volume = 0.55;
  audio.play().catch(() => playSynthesizedSelectWinSound());
}

function playRecordSelectLossSound() {
  const chosenPath = (backendSettings && backendSettings.select_loss_sound_path) || '/defaults/sounds/select_loss.mp3';
  const audio = new Audio(chosenPath);
  audio.volume = 0.55;
  audio.play().catch(() => playSynthesizedSelectLossSound());
}

function playSubmitSaveSound() {
  const chosenPath = (backendSettings && backendSettings.submit_sound_path) || '/defaults/sounds/submit.mp3';
  const audio = new Audio(chosenPath);
  audio.volume = 0.55;
  audio.play().catch(() => playSynthesizedSubmitSaveSound());
}

function playSynthesizedSubmitSaveSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const now = ctx.currentTime;
  
  // Beautiful retro RPG/arcade success chime
  const frequencies = [330, 392, 660, 784]; // E4, G4, E5, G5
  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.05);
    
    gain.gain.setValueAtTime(0.06, now + idx * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now + idx * 0.05);
    osc.stop(now + idx * 0.05 + 0.18);
  });
}

// Play custom sound files if present, otherwise trigger synth oscillators
function playResultTheme(isWin) {
  if (isWin) {
    const chosenPath = backendSettings.win_sound_path || '/defaults/sounds/win.mp3';
    const audio = new Audio(chosenPath);
    audio.volume = 0.55;
    audio.play().catch(() => playSynthesizedWinSound());
  } else {
    const chosenPath = backendSettings.loss_sound_path || '/defaults/sounds/loss.mp3';
    const audio = new Audio(chosenPath);
    audio.volume = 0.55;
    audio.play().catch(() => playSynthesizedLossSound());
  }
}

// Start BGM Loop
function startLoopingMusic() {
  if (customBgmInstance) {
    customBgmInstance.pause();
  }
  const bgmPath = backendSettings.bgm_path || '/defaults/sounds/bgm.mp3';
  customBgmInstance = new Audio(bgmPath);
  customBgmInstance.loop = true;
  customBgmInstance.volume = 0.35;

  let fallbackTriggered = false;
  const triggerFallback = () => {
    if (fallbackTriggered) return;
    fallbackTriggered = true;
    playSynthBgmContinuous();
  };

  customBgmInstance.addEventListener('error', () => {
    triggerFallback();
  });

  customBgmInstance.play().catch(err => {
    console.warn('BGM path playback failed (might be 404 or gesture constraint). Fallbacking to Synth:', err);
    triggerFallback();
  });
}

// Stop BGM Loop
function stopLoopingMusic() {
  if (customBgmInstance) {
    customBgmInstance.pause();
    customBgmInstance = null;
  }
  stopSynthBgmContinuous();
}

// Generate continuous 16-bit retro rhythm bassline chiptune
function playSynthBgmContinuous() {
  if (synthesizedIntervalId) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  
  currentSynthAudioCtx = new AudioContextClass();
  const bassRhythmNotes = [110.00, 110.00, 130.81, 146.83, 110.00, 110.00, 98.00, 82.41]; // Retro Rockman Stage Bass sequence
  let sequenceStep = 0;

  synthesizedIntervalId = setInterval(() => {
    if (!currentSynthAudioCtx) return;
    
    const osc = currentSynthAudioCtx.createOscillator();
    const gain = currentSynthAudioCtx.createGain();
    
    // Low frequency triangle waves
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(bassRhythmNotes[sequenceStep % bassRhythmNotes.length], currentSynthAudioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.06, currentSynthAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, currentSynthAudioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(currentSynthAudioCtx.destination);
    
    osc.start();
    osc.stop(currentSynthAudioCtx.currentTime + 0.33);
    
    sequenceStep++;
  }, 350); // 170 BPM tempo feel
}

function stopSynthBgmContinuous() {
  if (synthesizedIntervalId) {
    clearInterval(synthesizedIntervalId);
    synthesizedIntervalId = null;
  }
  if (currentSynthAudioCtx) {
    currentSynthAudioCtx.close().catch(() => {});
    currentSynthAudioCtx = null;
  }
}

// Register Progressive Web App Service Worker
const isDevDomain = window.location.hostname.includes('localhost') || 
                    window.location.hostname.includes('127.0.0.1') || 
                    window.location.hostname.includes('ais-dev') || 
                    window.location.hostname.includes('ais-pre');

if ('serviceWorker' in navigator) {
  if (isDevDomain) {
    // During development/preview within AI Studio, unregister existing service worker and delete cache 
    // to prevent iframe reload lags and ensure instant real-time code updates.
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const registration of registrations) {
        registration.unregister().then(() => {
          console.log('[X4 PWA] Unregistered service worker for live development updates.');
        });
      }
    });
    if ('caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(key => caches.delete(key));
      });
    }
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('[X4 PWA] Service Worker registered in scope:', reg.scope))
        .catch(err => console.error('[X4 PWA] Service Worker registration failed:', err));
    });
  }
}

