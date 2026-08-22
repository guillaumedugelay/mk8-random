const B = 'https://mario.wiki.gallery/images/thumb';

export const AVATARS = [
  // Principaux
  { id: 'mario', name: 'Mario', url: `${B}/d/d9/MK8_Mario_Icon.png/70px-MK8_Mario_Icon.png` },
  { id: 'luigi', name: 'Luigi', url: `${B}/5/51/MK8_Luigi_Icon.png/70px-MK8_Luigi_Icon.png` },
  { id: 'peach', name: 'Peach', url: `${B}/c/c2/MK8_Peach_Icon.png/70px-MK8_Peach_Icon.png` },
  { id: 'daisy', name: 'Daisy', url: `${B}/3/32/MK8_Daisy_Icon.png/70px-MK8_Daisy_Icon.png` },
  { id: 'rosalina', name: 'Harmonie', url: `${B}/8/89/MK8_Rosalina_Icon.png/70px-MK8_Rosalina_Icon.png` },
  { id: 'tanooki', name: 'Mario Tanuki', url: `${B}/a/a2/MK8_Tanooki_Mario_Icon.png/70px-MK8_Tanooki_Mario_Icon.png` },
  { id: 'catpeach', name: 'Peach Chat', url: `${B}/a/ad/MK8_Cat_Peach_Icon.png/70px-MK8_Cat_Peach_Icon.png` },
  { id: 'wario', name: 'Wario', url: `${B}/c/c2/MK8_Wario_Icon.png/70px-MK8_Wario_Icon.png` },
  { id: 'waluigi', name: 'Waluigi', url: `${B}/7/78/MK8_Waluigi_Icon.png/70px-MK8_Waluigi_Icon.png` },
  { id: 'dk', name: 'Donkey Kong', url: `${B}/0/08/MK8_DKong_Icon.png/70px-MK8_DKong_Icon.png` },
  { id: 'bowser', name: 'Bowser', url: `${B}/4/47/MK8_Bowser_Icon.png/70px-MK8_Bowser_Icon.png` },
  { id: 'bowserjr', name: 'Bowser Jr.', url: `${B}/2/26/MK8_Bowser_Jr_Icon.png/70px-MK8_Bowser_Jr_Icon.png` },
  { id: 'drybowser', name: 'Bowser Skelet', url: `${B}/2/29/MK8_Dry_Bowser_Icon.png/70px-MK8_Dry_Bowser_Icon.png` },

  // Toad & co
  { id: 'toad', name: 'Toad', url: `${B}/4/45/MK8_Toad_Icon.png/70px-MK8_Toad_Icon.png` },
  { id: 'toadette', name: 'Toadette', url: `${B}/8/8e/MK8_Toadette_Icon.png/70px-MK8_Toadette_Icon.png` },
  { id: 'koopa', name: 'Koopa', url: `${B}/b/bc/MK8_Koopa_Icon.png/70px-MK8_Koopa_Icon.png` },
  { id: 'lakitu', name: 'Lakitu', url: `${B}/7/7d/MK8_Lakitu_Icon.png/70px-MK8_Lakitu_Icon.png` },
  { id: 'kingboo', name: 'Roi Boo', url: `${B}/1/1d/MK8DX_King_Boo_Icon.png/70px-MK8DX_King_Boo_Icon.png` },
  { id: 'drybones', name: 'Skelex', url: `${B}/3/3f/MK8DX_Dry_Bones_Icon.png/70px-MK8DX_Dry_Bones_Icon.png` },
  { id: 'kamek', name: 'Kamek', url: `${B}/0/00/MK8DX_Kamek_Icon.png/70px-MK8DX_Kamek_Icon.png` },
  { id: 'wiggler', name: 'Wiggler', url: `${B}/7/7e/MK8DX_Wiggler_Icon.png/70px-MK8DX_Wiggler_Icon.png` },
  { id: 'petey', name: 'Flora Piranha', url: `${B}/8/86/MK8DX_Petey_Piranha_Icon.png/70px-MK8DX_Petey_Piranha_Icon.png` },
  { id: 'metalmario', name: 'Mario de métal', url: `${B}/e/e3/MK8_MMario_Icon.png/70px-MK8_MMario_Icon.png` },
  { id: 'pinkgoldpeach', name: 'Peach d\'or rose', url: `${B}/0/0d/MK8_PGPeach_Icon.png/70px-MK8_PGPeach_Icon.png` },
  { id: 'goldmario', name: 'Mario d\'or', url: `${B}/c/c8/MK8DX_Gold_Mario_Icon.png/70px-MK8DX_Gold_Mario_Icon.png` },
  { id: 'peachette', name: 'Peachette', url: `${B}/f/fd/MK8DX_Peachette_Icon.png/70px-MK8DX_Peachette_Icon.png` },

  // Bébés
  { id: 'babymario', name: 'Bébé Mario', url: `${B}/d/d2/MK8_BabyMario_Icon.png/70px-MK8_BabyMario_Icon.png` },
  { id: 'babyluigi', name: 'Bébé Luigi', url: `${B}/a/aa/MK8_BabyLuigi_Icon.png/70px-MK8_BabyLuigi_Icon.png` },
  { id: 'babypeach', name: 'Bébé Peach', url: `${B}/3/3d/MK8_BabyPeach_Icon.png/70px-MK8_BabyPeach_Icon.png` },
  { id: 'babydaisy', name: 'Bébé Daisy', url: `${B}/4/43/MK8_BabyDaisy_Icon.png/70px-MK8_BabyDaisy_Icon.png` },
  { id: 'babyrosalina', name: 'Bébé Harmonie', url: `${B}/0/09/MK8_BabyRosalina_Icon.png/70px-MK8_BabyRosalina_Icon.png` },

  // Koopalings
  { id: 'larry', name: 'Larry', url: `${B}/c/c2/MK8_Larry_Icon.png/70px-MK8_Larry_Icon.png` },
  { id: 'morton', name: 'Morton', url: `${B}/7/72/MK8_Morton_Icon.png/70px-MK8_Morton_Icon.png` },
  { id: 'wendy', name: 'Wendy', url: `${B}/d/d9/MK8_Wendy_Icon.png/70px-MK8_Wendy_Icon.png` },
  { id: 'iggy', name: 'Iggy', url: `${B}/d/dd/MK8_Iggy_Icon.png/70px-MK8_Iggy_Icon.png` },
  { id: 'roy', name: 'Roy', url: `${B}/3/3e/MK8_Roy_Icon.png/70px-MK8_Roy_Icon.png` },
  { id: 'lemmy', name: 'Lemmy', url: `${B}/f/fc/MK8_Lemmy_Icon.png/70px-MK8_Lemmy_Icon.png` },
  { id: 'ludwig', name: 'Ludwig', url: `${B}/a/a8/MK8_Ludwig_Icon.png/70px-MK8_Ludwig_Icon.png` },

  // Yoshi couleurs
  { id: 'yoshi-green', name: 'Yoshi Vert', url: `${B}/9/91/MK8_Yoshi_Icon.png/70px-MK8_Yoshi_Icon.png` },
  { id: 'yoshi-red', name: 'Yoshi Rouge', url: `${B}/b/b4/MK8_Red_Yoshi_Icon.png/70px-MK8_Red_Yoshi_Icon.png` },
  { id: 'yoshi-blue', name: 'Yoshi Bleu', url: `${B}/c/cc/MK8_Blue_Yoshi_Icon.png/70px-MK8_Blue_Yoshi_Icon.png` },
  { id: 'yoshi-yellow', name: 'Yoshi Jaune', url: `${B}/c/c7/MK8_Yellow_Yoshi_Icon.png/70px-MK8_Yellow_Yoshi_Icon.png` },
  { id: 'yoshi-pink', name: 'Yoshi Rose', url: `${B}/4/4f/MK8_Pink_Yoshi_Icon.png/70px-MK8_Pink_Yoshi_Icon.png` },
  { id: 'yoshi-lightblue', name: 'Yoshi Bleu clair', url: `${B}/8/8c/MK8_Light-Blue_Yoshi_Icon.png/70px-MK8_Light-Blue_Yoshi_Icon.png` },
  { id: 'yoshi-black', name: 'Yoshi Noir', url: `${B}/5/5c/MK8_Black_Yoshi_Icon.png/70px-MK8_Black_Yoshi_Icon.png` },
  { id: 'yoshi-white', name: 'Yoshi Blanc', url: `${B}/3/3f/MK8_White_Yoshi_Icon.png/70px-MK8_White_Yoshi_Icon.png` },
  { id: 'yoshi-orange', name: 'Yoshi Orange', url: `${B}/8/89/MK8_Orange_Yoshi_Icon.png/70px-MK8_Orange_Yoshi_Icon.png` },

  // Shy Guy couleurs
  { id: 'shyguy-red', name: 'Maskass Rouge', url: `${B}/7/7f/MK8_ShyGuy_Icon.png/70px-MK8_ShyGuy_Icon.png` },
  { id: 'shyguy-blue', name: 'Maskass Bleu', url: `${B}/4/41/MK8_Blue_Shy_Guy_Icon.png/70px-MK8_Blue_Shy_Guy_Icon.png` },
  { id: 'shyguy-green', name: 'Maskass Vert', url: `${B}/7/74/MK8_Green_Shy_Guy_Icon.png/70px-MK8_Green_Shy_Guy_Icon.png` },
  { id: 'shyguy-yellow', name: 'Maskass Jaune', url: `${B}/d/d3/MK8_Yellow_Shy_Guy_Icon.png/70px-MK8_Yellow_Shy_Guy_Icon.png` },
  { id: 'shyguy-pink', name: 'Maskass Rose', url: `${B}/b/bf/MK8_Pink_Shy_Guy_Icon.png/70px-MK8_Pink_Shy_Guy_Icon.png` },
  { id: 'shyguy-lightblue', name: 'Maskass Bleu clair', url: `${B}/d/d9/MK8_Light-Blue_Shy_Guy_Icon.png/70px-MK8_Light-Blue_Shy_Guy_Icon.png` },
  { id: 'shyguy-black', name: 'Maskass Noir', url: `${B}/5/57/MK8_Black_Shy_Guy_Icon.png/70px-MK8_Black_Shy_Guy_Icon.png` },
  { id: 'shyguy-white', name: 'Maskass Blanc', url: `${B}/2/20/MK8_White_Shy_Guy_Icon.png/70px-MK8_White_Shy_Guy_Icon.png` },
  { id: 'shyguy-orange', name: 'Maskass Orange', url: `${B}/9/9e/MK8_Orange_Shy_Guy_Icon.png/70px-MK8_Orange_Shy_Guy_Icon.png` },

  // Inkling
  { id: 'inkling-girl', name: 'Fille Inkling', url: `${B}/b/b9/MK8DX_Female_Inkling_Icon.png/70px-MK8DX_Female_Inkling_Icon.png` },
  { id: 'inkling-boy', name: 'Garçon Inkling', url: `${B}/3/3c/MK8DX_Male_Inkling_Icon.png/70px-MK8DX_Male_Inkling_Icon.png` },
  { id: 'inkling-purple', name: 'Inkling Violet', url: `${B}/b/ba/MK8D_Purple_Inkling_Icon.png/70px-MK8D_Purple_Inkling_Icon.png` },
  { id: 'inkling-cyan', name: 'Inkling Cyan', url: `${B}/e/e6/MK8D_Cyan_Inkling_Icon.png/70px-MK8D_Cyan_Inkling_Icon.png` },
  { id: 'inkling-green', name: 'Inkling Vert', url: `${B}/a/a8/MK8D_Green_Inkling_Icon.png/70px-MK8D_Green_Inkling_Icon.png` },
  { id: 'inkling-pink', name: 'Inkling Rose', url: `${B}/1/14/MK8D_Pink_Inkling_Icon.png/70px-MK8D_Pink_Inkling_Icon.png` },

  // DLC divers
  { id: 'birdo', name: 'Birdo', url: `${B}/f/f6/MK8D_Birdo_Icon.png/70px-MK8D_Birdo_Icon.png` },
  { id: 'pauline', name: 'Pauline', url: `${B}/d/dd/MK8DX_Pauline_Icon.png/70px-MK8DX_Pauline_Icon.png` },
  { id: 'funkykong', name: 'Funky Kong', url: `${B}/4/4a/MK8DX_Funky_Kong_Icon.png/70px-MK8DX_Funky_Kong_Icon.png` },
  { id: 'diddykong', name: 'Diddy Kong', url: `${B}/8/82/MK8DX_Diddy_Kong_Icon.png/70px-MK8DX_Diddy_Kong_Icon.png` },
  { id: 'link', name: 'Link', url: `${B}/9/9e/MK8D_BotW_Link_Icon.png/70px-MK8D_BotW_Link_Icon.png` },
  { id: 'villager-m', name: 'Villageois', url: `${B}/1/16/VillagerMale-Icon-MK8.png/70px-VillagerMale-Icon-MK8.png` },
  { id: 'villager-f', name: 'Villageoise', url: `${B}/c/c3/VillagerFemale-Icon-MK8.png/70px-VillagerFemale-Icon-MK8.png` },
  { id: 'isabelle', name: 'Marie', url: `${B}/2/20/MK8_Isabelle_Icon.png/70px-MK8_Isabelle_Icon.png` },
  { id: 'mii', name: 'Mii', url: `${B}/b/bb/Mii_MK8.png/70px-Mii_MK8.png` },
];
