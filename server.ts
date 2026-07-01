import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

let supabase: any = null;

function getSupabase(): any {
  if (supabase) return supabase;
  const url = process.env.VITE_SUPABASE_URL || '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
  if (url && anonKey && url.startsWith('http')) {
    try {
      supabase = createClient(url, anonKey);
      console.log('[Supabase Client] Lazily initialized successfully with configured credentials.');
      return supabase;
    } catch (err: any) {
      console.error('[Supabase Client] Failed to create client on lazy initialization:', err.message);
    }
  }
  return null;
}

const app = express();
const PORT = 3000;

// Resolve paths
let myDirname = '';
try {
  myDirname = path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  myDirname = __dirname;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ASSETS_DIR = path.join(DATA_DIR, 'assets');

// Resolve the correct public defaults directory based on NODE_ENV (production loads from dist)
const PUBLIC_DEFAULTS_DIR = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), 'dist', 'defaults')
  : path.join(process.cwd(), 'public', 'defaults');

const PUBLIC_IMAGES_DIR = path.join(PUBLIC_DEFAULTS_DIR, 'images');
const PUBLIC_SOUNDS_DIR = path.join(PUBLIC_DEFAULTS_DIR, 'sounds');

// Ensure database and assets directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_SOUNDS_DIR)) {
  fs.mkdirSync(PUBLIC_SOUNDS_DIR, { recursive: true });
}

// 1. Copy default pre-generated pixel art images to public defaults folder if it's currently empty
const defaultMapping = [
  { src: 'win.png', dest: 'win.png' },
  { src: 'loss.png', dest: 'loss.png' },
  { src: 'tie.png', dest: 'tie.png' }
];

for (const map of defaultMapping) {
  const sourcePath = path.join(process.cwd(), 'src', 'assets', 'images', map.src);
  if (fs.existsSync(sourcePath)) {
    const targetPublicPath = path.join(PUBLIC_IMAGES_DIR, map.dest);
    if (!fs.existsSync(targetPublicPath)) {
      try {
        fs.copyFileSync(sourcePath, targetPublicPath);
        console.log(`Copied default image ${map.src} to public defaults: ${targetPublicPath}`);
      } catch (err) {
        console.error(`Failed to copy to public defaults: ${map.src}`, err);
      }
    }
  }
}

// 2. Scan and copy external runtime defaults if mounted (e.g., via docker-compose - ./defaults:/app/defaults)
function copyRuntimeVolumeDefaults() {
  const RUNTIME_DEFAULTS_DIR = '/app/defaults';
  if (!fs.existsSync(RUNTIME_DEFAULTS_DIR)) return;

  console.log(`Detected runtime default overrides mounted at: ${RUNTIME_DEFAULTS_DIR}`);

  // Helper to copy files to target dir with logging
  const copyFileToDest = (src: string, destDir: string, filename: string) => {
    try {
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      const destPath = path.join(destDir, filename);
      fs.copyFileSync(src, destPath);
      console.log(`Overrode default asset with custom volume file: ${filename} -> ${destPath}`);
    } catch (err) {
      console.error(`Failed to copy runtime custom default ${filename}:`, err);
    }
  };

  // 1. Process files in standard subdirectories if they exist
  const runtimeImagesDir = path.join(RUNTIME_DEFAULTS_DIR, 'images');
  if (fs.existsSync(runtimeImagesDir)) {
    try {
      const files = fs.readdirSync(runtimeImagesDir);
      files.forEach(file => {
        const src = path.join(runtimeImagesDir, file);
        if (fs.statSync(src).isFile()) {
          copyFileToDest(src, PUBLIC_IMAGES_DIR, file);
        }
      });
    } catch (e) {
      console.error('Error reading runtime defaults images/', e);
    }
  }

  const runtimeSoundsDir = path.join(RUNTIME_DEFAULTS_DIR, 'sounds');
  if (fs.existsSync(runtimeSoundsDir)) {
    try {
      const files = fs.readdirSync(runtimeSoundsDir);
      files.forEach(file => {
        const src = path.join(runtimeSoundsDir, file);
        if (fs.statSync(src).isFile()) {
          copyFileToDest(src, PUBLIC_SOUNDS_DIR, file);
        }
      });
    } catch (e) {
      console.error('Error reading runtime defaults sounds/', e);
    }
  }

  // 2. Support flat directory mapping by extension (helpful for simple flat directories)
  try {
    const rootFiles = fs.readdirSync(RUNTIME_DEFAULTS_DIR);
    rootFiles.forEach(file => {
      const src = path.join(RUNTIME_DEFAULTS_DIR, file);
      if (fs.statSync(src).isFile()) {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          copyFileToDest(src, PUBLIC_IMAGES_DIR, file);
        } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
          copyFileToDest(src, PUBLIC_SOUNDS_DIR, file);
        }
      }
    });
  } catch (e) {
    console.error('Error reading runtime defaults root folder:', e);
  }
}

