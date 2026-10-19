import {
  collection,
  getDocs,
  setDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { initialAnnouncements } from './initialData';

const COLLECTION_NAME = 'announcements';
const LOCAL_STORAGE_KEY = 'udhbhavana_announcements';

let isSeeding = false;

function getLocalAnnouncements() {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    saveLocalAnnouncements(initialAnnouncements);
    return initialAnnouncements;
  } catch {
    return initialAnnouncements;
  }
}

function saveLocalAnnouncements(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('[Storage] Quota exceeded saving announcements to localStorage:', err);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  window.dispatchEvent(new Event('udhbhavana_announcements_change'));
}

export const announcementService = {
  async getAnnouncements(onlyActivePublished = false) {
    const today = new Date().toISOString().split('T')[0];

    const filterActive = (list) => {
      if (!onlyActivePublished) return list;
      return list.filter((item) => {
        if (!item.published) return false;
        if (item.expiresAt && item.expiresAt < today) return false;
        return true;
      });
    };

    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(colRef, orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty && !isSeeding) {
          isSeeding = true;
          const seedPromises = initialAnnouncements.map((item) => {
            const docRef = doc(db, COLLECTION_NAME, item.id);
            return setDoc(docRef, {
              ...item,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          });
          await Promise.all(seedPromises);
          isSeeding = false;

          const seeded = await getDocs(q);
          const list = seeded.docs.map(d => ({
            ...d.data(),
            id: d.id // Ensure id is always the true Firestore document ID
          }));
          return { data: filterActive(list), error: null };
        }

        const list = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id // Ensure id is always the true Firestore document ID
        }));
        return { data: filterActive(list), error: null };
      } catch (err) {
        console.warn('Firestore announcements fetch error, using cache:', err);
        const local = getLocalAnnouncements();
        return { data: filterActive(local), error: err.message };
      }
    }

    const local = getLocalAnnouncements();
    return { data: filterActive(local), error: null };
  },

  async addAnnouncement(itemData) {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(colRef, {
          ...itemData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const created = { ...itemData, id: docRef.id };
        const current = getLocalAnnouncements();
        saveLocalAnnouncements([...current, created]);
        return { data: created, error: null };
      } catch (err) {
        return { data: null, error: err.message };
      }
    } else {
      const current = getLocalAnnouncements();
      const newItem = {
        ...itemData,
        id: `ann-${Date.now()}`
      };
      saveLocalAnnouncements([...current, newItem]);
      return { data: newItem, error: null };
    }
  },

  async updateAnnouncement(id, updates) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
        const current = getLocalAnnouncements();
        const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
        saveLocalAnnouncements(updated);
        return { success: true, error: null };
      } catch (err) {
        console.error('Update announcement error in Firestore:', err);
        return { success: false, error: err.message };
      }
    } else {
      const current = getLocalAnnouncements();
      const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
      saveLocalAnnouncements(updated);
      return { success: true, error: null };
    }
  },

  async deleteAnnouncement(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        const current = getLocalAnnouncements();
        saveLocalAnnouncements(current.filter(a => a.id !== id));
        return { success: true, error: null };
      } catch (err) {
        console.error('Delete announcement error in Firestore:', err);
        return { success: false, error: err.message };
      }
    } else {
      const current = getLocalAnnouncements();
      saveLocalAnnouncements(current.filter(a => a.id !== id));
      return { success: true, error: null };
    }
  }
};
