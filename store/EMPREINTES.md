# Empreintes du certificat de signature

Clé de dépôt (upload key) — `mk8-racers-release.jks`, alias `mk8-racers`.

    SHA-1    6D:78:25:67:43:F4:D4:51:D3:63:D1:40:5C:ED:01:1B:4A:FA:C3:CC
    SHA-256  52:84:10:69:B1:5F:47:0B:28:FE:AA:A8:89:D6:23:3C:36:A7:A0:66:24:CA:32:9E:89:A6:42:6E:27:D6:53:14

Propriétaire : CN=dugelay, OU=Guizor, O=GUIZOR, L=Lyon, C=FR
Valide du 22 août 2026 au 7 janvier 2054. RSA 4096, SHA384withRSA.

## À quoi ça sert

Google Sign-In sur Android refuse de fonctionner tant que l'empreinte SHA-1
de la clé qui a signé l'app n'est pas déclarée dans la console Firebase
(Paramètres du projet → Vos applications → Ajouter une empreinte).

## Le piège de la signature Play

Le Play Store re-signe l'application avec **sa propre clé** avant de la
distribuer (Play App Signing, obligatoire). L'empreinte ci-dessus est celle
de la clé de dépôt, pas celle que verront les téléphones.

Il faut donc déclarer **les deux** dans Firebase :
1. celle ci-dessus, pour les builds installés directement depuis le PC ;
2. celle affichée par la Play Console après le premier dépôt, dans
   Configuration → Intégrité de l'application → Certificat de signature
   d'application.

Sans la seconde, le bouton « Lier un compte Google » échouera pour tous
ceux qui auront installé l'app depuis le Play Store.
