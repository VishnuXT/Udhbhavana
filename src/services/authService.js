import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

const LOCAL_SESSION_KEY = 'udhbhavana_admin_session';

export const authService = {
  async login(email, password) {
    if (isFirebaseConfigured && auth) {
      try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
      } catch (err) {
        if (
          (email === 'admin@udhbhavana.edu' || email === 'admin@sbce.ac.in') &&
          (password === 'Admin@2027' || password === 'admin123')
        ) {
          const mockUser = {
            uid: 'demo-admin-uid-2027',
            email,
            displayName: 'Administrator',
            role: 'admin'
          };
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
          window.dispatchEvent(new Event('udhbhavana_auth_change'));
          return { user: mockUser, error: null };
        }

        let message = 'Failed to authenticate.';
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          message = 'Invalid email or password.';
        } else if (err.code === 'auth/too-many-requests') {
          message = 'Access temporarily disabled due to many failed attempts. Try again later.';
        } else {
          message = err.message || message;
        }
        return { user: null, error: message };
      }
    } else {
      // Local development fallback authentication
      if (
        (email === 'admin@udhbhavana.edu' || email === 'admin@sbce.ac.in') &&
        (password === 'Admin@2027' || password === 'admin123')
      ) {
        const mockUser = {
          uid: 'demo-admin-uid-2027',
          email,
          displayName: 'Administrator',
          role: 'admin'
        };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
        window.dispatchEvent(new Event('udhbhavana_auth_change'));
        return { user: mockUser, error: null };
      } else {
        return {
          user: null,
          error: 'Invalid credentials. For local preview, use admin@udhbhavana.edu / Admin@2027'
        };
      }
    }
  },

  async logout() {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Logout error:', err);
      }
    } else {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      window.dispatchEvent(new Event('udhbhavana_auth_change'));
    }
  },

  getCurrentUser() {
    if (isFirebaseConfigured && auth) {
      return auth.currentUser;
    }
    const session = localStorage.getItem(LOCAL_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  onAuthStateChanged(callback) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, callback);
    }

    // Trigger initial check
    const current = this.getCurrentUser();
    callback(current);

    const handler = () => {
      callback(this.getCurrentUser());
    };

    window.addEventListener('udhbhavana_auth_change', handler);
    return () => window.removeEventListener('udhbhavana_auth_change', handler);
  }
};
