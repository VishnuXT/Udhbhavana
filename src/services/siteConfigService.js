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

function getLocalConfig() {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
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
          const data = snapshot.data();
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
            callback(snap.data());
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
      callback(e.detail || getLocalConfig());
    };
    window.addEventListener('udhbhavana_config_change', handler);
    return () => window.removeEventListener('udhbhavana_config_change', handler);
  }
};