// 3. Automatically copy ALL files from default directories to persistent volume assets (/uploads/*) if missing
function copyAllDefaultsToPersistent() {
  if (fs.existsSync(PUBLIC_IMAGES_DIR)) {
    try {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
      files.forEach((file) => {
        const srcPath = path.join(PUBLIC_IMAGES_DIR, file);
        const destPath = path.join(ASSETS_DIR, file);
        if (fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Auto-mirrored default image ${file} to persistent assets: ${destPath}`);
        }
      });
    } catch (e) {
      console.error('Error copying default images to persistent volume:', e);
    }
  }

  if (fs.existsSync(PUBLIC_SOUNDS_DIR)) {
    try {
      const files = fs.readdirSync(PUBLIC_SOUNDS_DIR);
      files.forEach((file) => {
        const srcPath = path.join(PUBLIC_SOUNDS_DIR, file);
        const destPath = path.join(ASSETS_DIR, file);
        if (fs.statSync(srcPath).isFile() && !fs.existsSync(destPath)) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Auto-mirrored default sound ${file} to persistent assets: ${destPath}`);
        }
      });
    } catch (e) {
      console.error('Error copying default sounds to persistent volume:', e);
    }
  }
}

copyRuntimeVolumeDefaults();
copyAllDefaultsToPersistent();

// Pure JS/TS file-based JSON database engine for 100% hosting environment reliability without binary conflicts
class LocalJsonDatabase {
  private recordsFile = path.join(DATA_DIR, 'records.json');
  private settingsFile = path.join(DATA_DIR, 'settings.json');
  private userSettingsFile = path.join(DATA_DIR, 'user_settings.json');

  constructor() {
    this.init();
    this.migrateFromSqlite();
  }

  private init() {
    if (!fs.existsSync(this.recordsFile)) {
      fs.writeFileSync(this.recordsFile, JSON.stringify([], null, 2), 'utf-8');
    }
    if (!fs.existsSync(this.userSettingsFile)) {
      fs.writeFileSync(this.userSettingsFile, JSON.stringify({}, null, 2), 'utf-8');
    }
    if (!fs.existsSync(this.settingsFile)) {
      const extWin = fs.existsSync(path.join(ASSETS_DIR, 'win.jpg')) ? 'win.jpg' : 'win.png';
      const extLoss = fs.existsSync(path.join(ASSETS_DIR, 'loss.jpg')) ? 'loss.jpg' : 'loss.png';
      const extTie = fs.existsSync(path.join(ASSETS_DIR, 'tie.jpg')) ? 'tie.jpg' : 'tie.png';

      const extBgm = fs.existsSync(path.join(ASSETS_DIR, 'bgm.mp3')) ? '/uploads/bgm.mp3' : '';
      const extWinSound = fs.existsSync(path.join(ASSETS_DIR, 'winloss.mp3')) ? '/uploads/winloss.mp3' : '';
      const extLossSound = fs.existsSync(path.join(ASSETS_DIR, 'winloss.mp3')) ? '/uploads/winloss.mp3' : '';
      const extTabSound = fs.existsSync(path.join(ASSETS_DIR, 'tab.mp3')) ? '/uploads/tab.mp3' : '';
      const extSubmitSound = fs.existsSync(path.join(ASSETS_DIR, 'submit.mp3')) ? '/uploads/submit.mp3' : '';

      const defaultSettings = [
        { key: 'win_meme_url', value: `/uploads/${extWin}` },
        { key: 'win_meme_quote', value: '不愧是你！|Excellent work!|さすがですね！' },
        { key: 'loss_meme_url', value: `/uploads/${extLoss}` },
        { key: 'loss_meme_quote', value: '投降輸一半|Mission Failed...|何者なんだ、これ...' },
        { key: 'draw_meme_url', value: `/uploads/${extTie}` },
        { key: 'draw_meme_quote', value: '沒輸沒營|Double KO!|勝負つかず...' },
        { key: 'lang', value: 'ja' },
        { key: 'bgm_path', value: extBgm },
        { key: 'win_sound_path', value: extWinSound },
        { key: 'loss_sound_path', value: extLossSound },
        { key: 'tab_sound_path', value: extTabSound },
        { key: 'submit_sound_path', value: extSubmitSound }
      ];
      const settingsObj: Record<string, string> = {};
      defaultSettings.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      fs.writeFileSync(this.settingsFile, JSON.stringify(settingsObj, null, 2), 'utf-8');
    }
  }

