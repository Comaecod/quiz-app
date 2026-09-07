import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../firebase';

export const authService = {
  onAuthChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  signInWithEmail: async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },

  signOut: async () => {
    await signOut(auth);
  },

  changePassword: async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },

  updatePassword: async (newPassword) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await updatePassword(user, newPassword);
  },

  sendEmailVerification: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    await sendEmailVerification(user);
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },

  getIdToken: async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    return user.getIdToken();
  },
};