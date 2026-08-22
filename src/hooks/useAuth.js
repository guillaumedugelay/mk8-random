import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  deleteUser,
} from 'firebase/auth';

// Connexion anonyme silencieuse au premier lancement : pas d'écran de login,
// l'app s'ouvre directement sur le jeu. L'uid ne sert qu'à deux choses :
// permettre aux règles Firebase d'exiger un utilisateur, et compter les
// téléphones connectés à un tournoi.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) {
        setUser(u);
        setError(null);
        setLoading(false);
      } else {
        signInAnonymously(auth).catch(err => {
          console.error('Connexion anonyme impossible', err);
          // auth/configuration-not-found = la connexion anonyme n'est pas
          // activée dans la console Firebase (Authentication → Sign-in method).
          setError(err?.code || 'auth/unknown');
          setLoading(false);
        });
      }
    });
    return () => unsub();
  }, []);

  // Rend l'uid durable : sans ça, réinstaller l'app crée un nouvel utilisateur.
  // NOTE phase 4 : linkWithPopup ne fonctionne pas dans une WebView Android.
  // Il faudra passer par un plugin Capacitor de connexion Google native.
  async function linkGoogle() {
    if (!auth.currentUser) throw new Error('Aucun utilisateur connecté');
    const provider = new GoogleAuthProvider();
    const result = await linkWithPopup(auth.currentUser, provider);
    setUser(result.user);
    return result.user;
  }

  async function removeAccount() {
    if (!auth.currentUser) return;
    await deleteUser(auth.currentUser);
  }

  return {
    user,
    error,
    uid: user?.uid || null,
    isAnonymous: user?.isAnonymous ?? true,
    loading,
    linkGoogle,
    removeAccount,
  };
}
