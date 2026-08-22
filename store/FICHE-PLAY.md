# Fiche Play Console — MK8 Racers

Document de travail : à copier-coller dans la console au moment du dépôt.

> **En test interne, la fiche n'est pas publiée** et les captures d'écran ne
> sont pas exigées. Les déclarations « Contenu de l'application », en
> revanche, bloquent le déploiement — ce sont elles qui comptent.
>
> Les textes ci-dessous nomment Mario Kart. C'est sans risque tant qu'on
> reste en interne. **Si tu passes un jour en production publique, tout est
> à réécrire** : nom, description et captures.

---

## Identité

| Champ | Valeur |
|---|---|
| Nom de l'application | `MK8 Racers` |
| Identifiant | `com.guizor.randomracers` |
| Version | 1.0 (versionCode 1) |
| Catégorie | Jeux → Jeux de société *(l'app organise, elle ne fait pas courir)* |
| Public cible | 13 ans et plus |
| Gratuite | Oui, sans achat intégré |

---

## Description courte

*Maximum 80 caractères.*

```
Tournois Mario Kart entre amis : malus tirés au sort, scores et panthéon.
```

*(72 caractères)*

---

## Description complète

*Maximum 4000 caractères.*

```
MK8 Racers transforme vos soirées Mario Kart en vrai tournoi.

Vous choisissez le nombre de manches et qui joue. L'application s'occupe
du reste : elle tire au sort les circuits, distribue les malus et les
bonus, désigne la manche Yoshi et la manche sans objets, et retourne les
deux cartes du destin qui désignent le Petit Veinard et le Chat Noir de
la soirée.

TOUT LE MONDE SUIT SUR SON TÉLÉPHONE
Celui qui lance la partie obtient un code à quatre chiffres. Les autres
le saisissent et voient la même chose au même moment : la roue qui
tourne, les malus de chacun, la manche en cours.

LE PANTHÉON DES HÉROS
Victoires, podiums, séries en cours, record de série, le plus veinard et
le plus malchanceux : la mémoire de vos tournois s'accumule à chaque
soirée. L'historique garde le déroulé complet de chaque partie, manche
par manche.

DES STICKERS À COLLECTIONNER
Un tirage à la mi-temps, un autre à la fin. Quatre raretés, du vert
banal au doré très convoité. Celui que vous choisissez s'affiche à côté
de votre nom.

LE BUREAU DU CHEF
Les malus et les bonus se modifient librement. Ajoutez les vôtres,
supprimez ceux qui ne font plus rire personne.

Application privée, sans publicité et sans achat intégré. Sans lien avec
Nintendo : Mario Kart et les marques associées appartiennent à Nintendo.
```

---

## Contenu de l'application

Les réponses ci-dessous découlent de ce que l'app fait réellement.

### Règles de confidentialité
- **URL** : `https://guillaumedugelay.github.io/mk8-random/confidentialite.html`
- ⚠️ **Ne répond pas encore** : la page vit sur la branche `phase2-play-store`,
  alors que le site est déployé depuis `main`. Il faut y porter le fichier et
  relancer `npm run deploy` **avant** de renseigner ce champ.

### Accès à l'application
Aucun identifiant nécessaire — l'app s'ouvre sans écran de connexion.
Rien à fournir aux relecteurs.

### Publicités
**Non**, l'application ne contient aucune publicité.

### Classification du contenu (IARC)
- Violence : aucune
- Contenu sexuel : aucun
- Langage grossier : **oui, léger** — quelques intitulés de malus et noms de
  circuits sont familiers. À déclarer honnêtement : une classification
  contestée se paie plus cher qu'une case cochée.
- Substances, jeux d'argent, peur : aucun
- Interactions entre utilisateurs : **oui** — les pseudonymes et les scores
  sont partagés entre les personnes qui ont l'application.

### Public cible
**13 ans et plus.** Ne pas déclarer une tranche inférieure : le régime
« Familles » impose des obligations nettement plus lourdes.

### Sécurité des données

| Question | Réponse |
|---|---|
| Collecte de données ? | Oui |
| Chiffrement en transit ? | Oui (HTTPS) |
| Suppression possible ? | Oui — bouton dans l'app et adresse de contact |

Types collectés :
- **Identifiants** → identifiant utilisateur anonyme. Finalité : fonctionnement de l'app. Obligatoire.
- **Informations personnelles** → nom, uniquement si l'utilisateur saisit son vrai prénom comme pseudonyme. Finalité : fonctionnement de l'app. Facultatif.
- **Activité dans l'application** → résultats de parties. Finalité : fonctionnement de l'app. Obligatoire.
- **Adresse e-mail** → seulement si l'utilisateur lie volontairement un compte Google. Facultatif.

Aucune donnée n'est partagée avec des tiers, ni utilisée à des fins
publicitaires ou de mesure d'audience.

### Application gouvernementale, financière, santé
Non à tout.

---

## Éléments graphiques

| Élément | État | Fichier |
|---|---|---|
| Icône 512×512 | ✅ prêt | `store/icon-512.png` |
| Bannière 1024×500 | ⬜ à faire | *non exigée en test interne* |
| Captures téléphone (min. 2) | ⬜ à faire | *non exigées en test interne* |

---

## Dépôt

1. Piste **Test interne** → Créer une release
2. Déposer `store/mk8-racers-v1.0-code1.aab`
3. Créer la liste de testeurs, y coller les adresses du groupe
4. Copier le lien d'opt-in et l'envoyer

**À chaque nouvelle version**, incrémenter `versionCode` dans
`android/app/build.gradle` — la console refuse deux dépôts au même numéro.

---

## Après le premier dépôt

Récupérer l'empreinte SHA-1 de la clé de signature Play
(Configuration → Intégrité de l'application) et l'ajouter dans Firebase,
en plus de celle de la clé de dépôt. Voir `store/EMPREINTES.md`.
