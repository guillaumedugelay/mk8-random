import { useEffect } from 'react';

// Empêche l'écran de s'éteindre pendant un tournoi. Entre deux manches il se
// passe plusieurs minutes sans toucher au téléphone : sans ça, l'écran
// s'éteint et il faut le rallumer à chaque fois pour saisir un score.
//
// L'API n'existe pas partout (Safari iOS l'a depuis peu, certains navigateurs
// pas du tout) : l'absence n'est pas une erreur, on s'en passe simplement.
export function useWakeLock(actif) {
  useEffect(() => {
    if (!actif || !('wakeLock' in navigator)) return;

    let sentinel = null;
    let annule = false;

    async function demander() {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // Refusé (batterie faible, onglet en arrière-plan) : sans conséquence.
      }
    }

    // Le verrou est perdu dès que l'app passe en arrière-plan ; il faut le
    // redemander au retour, sinon il ne tient que jusqu'à la première
    // interruption — un appel, une notification.
    function auRetour() {
      if (!annule && document.visibilityState === 'visible') demander();
    }

    demander();
    document.addEventListener('visibilitychange', auRetour);

    return () => {
      annule = true;
      document.removeEventListener('visibilitychange', auRetour);
      sentinel?.release?.().catch(() => {});
    };
  }, [actif]);
}