  // Gracefully attempt migrating legacy SQLite data if it exists
  private migrateFromSqlite() {
    const dbPath = path.join(DATA_DIR, 'winloss.db');
    if (!fs.existsSync(dbPath)) return;

    try {
      // Dynamic import to prevent crash if sqlite3 binary of target architecture is totally missing
      const moduleName = 'sqlite3';
      import(moduleName).then((sqlite3Module) => {
        const sqlite3 = sqlite3Module.default || sqlite3Module;
        const tempDb = new (sqlite3 as any).Database(dbPath, (sqlite3 as any).OPEN_READONLY, (err: any) => {
          if (err) return;

          // Migrate settings
          tempDb.all('SELECT * FROM settings', [], (errSettings: any, settingsRows: any[]) => {
            if (!errSettings && Array.isArray(settingsRows)) {
              const currentSettings = this.getSettings();
              settingsRows.forEach(row => {
                if (row && row.key) currentSettings[row.key] = row.value;
              });
              fs.writeFileSync(this.settingsFile, JSON.stringify(currentSettings, null, 2), 'utf-8');
            }

            // Migrate records
            tempDb.all('SELECT * FROM records', [], (errRecords: any, recordsRows: any[]) => {
              if (!errRecords && Array.isArray(recordsRows)) {
                const currentRecords = this.getRecords();
                recordsRows.forEach(row => {
                  if (row && row.id && !currentRecords.some(r => r.id === row.id)) {
                    currentRecords.push({
                      id: row.id,
                      type: row.type || 'win',
                      reason: row.reason || '',
                      image_path: row.image_path || null,
                      created_at: row.created_at || new Date().toISOString()
                    });
                  }
                });
                fs.writeFileSync(this.recordsFile, JSON.stringify(currentRecords, null, 2), 'utf-8');
              }
              tempDb.close();
              // Rename old db file so we don't keep running migration
              try {
                fs.renameSync(dbPath, path.join(DATA_DIR, 'winloss.db.migrated'));
                console.log('Successfully completed SQLite to JSON database auto-migration.');
              } catch (e) {}
            });
          });
        });
      }).catch(() => {
        // Safe failover if package is unresolvable or missing binary
        console.log('SQLite3 module not available for data migration, starting fresh.');
      });
    } catch (e) {
      console.log('Safe fallback on sqlite migration failure.');
    }
  }

