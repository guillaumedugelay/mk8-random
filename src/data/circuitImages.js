// Vignettes des circuits, embarquées dans l'app — généré par
// scripts/gen-image-data.mjs. Ne pas éditer à la main.
//
// import.meta.glob plutôt que des chemins en dur : Vite transforme chaque
// fichier en URL hachée, valable quelle que soit la base du site. C'est ce
// qui permettra à Capacitor de servir l'app depuis un schéma local.

const FILES = import.meta.glob('../assets/circuits/*.png', { eager: true, import: 'default' });

function asset(file) {
  const url = FILES[`../assets/circuits/${file}`];
  if (!url && import.meta.env.DEV) console.warn('Vignette manquante :', file);
  return url;
}

export const CIRCUIT_IMAGES = {
  // Coupe Champignon
  "Champidrome - Coupe Champignon": asset("120px-MK8D_Mario_Kart_Stadium_Course_Icon_Full.png"),
  "Parc Glougloop - Coupe Champignon": asset("120px-MK8D_Water_Park_Course_Icon_Full.png"),
  "Piste aux délices - Coupe Champignon": asset("120px-MK8D_Sweet_Sweet_Canyon_Course_Icon_Full.png"),
  "Temple Thwomp - Coupe Champignon": asset("120px-MK8D_Thwomp_Ruins_Course_Icon_Full.png"),

  // Coupe Fleur
  "Circuit Mario - Coupe Fleur": asset("120px-MK8D_Mario_Circuit_Course_Icon_Full.png"),
  "Promenade Toad - Coupe Fleur": asset("120px-MK8D_Toad_Harbor_Course_Icon_Full.png"),
  "Manoir Trempé - Coupe Fleur": asset("120px-MK8D_Twisted_Mansion_Course_Icon_Full.png"),
  "Cascades Maskass - Coupe Fleur": asset("120px-MK8D_Shy_Guy_Falls_Course_Icon_Full.png"),

  // Coupe Étoile
  "Aéroport Azur - Coupe Étoile": asset("120px-MK8D_Sunshine_Airport_Course_Icon_Full.png"),
  "Lagon Tourbillon - Coupe Étoile": asset("120px-MK8D_Dolphin_Shoals_Course_Icon_Full.png"),
  "Club Mario - Coupe Étoile": asset("120px-MK8D_Electrodrome_Course_Icon_Full.png"),
  "Descente givrée - Coupe Étoile": asset("120px-MK8D_Mount_Wario_Course_Icon_Full.png"),

  // Coupe Couronne
  "Voie Céleste - Coupe Couronne": asset("120px-MK8D_Cloudtop_Cruise_Course_Icon_Full.png"),
  "Désert Toussec - Coupe Couronne": asset("120px-MK8D_Bone-Dry_Dunes_Course_Icon_Full.png"),
  "Château de Bowser - Coupe Couronne": asset("120px-MK8D_Bowser's_Castle_Course_Icon_Full.png"),
  "Route Arc-en-ciel - Coupe Couronne": asset("120px-MK8D_Rainbow_Road_Course_Icon_Full.png"),

  // Coupe Oeuf
  "Circuit Yoshi - Coupe Oeuf": asset("120px-MK8D_GCN_Yoshi_Circuit_Course_Icon_Full.png"),
  "Arène d'Excitebike - Coupe Oeuf": asset("120px-MK8D_Excitebike_Arena_Course_Icon_Full.png"),
  "Route du dragon - Coupe Oeuf": asset("120px-MK8D_Dragon_Driftway_Course_Icon_Full.png"),
  "Mute City - Coupe Oeuf": asset("120px-MK8D_Mute_City_Course_Icon_Full.png"),

  // Coupe Pomme verte
  "Parc Baby Cadum - Coupe Pomme verte": asset("120px-MK8D_GCN_Baby_Park_Course_Icon_Full.png"),
  "Pays Fromage - Coupe Pomme verte": asset("120px-MK8D_GBA_Cheese_Land_Course_Icon_Full.png"),
  "Passage Feuillage - Coupe Pomme verte": asset("120px-MK8_Wild_Woods_Course_Icon.png"),
  "Animal Crossing - Coupe Pomme verte": asset("120px-MK8D_Animal_Crossing_Course_Icon_Full.png"),

  // Coupe Carapace
  "Prairie Émeuh Émeuh - Coupe Carapace": asset("120px-MK8D_Wii_Moo_Moo_Meadows_Course_Icon_Full.png"),
  "Circuit Mario - Coupe Carapace": asset("120px-MK8D_GBA_Mario_Circuit_Course_Icon_Full.png"),
  "Plage Cheep Cheep - Coupe Carapace": asset("120px-MK8D_DS_Cheep_Cheep_Beach_Course_Icon_Full.png"),
  "Autoroute Toad - Coupe Carapace": asset("120px-MK8D_N64_Toad's_Turnpike_Course_Icon_Full.png"),

  // Coupe Banane
  "Désert Sec-Sec (qui pue du bec) - Coupe Banane": asset("120px-MK8D_GCN_Dry_Dry_Desert_Course_Icon_Full.png"),
  "Plaine Donut 3 - Coupe Banane": asset("120px-MK8D_SNES_Donut_Plains_3_Course_Icon_Full.png"),
  "Autodrome Royal - Coupe Banane": asset("120px-MK8D_N64_Royal_Raceway_Course_Icon_Full.png"),
  "Forêt Tropicale DK - Coupe Banane": asset("120px-MK8D_3DS_DK_Jungle_Course_Icon_Full.png"),

  // Coupe Feuille
  "Stade Wario - Coupe Feuille": asset("120px-MK8D_DS_Wario_Stadium_Course_Icon_Full.png"),
  "Royaume Sorbet - Coupe Feuille": asset("120px-MK8D_GCN_Sherbet_Land_Course_Icon_Full.png"),
  "Piste Musicale - Coupe Feuille": asset("120px-MK8D_3DS_Music_Park_Course_Icon_Full.png"),
  "Vallée Yoshi - Coupe Feuille": asset("120px-MK8D_N64_Yoshi_Valley_Course_Icon_Full.png"),

  // Coupe Éclair
  "Horloge Tic-Tac - Coupe Éclair": asset("120px-MK8D_DS_Tick-Tock_Clock_Course_Icon_Full.png"),
  "Égout Piranha - Coupe Éclair": asset("120px-MK8D_3DS_Piranha_Plant_Slide_Course_Icon_Full.png"),
  "Volcan Grondin - Coupe Éclair": asset("120px-MK8D_Wii_Grumble_Volcano_Course_Icon_Full.png"),
  "Route Arc-en-ciel - Coupe Éclair": asset("120px-MK8D_N64_Rainbow_Road_Course_Icon_Full.png"),

  // Coupe Triforce
  "Mine Wario - Coupe Triforce": asset("120px-MK8_Wii_Wario's_Gold_Mine_Course_Icon.png"),
  "Route Arc-en-ciel - Coupe Triforce": asset("120px-MK8D_SNES_Rainbow_Road_Course_Icon_Full.png"),
  "Station Glagla - Coupe Triforce": asset("120px-MK8D_Ice_Ice_Outpost_Course_Icon_Full.png"),
  "Circuit d'Hyrule - Coupe Triforce": asset("120px-MK8D_Hyrule_Circuit_Course_Icon_Full.png"),

  // Coupe Clochette
  "Koopapourri - Coupe Clochette": asset("120px-MK8D_3DS_Neo_Bowser_City_Course_Icon_Full.png"),
  "Route Ruban - Coupe Clochette": asset("120px-MK8D_GBA_Ribbon_Road_Course_Icon_Full.png"),
  "Métro Turbo Dodo - Coupe Clochette": asset("120px-MK8D_Super_Bell_Subway_Course_Icon_Full.png"),
  "Big Blue - Coupe Clochette": asset("120px-MK8_Big_Blue_Course_Icon.png"),

  // Coupe Champignon Doré
  "Promenade à Paris - Coupe Champignon Doré": asset("120px-MK8D_Tour_Paris_Promenade_Course_Icon_Full.png"),
  "Circuit Toad - Coupe Champignon Doré": asset("120px-MK8D_3DS_Toad_Circuit_Course_Icon_Full.png"),
  "Montagne Choco - Coupe Champignon Doré": asset("120px-MK8D_N64_Choco_Mountain_Course_Icon_Full.png"),
  "Supermarché Coco - Coupe Champignon Doré": asset("120px-MK8D_Wii_Coconut_Mall_Course_Icon_Full.png"),

  // Coupe Feuille rayée
  "Traversée de Tokyo - Coupe Feuille rayée": asset("120px-MK8D_Tour_Tokyo_Blur_Course_Icon_Full.png"),
  "Corniche Champignon - Coupe Feuille rayée": asset("120px-MK8D_DS_Shroom_Ridge_Course_Icon_Full.png"),
  "Jardin Volant - Coupe Feuille rayée": asset("120px-MK8D_GBA_Sky_Garden_Course_Icon_Full.png"),
  "Dojo Ninja - Coupe Feuille rayée": asset("120px-MK8D_Ninja_Hideaway_Course_Icon_Full.png"),

  // Coupe Navet
  "Escapade New-yorkaise - Coupe Navet": asset("120px-MK8D_Tour_New_York_Minute_Course_Icon_Full.png"),
  "Circuit Mario 3 - Coupe Navet": asset("120px-MK8D_SNES_Mario_Circuit_3_Course_Icon_Full.png"),
  "Désert Kalimari - Coupe Navet": asset("120px-MK8D_N64_Kalimari_Desert_Course_Icon_Full.png"),
  "Flipper qui pue la merde - Coupe Navet": asset("120px-MK8D_DS_Waluigi_Pinball_Course_Icon_Full.png"),

  // Coupe Hélico
  "Sprint à Sydney - Coupe Hélico": asset("120px-MK8D_Tour_Sydney_Sprint_Course_Icon_Full.png"),
  "Pays Neigeux - Coupe Hélico": asset("120px-MK8D_GBA_Snow_Land_Course_Icon_Full.png"),
  "Gorge Champignon - Coupe Hélico": asset("120px-MK8D_Wii_Mushroom_Gorge_Course_Icon_Full.png"),
  "Cité Sorbet - Coupe Hélico": asset("120px-MK8D_Sky-High_Sundae_Course_Icon_Full.png"),

  // Coupe Pierre
  "Détour à Londres - Coupe Pierre": asset("120px-MK8D_Tour_London_Loop_Course_Icon_Full.png"),
  "Lac Boo - Coupe Pierre": asset("120px-MK8D_GBA_Boo_Lake_Course_Icon_Full.png"),
  "Mont Éboulis - Coupe Pierre": asset("120px-MK8D_3DS_Rock_Rock_Mountain_Course_Icon_Full.png"),
  "Bois Vermeil - Coupe Pierre": asset("120px-MK8D_Wii_Maple_Treeway_Course_Icon_Full.png"),

  // Coupe Lune
  "Balade Berlinoise - Coupe Lune": asset("120px-MK8D_Tour_Berlin_Byways_Course_Icon_Full.png"),
  "Jardin Peach - Coupe Lune": asset("120px-MK8D_DS_Peach_Gardens_Course_Icon_Full.png"),
  "Mont Festif - Coupe Lune": asset("120px-MK8D_Merry_Mountain_Course_Icon_Full.png"),
  "Route Arc-en-ciel - Coupe Lune": asset("120px-MK8D_3DS_Rainbow_Road_Course_Icon_Full.png"),

  // Coupe Pomme rouge
  "Virée à Amsterdam - Coupe Pomme rouge": asset("120px-MK8D_Tour_Amsterdam_Drift_Course_Icon_Full.png"),
  "Riverside Park - Coupe Pomme rouge": asset("120px-MK8D_GBA_Riverside_Park_Course_Icon_Full.png"),
  "Dick Pic - Coupe Pomme rouge": asset("120px-MK8D_Wii_DK_Summit_Course_Icon_Full.png"),
  "Île de Yoshi - Coupe Pomme rouge": asset("120px-MK8D_Yoshi's_Island_Course_Icon.png"),

  // Coupe Boomerang
  "Bousculade à Bangkok - Coupe Boomerang": asset("120px-MK8D_Tour_Bangkok_Rush_Course_Icon_Full.png"),
  "Circuit Mario - Coupe Boomerang": asset("120px-MK8D_DS_Mario_Circuit_Course_Icon_Full.png"),
  "Stade Waluigi - Coupe Boomerang": asset("120px-MK8D_GCN_Waluigi_Stadium_Course_Icon_Full.png"),
  "Poursuite à Singapour - Coupe Boomerang": asset("120px-MK8D_Tour_Singapore_Speedway_Course_Icon_Full.png"),

  // Coupe Plume
  "Athènes Antique - Coupe Plume": asset("120px-MK8D_Tour_Athens_Dash_Course_Icon_Full.png"),
  "Paquebot Daisy - Coupe Plume": asset("120px-MK8D_GCN_Daisy_Cruiser_Course_Icon_Full.png"),
  "Route Clair de Loose - Coupe Plume": asset("120px-MK8D_Wii_Moonview_Highway_Course_Icon_Full.png"),
  "Course à la propreté - Coupe Plume": asset("120px-MK8D_Squeaky_Clean_Sprint_Course_Icon_Full.png"),

  // Coupe Cerises
  "Road-trip à Los Angeles - Coupe Cerises": asset("120px-MK8D_Tour_Los_Angeles_Laps_Course_Icon_Full.png"),
  "Pays Crépuscule - Coupe Cerises": asset("120px-MK8D_GBA_Sunset_Wilds_Course_Icon_Full.png"),
  "Cap Kippa - Coupe Cerises": asset("120px-MK8D_Wii_Koopa_Cape_Course_Icon.png"),
  "Virages à Vancouver - Coupe Cerises": asset("120px-MK8D_Tour_Vancouver_Velocity_Course_Icon_Full.png"),

  // Coupe Gland
  "Roma Romantica - Coupe Gland": asset("120px-MK8D_Tour_Rome_Avanti_Course_Icon_Full.png"),
  "Montagne DK - Coupe Gland": asset("120px-MK8D_GCN_DK_Mountain_Course_Icon_Full.png"),
  "Circuit Daisy - Coupe Gland": asset("120px-MK8D_Wii_Daisy_Circuit_Course_Icon_Full.png"),
  "Ruines Plante Piranha - Coupe Gland": asset("120px-MK8D_Piranha_Plant_Cove_Course_Icon_Full.png"),

  // Coupe Carapace bleue
  "Méandres madrilènes - Coupe Carapace bleue": asset("120px-MK8D_Tour_Madrid_Drive_Course_Icon_Full.png"),
  "Monde glacé d'Harmonie - Coupe Carapace bleue": asset("120px-MK8D_3DS_Rosalina's_Ice_World_Course_Icon_Full.png"),
  "Château de Bowser 3 - Coupe Carapace bleue": asset("120px-MK8D_SNES_Bowser_Castle_3_Course_Icon_Full.png"),
  "Route Arc-en-ciel - Coupe Carapace bleue": asset("120px-MK8D_Wii_Rainbow_Road_Course_Icon_Full.png"),
};
