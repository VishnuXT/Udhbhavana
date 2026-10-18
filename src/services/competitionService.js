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
import { initialCompetitions } from './initialData';

const COLLECTION_NAME = 'competitions';
const LOCAL_STORAGE_KEY = 'udhbhavana_competitions';

let isSeeding = false;

function getLocalCompetitions() {
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialCompetitions));
  return initialCompetitions;
}

function saveLocalCompetitions(list) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('udhbhavana_competitions_change'));
}

export const competitionService = {
  async getCompetitions(onlyPublished = false) {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(colRef, orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);

        if (snapshot.empty && !isSeeding) {
          isSeeding = true;
          // Seed using deterministic document IDs to prevent race-condition duplicates
          const seedPromises = initialCompetitions.map((item) => {
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
          return { data: onlyPublished ? list.filter(c => c.published) : list, error: null };
        }

        const list = snapshot.docs.map(d => ({
          ...d.data(),
          id: d.id // Ensure id is always the true Firestore document ID
        }));
        return { data: onlyPublished ? list.filter(c => c.published) : list, error: null };
      } catch (err) {
        console.warn('Firestore competitions fetch failed, using local cache:', err);
        const local = getLocalCompetitions();
        return { data: onlyPublished ? local.filter(c => c.published) : local, error: err.message };
      }
    }
    const local = getLocalCompetitions();
    return { data: onlyPublished ? local.filter(c => c.published) : local, error: null };
  },

  async addCompetition(compData) {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const docRef = await addDoc(colRef, {
          ...compData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        const created = { ...compData, id: docRef.id };
        const current = getLocalCompetitions();
        saveLocalCompetitions([...current, created]);
        return { data: created, error: null };
      } catch (err) {
        return { data: null, error: err.message };
      }
    } else {
      const current = getLocalCompetitions();
      const newItem = {
        ...compData,
        id: `comp-${Date.now()}`
      };
      saveLocalCompetitions([...current, newItem]);
      return { data: newItem, error: null };
    }
  },

  async updateCompetition(id, updates) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
        const current = getLocalCompetitions();
        const updated = current.map(c => c.id === id ? { ...c, ...updates } : c);
        saveLocalCompetitions(updated);
        return { success: true, error: null };
      } catch (err) {
        console.error('Update error in Firestore:', err);
        return { success: false, error: err.message };
      }
    } else {
      const current = getLocalCompetitions();
      const updated = current.map(c => c.id === id ? { ...c, ...updates } : c);
      saveLocalCompetitions(updated);
      return { success: true, error: null };
    }
  },

  async deleteCompetition(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        const current = getLocalCompetitions();
        saveLocalCompetitions(current.filter(c => c.id !== id));
        return { success: true, error: null };
      } catch (err) {
        console.error('Delete error in Firestore:', err);
        return { success: false, error: err.message };
      }
    } else {
      const current = getLocalCompetitions();
      saveLocalCompetitions(current.filter(c => c.id !== id));
      return { success: true, error: null };
    }
  },

  async reorderCompetitions(items) {
    const updated = items.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    saveLocalCompetitions(updated);
    if (isFirebaseConfigured && db) {
      try {
        const promises = updated.map(item => {
          const docRef = doc(db, COLLECTION_NAME, item.id);
          return updateDoc(docRef, { displayOrder: item.displayOrder });
        });
        await Promise.all(promises);
      } catch (err) {
        console.warn('Firestore reorder sync error:', err);
      }
    }
    return { success: true, data: updated };
  },

  async removeDuplicateCompetitions() {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, COLLECTION_NAME);
        const q = query(colRef, orderBy('displayOrder', 'asc'));
        const snapshot = await getDocs(q);
        const seenTitles = new Set();
        const deletePromises = [];

        snapshot.docs.forEach((d) => {
          const title = (d.data().title || '').trim().toLowerCase();
          if (seenTitles.has(title)) {
            // Duplicate found, delete from Firestore
            deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, d.id)));
          } else {
            seenTitles.add(title);
          }
        });

        await Promise.all(deletePromises);
        return { removedCount: deletePromises.length, error: null };
      } catch (err) {
        return { removedCount: 0, error: err.message };
      }
    }
    return { removedCount: 0, error: null };
  }
};