  private getRecordsAll(): any[] {
    try {
      if (!fs.existsSync(this.recordsFile)) {
        return [];
      }
      const data = fs.readFileSync(this.recordsFile, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  getRecords(userId?: string): any[] {
    try {
      const records = this.getRecordsAll();
      const filtered = records.filter((r: any) => {
        if (userId) {
          return r.user_id === userId;
        }
        return !r.user_id;
      });
      return filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
      return [];
    }
  }

  getRecordById(id: number, userId?: string): any {
    const records = this.getRecordsAll();
    const record = records.find(r => r.id === id);
    if (!record) return null;
    if (userId && record.user_id !== userId) return null;
    if (!userId && record.user_id) return null;
    return record;
  }

  addRecord(type: string, reason: string, image_path: string | null, userId?: string): any {
    const records = this.getRecordsAll();
    const nextId = records.length > 0 ? Math.max(...records.map((r: any) => r.id)) + 1 : 1;
    const newRecord = {
      id: nextId,
      type,
      reason: reason || '',
      image_path,
      user_id: userId || null,
      created_at: new Date().toISOString()
    };
    records.push(newRecord);
    fs.writeFileSync(this.recordsFile, JSON.stringify(records, null, 2), 'utf-8');
    return newRecord;
  }

  deleteRecord(id: number, userId?: string): boolean {
    const records = this.getRecordsAll();
    const index = records.findIndex(r => r.id === id && (userId ? r.user_id === userId : !r.user_id));
    if (index !== -1) {
      records.splice(index, 1);
      fs.writeFileSync(this.recordsFile, JSON.stringify(records, null, 2), 'utf-8');
      return true;
    }
    return false;
  }

  private applyDynamicSettingsDefaults(settings: Record<string, string>): Record<string, string> {
    const copy = { ...settings };
    
    // Dynamic defaults for images
    if (fs.existsSync(path.join(ASSETS_DIR, 'win.jpg'))) {
      if (!copy['win_meme_url'] || copy['win_meme_url'].endsWith('win.png')) {
        copy['win_meme_url'] = '/uploads/win.jpg';
      }
    }
    if (fs.existsSync(path.join(ASSETS_DIR, 'loss.jpg'))) {
      if (!copy['loss_meme_url'] || copy['loss_meme_url'].endsWith('loss.png')) {
        copy['loss_meme_url'] = '/uploads/loss.jpg';
      }
    }
    if (fs.existsSync(path.join(ASSETS_DIR, 'tie.jpg'))) {
      if (!copy['draw_meme_url'] || copy['draw_meme_url'].endsWith('tie.png')) {
        copy['draw_meme_url'] = '/uploads/tie.jpg';
      }
    }

    // Dynamic defaults for audios
    if (fs.existsSync(path.join(ASSETS_DIR, 'bgm.mp3')) && !copy['bgm_path']) {
      copy['bgm_path'] = '/uploads/bgm.mp3';
    }
    if (fs.existsSync(path.join(ASSETS_DIR, 'winloss.mp3'))) {
      if (!copy['win_sound_path']) copy['win_sound_path'] = '/uploads/winloss.mp3';
      if (!copy['loss_sound_path']) copy['loss_sound_path'] = '/uploads/winloss.mp3';
    }
    if (fs.existsSync(path.join(ASSETS_DIR, 'tab.mp3')) && !copy['tab_sound_path']) {
      copy['tab_sound_path'] = '/uploads/tab.mp3';
    }
    if (fs.existsSync(path.join(ASSETS_DIR, 'submit.mp3')) && !copy['submit_sound_path']) {
      copy['submit_sound_path'] = '/uploads/submit.mp3';
    }

    return copy;
  }

  getSettings(userId?: string): Record<string, string> {
    let globalSettings: Record<string, string> = {};
    try {
      if (fs.existsSync(this.settingsFile)) {
        const data = fs.readFileSync(this.settingsFile, 'utf-8');
        globalSettings = JSON.parse(data);
      }
    } catch (e) {}

    let finalSettings = { ...globalSettings };

    if (userId) {
      try {
        if (fs.existsSync(this.userSettingsFile)) {
          const userSettingsData = fs.readFileSync(this.userSettingsFile, 'utf-8');
          const userSettingsMap = JSON.parse(userSettingsData);
          if (userSettingsMap[userId]) {
            finalSettings = { ...globalSettings, ...userSettingsMap[userId] };
          }
        }
      } catch (e) {}
    }

    return this.applyDynamicSettingsDefaults(finalSettings);
  }

  updateSettings(updates: Record<string, string>, userId?: string) {
    if (!userId) {
      const settings = this.getSettings();
      for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'string') {
          settings[key] = value;
        }
      }
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
      return;
    }

    try {
      let userSettingsMap: Record<string, any> = {};
      if (fs.existsSync(this.userSettingsFile)) {
        const userSettingsData = fs.readFileSync(this.userSettingsFile, 'utf-8');
        userSettingsMap = JSON.parse(userSettingsData);
      }
      if (!userSettingsMap[userId]) {
        userSettingsMap[userId] = {};
      }
      for (const [key, value] of Object.entries(updates)) {
        if (typeof value === 'string') {
          userSettingsMap[userId][key] = value;
        }
      }
      fs.writeFileSync(this.userSettingsFile, JSON.stringify(userSettingsMap, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to update user-specific settings', e);
    }
  }
}

const localDb = new LocalJsonDatabase();

class SupabaseDatabase {
  async getRecords(userId?: string): Promise<any[]> {
    const client = getSupabase();
    if (!client) {
      console.log('[SupabaseDatabase] Missing client. Using local database.');
      return localDb.getRecords(userId);
    }
    try {
      let query = client
        .from('winloss_records')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      if (error) {
        console.log('[SupabaseDatabase] getRecords fallback to local database:', error.message);
        return localDb.getRecords(userId);
      }
      return data || [];
    } catch (e: any) {
      console.log('[SupabaseDatabase] getRecords exception fallback to local database:', e.message);
      return localDb.getRecords(userId);
    }
  }

  async getRecordById(id: number, userId?: string): Promise<any> {
    const client = getSupabase();
    if (!client) {
      return localDb.getRecordById(id, userId);
    }
    try {
      let query = client
        .from('winloss_records')
        .select('*')
        .eq('id', id);
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return localDb.getRecordById(id, userId);
      }
      return data[0];
    } catch (e: any) {
      console.log('[SupabaseDatabase] getRecordById info:', e.message);
      return localDb.getRecordById(id, userId);
    }
  }

  async addRecord(type: string, reason: string, image_path: string | null, userId?: string): Promise<any> {
    const client = getSupabase();
    if (!client) {
      const result = await localDb.addRecord(type, reason, image_path, userId);
      return { ...result, _supabase_status: 'not_configured' };
    }
    try {
      const recordToInsert = {
        type,
        reason: reason || '',
        image_path,
        user_id: userId || null
      };
      
      const { data, error } = await client
        .from('winloss_records')
        .insert(recordToInsert)
        .select();
        
      if (error) {
        console.log('[SupabaseDatabase] addRecord info:', error.message);
        const result = await localDb.addRecord(type, reason, image_path, userId);
        return { 
          ...result, 
          _supabase_status: 'error', 
          _supabase_error: error.message,
          _supabase_error_details: error.details,
          _supabase_error_hint: error.hint
        };
      }
      return data ? { ...data[0], _supabase_status: 'synced' } : { ...recordToInsert, _supabase_status: 'synced_partial' };
    } catch (e: any) {
      console.log('[SupabaseDatabase] addRecord info:', e.message);
      const result = await localDb.addRecord(type, reason, image_path, userId);
      return { ...result, _supabase_status: 'exception', _supabase_error: e.message };
    }
  }

  async deleteRecord(id: number, userId?: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) {
      return localDb.deleteRecord(id, userId);
    }
    try {
      let query = client
        .from('winloss_records')
        .delete()
        .eq('id', id);
        
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        query = query.is('user_id', null);
      }
      
      const { error } = await query;
      if (error) {
        console.log('[SupabaseDatabase] deleteRecord info:', error.message);
        return localDb.deleteRecord(id, userId);
      }
      return true;
    } catch (e: any) {
      console.log('[SupabaseDatabase] deleteRecord info:', e.message);
      return localDb.deleteRecord(id, userId);
    }
  }

