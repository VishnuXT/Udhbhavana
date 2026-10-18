import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { initialSiteConfig } from './initialData';

const CONFIG_DOC_PATH = ['siteConfig', 'main'];
const LOCAL_STORAGE_KEY = 'udhbhavana_site_config';

function sanitizeConfig(config) {
  if (!config) return { data: config, modified: false };
  let modified = false;
  const sanitized = { ...config };
  if (typeof sanitized.logoUrl === 'string' && sanitized.logoUrl.startsWith('/src/assets/')) {
    sanitized.logoUrl = sanitized.logoUrl.replace('/src/assets/', '/');
    modified = true;
  }
  if (typeof sanitized.posterUrl === 'string' && sanitized.posterUrl.startsWith('/src/assets/')) {
    sanitized.posterUrl = sanitized.posterUrl.replace('/src/assets/', '/');
    modified = true;
  }
  if (sanitized.eventName === 'Udhbhavana 2026') {
    sanitized.eventName = 'Udhbhavana 2027';
    modified = true;
  }
  return { data: sanitized, modified };
}

function getLocalConfig() {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      const { data, modified } = sanitizeConfig(parsed);
      if (modified) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
      return data;
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialSiteConfig));
  return initialSiteConfig;
}

export const siteConfigService = {
  async getSiteConfig() {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, ...CONFIG_DOC_PATH);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const { data, modified } = sanitizeConfig(snapshot.data());
          if (modified) {
            setDoc(docRef, { logoUrl: data.logoUrl, posterUrl: data.posterUrl }, { merge: true }).catch(() => {});
          }
          return { data, error: null };
        } else {
          // Initialize default document
          await setDoc(docRef, {
            ...initialSiteConfig,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          return { data: initialSiteConfig, error: null };
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using cached config:', err);
        return { data: getLocalConfig(), error: err.message };
      }
    }
    return { data: getLocalConfig(), error: null };
  },

  async updateSiteConfig(newConfig, userEmail = 'admin') {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, ...CONFIG_DOC_PATH);
        const payload = {
          ...newConfig,
          updatedAt: serverTimestamp(),
          updatedBy: userEmail
        };
        await setDoc(docRef, payload, { merge: true });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
        window.dispatchEvent(new CustomEvent('udhbhavana_config_change', { detail: newConfig }));
        return { success: true, error: null };
      } catch (err) {
        return { success: false, error: err.message };
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
      window.dispatchEvent(new CustomEvent('udhbhavana_config_change', { detail: newConfig }));
      return { success: true, error: null };
    }
  },

  subscribe(callback) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, ...CONFIG_DOC_PATH);
        return onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            const { data } = sanitizeConfig(snap.data());
            callback(data);
          } else {
            callback(initialSiteConfig);
          }
        }, (err) => {
          console.warn('Subscription error, using local fallback:', err);
          callback(getLocalConfig());
        });
      } catch (e) {
        console.warn('Snapshot error:', e);
      }
    }

    callback(getLocalConfig());
    const handler = (e) => {
      const { data } = sanitizeConfig(e.detail || getLocalConfig());
      callback(data);
    };
    window.addEventListener('udhbhavana_config_change', handler);
    return () => window.removeEventListener('udhbhavana_config_change', handler);
  }
};
