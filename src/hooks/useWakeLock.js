import { useEffect } from 'react';

// Empêche l'écran de s'éteindre tant que l'app est au premier plan. Une
// soirée s'étale sur une heure avec de longs moments sans toucher au
// téléphone : sans ça, il faut le rallumer sans arrêt.
//
// Le verrou est automatiquement relâché par le navigateur quand la page
// devient invisible, donc l'écran ne reste jamais allumé une fois l'app en
// arrière-plan — c'est ce qui rend acceptable de le prendre en permanence.
//
// L'API n'existe pas partout (Safari iOS l'a depuis peu, certains navigateurs
// pas du tout) : l'absence n'est pas une erreur, on s'en passe simplement.
export function useWakeLock(actif) {
  useEffect(() => {
    if (!actif) return;
    // Vérifié sur WebView 151 (Redmi Note 10 5G) : le verrou est bien pris,
    // le système rapporte un SCREEN_BRIGHT_WAKE_LOCK au nom de l'app.
    if (!('wakeLock' in navigator)) return;

    let sentinel = null;
    let annule = false;

    async function demander() {
      try {
        sentinel = await navigator.wakeLock.request('screen');
      } catch {
        // Refusé (batterie faible, app en arrière-plan) : sans conséquence,
        // l'écran s'éteindra normalement.
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