  async getSettings(userId?: string): Promise<Record<string, string>> {
    const baseSettings = localDb.getSettings();
    const client = getSupabase();
    if (!client) {
      return localDb.getSettings(userId);
    }
    try {
      // 1. Fetch global settings
      const { data: globalData, error: globalErr } = await client
        .from('winloss_settings')
        .select('key, value')
        .eq('user_id', 'global');
        
      if (globalErr) {
        console.log('[SupabaseDatabase] getSettings (global) info:', globalErr.message);
      } else if (globalData) {
        globalData.forEach((row: any) => {
          baseSettings[row.key] = row.value;
        });
      }
      
      // 2. Fetch user overrides
      if (userId) {
        const { data: userData, error: userErr } = await client
          .from('winloss_settings')
          .select('key, value')
          .eq('user_id', userId);
          
        if (userErr) {
          console.log(`[SupabaseDatabase] getSettings (user: ${userId}) info:`, userErr.message);
        } else if (userData) {
          userData.forEach((row: any) => {
            baseSettings[row.key] = row.value;
          });
        }
      }
      return baseSettings;
    } catch (e: any) {
      console.log('[SupabaseDatabase] getSettings info:', e.message);
      return localDb.getSettings(userId);
    }
  }

  async updateSettings(updates: Record<string, string>, userId?: string): Promise<void> {
    localDb.updateSettings(updates, userId);
    const client = getSupabase();
    if (!client) {
      return;
    }
    const targetUserId = userId || 'global';
    try {
      const rowsToUpsert = Object.entries(updates).map(([key, value]) => ({
        user_id: targetUserId,
        key,
        value: String(value)
      }));
      
      if (rowsToUpsert.length > 0) {
        const { error } = await client
          .from('winloss_settings')
          .upsert(rowsToUpsert, { onConflict: 'user_id,key' });
          
        if (error) {
          console.log('[SupabaseDatabase] updateSettings info:', error.message);
        } else {
          console.log(`[SupabaseDatabase] Synced ${rowsToUpsert.length} settings to Supabase for ${targetUserId}.`);
        }
      }
    } catch (e: any) {
      console.log('[SupabaseDatabase] updateSettings info:', e.message);
    }
  }
}

