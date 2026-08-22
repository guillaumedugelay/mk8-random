import { useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';

// Le bouton retour Android quitte l'application par défaut. En pleine soirée,
// une pression involontaire ferme tout : il faut le rattraper.
//
// Sur le web, l'écouteur ne se déclenche jamais — le plugin est inerte hors
// contexte natif, donc rien à conditionner.
export function useBackButton(onBack) {
  useEffect(() => {
    let retirer = null;
    let annule = false;

    CapApp.addListener('backButton', ({ canGoBack }) => {
      void canGoBack;
      // onBack renvoie true s'il a consommé le retour (on est descendu d'un
      // écran), false si l'on est déjà à la racine et qu'il faut sortir.
      if (!onBack()) CapApp.exitApp();
    }).then(handle => {
      if (annule) handle.remove();
      else retirer = handle;
    }).catch(() => {
      // Plugin absent (navigateur) : rien à faire.
    });

    return () => {
      annule = true;
      retirer?.remove();
    };
  }, [onBack]);
}