const db = new SupabaseDatabase();

// Setup Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve custom user-uploaded assets from the data folder
app.use('/uploads', express.static(ASSETS_DIR));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ASSETS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// API Endpoints

// GET health status check with extensive Supabase diagnostic test
app.get('/api/health', async (req, res) => {
  let supabaseStatus = 'not_configured';
  let supabaseError = null;
  let testQuerySuccess = false;

  const client = getSupabase();
  if (client) {
    supabaseStatus = 'initialized';
    try {
      // Perform a minimal fast query to test the connection and RLS policy compatibility
      const { data, error } = await client
        .from('winloss_records')
        .select('id')
        .limit(1);
        
      if (error) {
        supabaseStatus = 'error';
        supabaseError = {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        };
      } else {
        supabaseStatus = 'connected_ok';
        testQuerySuccess = true;
      }
    } catch (err: any) {
      supabaseStatus = 'exception';
      supabaseError = err.message;
    }
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      has_supabase_url: !!process.env.VITE_SUPABASE_URL,
      has_supabase_anon_key: !!process.env.VITE_SUPABASE_ANON_KEY,
      supabase_url_preview: process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.substring(0, 15)}...` : null
    },
    supabase: {
      status: supabaseStatus,
      error: supabaseError,
      test_query_success: testQuerySuccess
    }
  });
});

// Helper to extract user_id from headers or query parameters for versatile OIDC / multi-tenant execution
const getUserId = (req: express.Request): string | undefined => {
  // 1. Attempt to get verified sub from Authorization Bearer token (Supabase/Unclereal Auth Session)
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (jwtSecret) {
      try {
        const decoded = jwt.verify(token, jwtSecret) as any;
        if (decoded && decoded.sub) {
          return decoded.sub;
        }
      } catch (err: any) {
        console.warn('JWT verification failed (verify error):', err.message);
        try {
          const decoded = jwt.decode(token) as any;
          if (decoded && decoded.sub) {
            return decoded.sub;
          }
        } catch (decodeErr: any) {}
      }
    } else {
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded && decoded.sub) {
          return decoded.sub;
        }
        if (decoded && decoded.id) {
          return decoded.id;
        }
      } catch (err: any) {
        console.warn('JWT decode failed:', err.message);
      }
    }
  }

  // 2. Fallback to older header x-user-id or query parameters
  const val = req.headers['x-user-id'] || req.query.user_id;
  if (typeof val === 'string' && val.trim() !== '') {
    return val.trim();
  }
  return undefined;
};

// GET all records
app.get('/api/records', async (req, res) => {
  try {
    const userId = getUserId(req);
    const rows = await db.getRecords(userId);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST score record (incorporating upload & user context)
app.post('/api/records', upload.single('image'), async (req, res) => {
  const { type, reason } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  if (!type || !['win', 'loss', 'draw'].includes(type)) {
    return res.status(400).json({ error: 'Invalid record type' });
  }

  try {
    const userId = getUserId(req);
    const newRecord = await db.addRecord(type, reason || '', image_path, userId);
    res.json(newRecord);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a score record
app.delete('/api/records/:id', async (req, res) => {
  const idNum = parseInt(req.params.id, 10);
  const userId = getUserId(req);
  
  try {
    const record = await db.getRecordById(idNum, userId);
    if (record && record.image_path) {
      const filename = path.basename(record.image_path);
      const filePath = path.join(ASSETS_DIR, filename);
      // Only delete if it's not our default pre-installed assets
      if (fs.existsSync(filePath) && !['win.png', 'loss.png', 'tie.png'].includes(filename)) {
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) console.warn('Could not delete file:', filePath);
        });
      }
    }
    
    const deleted = await db.deleteRecord(idNum, userId);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found or unauthorized' });
    }
    res.json({ success: true, message: 'Record deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET settings
app.get('/api/settings', async (req, res) => {
  try {
    const userId = getUserId(req);
    const settings = await db.getSettings(userId);
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE settings (text fields)
app.post('/api/settings', async (req, res) => {
  try {
    const userId = getUserId(req);
    await db.updateSettings(req.body, userId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// UPLOAD static setting media assets (memes or audio files)
app.post('/api/settings/assets', upload.fields([
  { name: 'win_meme_image', maxCount: 1 },
  { name: 'loss_meme_image', maxCount: 1 },
  { name: 'draw_meme_image', maxCount: 1 },
  { name: 'bgm_file', maxCount: 1 },
  { name: 'win_sound_file', maxCount: 1 },
  { name: 'loss_sound_file', maxCount: 1 },
  { name: 'tab_sound_file', maxCount: 1 },
  { name: 'select_win_sound_file', maxCount: 1 },
  { name: 'select_loss_sound_file', maxCount: 1 },
  { name: 'submit_sound_file', maxCount: 1 }
]), async (req, res) => {
  const filesObj = req.files as Record<string, Express.Multer.File[]>;
  if (!filesObj) {
    return res.status(400).json({ error: 'No assets uploaded.' });
  }

  const updates: Record<string, string> = {};

  if (filesObj['win_meme_image']) {
    updates['win_meme_url'] = `/uploads/${filesObj['win_meme_image'][0].filename}`;
  }
  if (filesObj['loss_meme_image']) {
    updates['loss_meme_url'] = `/uploads/${filesObj['loss_meme_image'][0].filename}`;
  }
  if (filesObj['draw_meme_image']) {
    updates['draw_meme_url'] = `/uploads/${filesObj['draw_meme_image'][0].filename}`;
  }
  if (filesObj['bgm_file']) {
    updates['bgm_path'] = `/uploads/${filesObj['bgm_file'][0].filename}`;
  }
  if (filesObj['win_sound_file']) {
    updates['win_sound_path'] = `/uploads/${filesObj['win_sound_file'][0].filename}`;
  }
  if (filesObj['loss_sound_file']) {
    updates['loss_sound_path'] = `/uploads/${filesObj['loss_sound_file'][0].filename}`;
  }
  if (filesObj['tab_sound_file']) {
    updates['tab_sound_path'] = `/uploads/${filesObj['tab_sound_file'][0].filename}`;
  }
  if (filesObj['select_win_sound_file']) {
    updates['select_win_sound_path'] = `/uploads/${filesObj['select_win_sound_file'][0].filename}`;
  }
  if (filesObj['select_loss_sound_file']) {
    updates['select_loss_sound_path'] = `/uploads/${filesObj['select_loss_sound_file'][0].filename}`;
  }
  if (filesObj['submit_sound_file']) {
    updates['submit_sound_path'] = `/uploads/${filesObj['submit_sound_file'][0].filename}`;
  }

  try {
    const userId = getUserId(req);
    await db.updateSettings(updates, userId);
    res.json({ success: true, updates });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Configure Vite integration for Hot Reload & Bundling
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.get('*', async (req, res, next) => {
      // Direct pass-through for express API routes and uploaded file static assets
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      // Direct pass-through for express API routes and uploaded file static assets in production
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[X4 Retro Engine] running at http://localhost:${PORT}`);
  });
}

start();
