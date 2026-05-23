const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..', 'data');
const globalDir = path.join(rootDir, 'global');
const subjectsDir = path.join(rootDir, 'subjects');

// Ensure directories exist
[
  globalDir,
  path.join(subjectsDir, 'games'),
  path.join(subjectsDir, 'movies'),
  path.join(subjectsDir, 'books'),
  path.join(subjectsDir, 'software'),
  path.join(subjectsDir, 'abstract')
].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Global Config
const globalConfig = {
  options: {
    contexts: ['Image Prompt', 'YouTube Description', 'Twitter/X Post', 'Instagram Caption'],
    syntaxes: ['Midjourney', 'Gemini', 'ChatGPT', 'NanoBanana'],
    ratios: ['16:9', '1:1', '4:5', '9:16', '21:9'],
    platforms: ['YouTube', 'Twitter/X', 'Instagram', 'TikTok', 'Twitch'],
    elements: ['fire', 'camp', 'forest', 'mountains', 'stars', 'magic aura', 'rain', 'fog', 'snow', 'blood']
  },
  dictionaries: {
    timeOfDay: {
      'Golden Hour': 'bathed in warm, cinematic golden hour light, casting long dramatic shadows to emphasize the {{tone}} atmosphere',
      'Midnight': 'illuminated solely by stark moonlight and ambient emissive glows against a pitch-black, star-studded sky',
      'Overcast': 'under a flat, moody overcast sky providing soft, diffused lighting and muted colors',
      'Stormy': 'lit by sudden, dramatic flashes of lightning amidst churning, dark storm clouds',
      'Neon Night': 'illuminated by harsh, artificial neon lights casting deep, colorful reflections'
    },
    tone: {
      'Epic': 'conveying a sense of grand, monumental scale and overwhelming awe',
      'Grim': 'steeped in a dark, oppressive, and melancholic atmosphere',
      'Cozy': 'evoking a profound sense of warmth, safety, and tranquil comfort',
      'Mysterious': 'shrouded in enigma and fog, suggesting hidden depths and untold secrets',
      'Action-Packed': 'capturing a frozen moment of high-kinetic energy and explosive motion',
      'Tactical': 'feeling calculated, precise, and high-stakes'
    },
    imageStyle: {
      'Cinematic 3D': 'rendered in Unreal Engine 5 style, photorealistic, 35mm lens, volumetric fog, ray-traced lighting',
      'Stylized 2D': 'vibrant vector-style illustration, cel-shaded, clean lines, inspired by Studio Ghibli',
      'Dark Fantasy Art': 'painterly digital art style, heavy brushstrokes, chiaroscuro lighting, reminiscent of Frank Frazetta',
      'Anime Style': 'high-quality anime key visual style, dynamic perspective, vibrant FX animation frames',
      'Broadcast Realism': 'ultra-realistic, 8k resolution, sports photography style with deep depth of field'
    },
    fontStyle: {
      'Bold Serif': 'designed to complement bold, elegant serif typography',
      'Cyber Glitch': 'designed to complement aggressive, neon-glitching cyberpunk typography',
      'Soft Rounded': 'designed to complement gentle, rounded, and playful typography',
      'Blocky Impact': 'designed to complement massive, high-impact block lettering',
      'Elegant Script': 'designed to complement flowing, historical calligraphy or script fonts'
    },
    textPlacements: {
      'Top Left': 'ensure a clear, uncluttered negative space in the top-left quadrant',
      'Center Bottom': 'maintain a dark, low-detail area across the bottom center',
      'Right Third': 'keep the right-hand third of the composition relatively empty and low-contrast',
      'Top Center': 'leave the top-middle area free of complex details for centered text'
    },
    goal: {
      'High CTR': 'optimized for thumbnail readability, utilizing extreme contrast, vibrant focal points, and clear silhouettes',
      'Lore Focus': 'packed with subtle environmental storytelling, authentic runic details, and canon-accurate artifacts',
      'Vibe / Relaxing': 'prioritizing a soothing color palette and harmonious composition to induce relaxation',
      'Hype / Reaction': 'designed to induce excitement with extreme facial expressions or explosive background action'
    },
    elements: {
      'fire': 'roaring, chaotic magical fire illuminating the surroundings',
      'camp': 'a rustic, weathered adventuring campsite providing brief sanctuary',
      'forest': 'a dense, overgrown ancient forest shrouded in thick canopy shadows',
      'mountains': 'towering, jagged mountain peaks reaching into a turbulent sky',
      'stars': 'a brilliant, sprawling celestial starlight canopy piercing the darkness',
      'magic aura': 'a crackling, ethereal magic aura radiating immense raw power',
      'rain': 'heavy, cinematic pouring rain reflecting ambient environmental lights',
      'fog': 'a thick, clinging, and mysterious ground fog obscuring fine details',
      'snow': 'a relentless, driving blizzard covering the desolate landscape in white',
      'blood': 'visceral, dramatic blood splatters telling a story of intense conflict'
    }
  }
};
fs.writeFileSync(path.join(globalDir, 'config.json'), JSON.stringify(globalConfig, null, 2));

// Global Macros
const macrosConfig = {
  keywords: {
    '@ER_Dex': ['Dexterity Build', 'Bleed', 'Katanas', 'Daggers', 'No Hit'],
    '@BossFight': ['Boss Battle', 'Hard Difficulty', 'Clutch', 'Epic Encounter', 'Sweaty'],
    '@CozyVibe': ['Relaxing', 'Chill Stream', 'No Commentary', 'Atmospheric', 'Background Music'],
    '@Tactical': ['High Kill', 'Meta Loadout', 'Clutch Win', 'Ranked Play', "Sweaty"],
    '@Lore': ['Story Mode', 'Deep Lore', 'Secrets', 'Exploration', 'Easter Eggs'],
    '@Cyberpunk_Hacker': ['Netrunner', 'Quickhacks', 'Stealth', 'Overpowered'],
    '@Sports_Hype': ['Goal of the Season', 'Clutch Save', 'Last Minute', 'Career Mode']
  },
  tones: {
    '@Dark': ['Grim', 'Mysterious'],
    '@Hype': ['Epic', 'Action-Packed'],
    '@Chill': ['Cozy', 'Vibe / Relaxing'],
    '@Sweaty': ['Tactical', 'Action-Packed']
  },
  elements: {
    '@Nature': ['forest', 'mountains', 'rain'],
    '@Combat': ['blood', 'fire', 'magic aura'],
    '@Cozy': ['camp', 'stars', 'snow'],
    '@Spooky': ['fog', 'blood', 'stars']
  }
};
fs.writeFileSync(path.join(globalDir, 'macros.json'), JSON.stringify(macrosConfig, null, 2));

// Games Data
const CORE_SUBJECTS = {
  'Elden Ring': [
    'A nimble bandit executing a perfectly timed roll, narrowly dodging a massive, sweeping black blade from Maliketh. Dust kicks up in the ruined arena, illuminated by golden tree fragments falling from the sky.',
    'Malenia gracefully launching into her terrifying Waterfowl Dance. Scarlet rot petals bloom in mid-air as she descends with blinding speed toward a desperate challenger.',
    'A solitary Tarnished standing atop a crumbling precipice, staring in awe at the colossal, glowing Erdtree dominating the horizon. The golden light reflects off their battle-scarred armor.',
    'An epic confrontation with Starscourge Radahn in the sweeping, desolate dunes of Caelid. Massive purple gravity magic crackles as the gigantic general charges on his impossibly small steed.',
    'A powerful sorcerer planting their staff into the ground to unleash the blinding, concentrated energy beam of Comet Azur. Magical shockwaves ripple across the ancient stone floor.',
    'Godrick the Grafted screaming in agony and triumph as he violently grafts a freshly severed, roaring dragon head onto his arm. Sparks and flames burst from the necrotic amalgamation.',
    'A cautious explorer navigating the hauntingly beautiful, underground eternal city of Nokron. Bioluminescent flora and shimmering false stars cast an otherworldly blue glow over the silent ruins.',
    'Ranni the Witch sitting gracefully atop a stone tower wall, bathed in soft moonlight. Her spectral secondary face faintly overlaps her doll-like features as she gazes thoughtfully into the distance.',
    'A mounted warrior riding the spectral steed Torrent through the scarlet-rot corrupted swamps of Caelid. Monstrous dog-creatures loom ominously in the blood-red, hazy background.',
    'A nightmarish encounter with the Godskin Duo in a grand, ruined temple. Black flame magic spirals dangerously between the impossibly thin apostle and the grotesque noble.'
  ],
  'Elden Ring Nightreign': [
    'A terrifying shadow beast prowling silently through tall, luminescent grass. Its countless eyes gleam with a predatory cosmic hunger in the pitch-black environment.',
    'The enigmatic Gloam-Eyed Queen standing amidst a field of defeated demigods, channeling crackling black flame. Her presence distorts the very fabric of the surrounding shadows.',
    'A catastrophic dark sun eclipse hovering ominously over the decaying Erdtree. Corrupted golden ash rains down on the twisted, shadowy landscape below.',
    'A stealthy assassin executing a brutal stealth kill on a heavily armored knight under the pale light of a fragmented moon. Blood mists rapidly into the cold night air.',
    'An astronomer-mage weaving intricate starlight magic that shatters the surrounding darkness. Crystalline projectiles hover menacingly before launching at an unseen horror.',
    'A horrifying Godskin ritual taking place deep within an obsidian catacomb. Eerie green torches cast long, writhing shadows against the fleshy walls.',
    'A Lovecraftian Moon Presence descending gracefully from a starry rift in the sky. Its eldritch form defies geometry, driving onlookers to madness.',
    'A rider tearing through a vast field of glowing, ethereal blue grass. The wind whips past as unseen cosmic entities chase them through the eternal night.',
    'A desperate clash against a towering knight clad in armor forged from fallen stars. Each strike of his blade leaves a trail of galaxy-like nebula dust.',
    'A slow, dread-inducing exploration of a colossal obsidian throne room. A massive, shadowy figure slumbers on the throne, breathing out waves of cold dark magic.'
  ],
  'Cyberpunk 2077': [
    'A high-level Netrunner effortlessly short-circuiting multiple heavily armed corporate guards. Red digital artifacts glitch aggressively across the guards\' glowing optical implants.',
    'A hyper-agile street samurai slicing a mid-air sniper bullet in half with a glowing thermal katana. Neon signs from the bustling street below reflect off the burning blade.',
    'Driving a heavily modified, retro-futuristic sports car at breakneck speeds down a rain-slicked neon highway. Taillights streak into long red blurs against the dystopian skyline.',
    'A tense, rain-soaked standoff against a squad of elite MaxTac operators descending from an AV. Their multi-optic visors glow threateningly through the heavy city smog.',
    'A heavily armored Nomad dune buggy tearing across the harsh, dusty Badlands. A massive solar array looms in the background under a blistering, polluted sun.',
    'A gritty, first-person perspective of a ripperdoc violently installing a gleaming chrome cybernetic arm. Sparks fly as neural interfaces are painfully connected.',
    'A cyber-enhanced assassin leaping from a skyscraper rooftop, Mantis Blades fully extended. Below, the sprawling, multi-layered city of Night City pulses with corporate advertisements.',
    'A neon-lit scene at the Afterlife bar. A heavily augmented mercenary raises a brightly colored synthetic cocktail while a holographic dancer performs on the ceiling.',
    'Firing a smart weapon directly through a reinforced concrete wall. The micro-missiles curve mid-air, tracking heat signatures of heavily armored targets hiding behind cover.',
    'Executing a perfect motorcycle wheelie in the pouring rain. The neon glow of Japantown reflects vividly in the puddles as pedestrians scatter in panic.'
  ],
  'Call of Duty': [
    'The terrifying glint of an enemy sniper scope reflecting off a distant, war-torn building window. Dust motes float lazily in the sunbeam crossing the tense urban battlefield.',
    'A desperate, muddy slide maneuver through the concrete showers of the Gulag. Tracers whiz past as the operator readies a battered shotgun for close-quarters combat.',
    'A chaotic last stand firing the iconic Ray Gun into a massive, swarming horde of undead zombies. Ethereal green plasma illuminates the blood-splattered walls of the dark facility.',
    'A highly trained Tier One squad stacking up flawlessly on a breached door. The green hue of night-vision goggles casts a tactical, eerie light on their focused faces.',
    'A frantic, multi-team firefight erupting over a freshly dropped loadout crate. Red smoke billows violently, obscuring the chaotic close-quarters engagements.',
    'A lone operator walking away casually from a burning, downed helicopter. The massive explosion behind them sends shockwaves through the dense jungle foliage.',
    'Firing wildly while running through the thick, toxic green gas of the final circle. The operator\'s gas mask is cracked, and vision is blurring rapidly.',
    'A tactical breach initiated by tossing a flashbang through a shattered window. The blinding white detonation freezes the enemy combatants in stark silhouette.',
    'A daring maneuver planting C4 directly onto the armored hull of a moving enemy tank. The operator dives into a trench just as the explosive is detonated.',
    'Executing a brutal, hand-to-hand finishing move on an unaware opponent. The muddy, blood-soaked environment adds visceral realism to the combat takedown.'
  ],
  'Ghost of Yotei': [
    'A fierce samurai dual-wielding katanas amidst a sprawling field of crimson spider lilies. The wind whips their traditional garb as they stare down a group of heavily armored bandits.',
    'A quiet, tender moment petting a massive, scarred wolf companion in the deep, pristine snow. The serene silence of the winter mountain contrasts with the violence of the era.',
    'The towering Mount Yotei violently erupting in the distance. The sky turns a terrifying ash-gray and orange, raining embers down upon a panicked feudal village.',
    'A stealthy assassin dropping silently from the high branch of an ancient pine tree. The moonlight glints off their unsheathed wakizashi just before impact.',
    'A weary traveler playing a melancholy tune on a shamisen by a crackling campfire. The sparks dance up toward a brilliant, unpolluted starry night sky.',
    'A cinematic samurai standoff on the center of a perfectly frozen, glass-like lake. The reflection of the combatants is perfectly mirrored beneath the ice.',
    'A loud, smoky volley fired from an early matchlock rifle. The heavy recoil pushes the ashigaru back as the devastating projectile shatters enemy armor.',
    'Riding a swift horse through a dense, golden forest shedding autumn leaves. The movement creates a vortex of red and yellow foliage trailing behind the rider.',
    'A superhuman display of reflexes, deflecting a flaming arrow mid-flight with a swift katana strike. The sparks from the deflected arrow illuminate the samurai\'s determined eyes.',
    'A serene moment meditating deeply at a weathered, moss-covered Inari shrine. Ghostly fox spirits seem to dance at the edge of the warrior\'s peripheral vision.'
  ],
  'FC2026': [
    'A breathtaking, acrobatic bicycle kick suspended in mid-air. The stadium lights flare intensely as the player connects perfectly with the ball against a roaring crowd.',
    'The adrenaline-pumping, glowing animation of opening a top-tier Ultimate Team pack. Golden confetti and blinding flares erupt as a legendary player walks out.',
    'The euphoric moment of a team captain lifting the massive, golden World Cup trophy. Flashbulbs from thousands of cameras create a blinding, celebratory sea of light.',
    'A desperate, fully extended goalkeeper making a miraculous top-corner save. The tension of the match is visible in the strained muscles and flying turf.',
    'A gritty, aggressive slide tackle in the pouring rain. Mud and water splash violently as two players clash heavily for possession of the slick ball.',
    'A passionate manager shouting intense tactical instructions in the locker room. Veins bulge on their neck as the players listen with exhausted, determined expressions.',
    'A high-tension standoff as a player prepares to take a crucial free kick. The defensive wall jumps in unison, their faces grimacing in anticipation of the strike.',
    'The sheer focus of a striker stepping up to the penalty spot. The deafening noise of the stadium seems to fade into a cinematic, heart-pounding silence.',
    'A wild, uninhibited celebration as a player dives into the roaring crowd. Fans reach out in pure ecstasy, their faces painted in team colors.',
    'A phenomenal display of footwork, effortlessly dribbling past a stumbling defender. The camera captures the motion blur of the insanely fast, precise movements.'
  ],
  'Assassin Creed': [
    'A hooded assassin perched silently on the sweeping, tiled roof of a majestic pagoda. Below, patrolling guards are entirely unaware of the deadly threat looming above.',
    'A hulking enforcer violently smashing through a wooden paper-door with a massive spiked kanabo. Splinters fly outward as the chaotic brawl spills into the courtyard.',
    'A mysterious, cloaked figure holding a glowing, Isu-crafted talisman. The ancient technology pulses with a brilliant golden light, illuminating dusty catacomb walls.',
    'A breathtaking, stomach-dropping Leap of Faith from a massive cathedral spire. The wind rushes past the assassin as they free-fall toward a small cart of hay.',
    'A massive, heavily armed galleon firing a devastating broadside of cannons. Plumes of thick black smoke and splintering wood fill the chaotic naval battlefield.',
    'The historical environment violently glitching and tearing, revealing the glowing blue wireframes of the Animus simulation beneath the cobblestone streets.',
    'A flawless, aerial hidden-blade assassination dropping directly onto an unaware target. The sudden, lethal strike is executed with terrifying, mechanical precision.',
    'The assassin seamlessly blending into a bustling, vibrant market crowd. They subtly slip a poisoned blade into a passing noble without breaking stride.',
    'A majestic eagle soaring high above a sprawling, historically accurate ancient city. The sweeping cinematic view reveals bustling ports, massive temples, and distant mountains.',
    'An intense, prolonged sword duel against a heavily armored Templar captain. Sparks fly as heavy steel clashes against nimble, parrying daggers.'
  ],
  'Stardew Valley': [
    'A diligent farmer watering a massive field of vibrant, blooming spring crops. The early morning sun casts a warm, hopeful glow over the lush, green valley.',
    'A peaceful afternoon spent fishing off the weathered wooden pier by the ocean. The gentle waves lap against the shore as a rare, legendary fish suddenly bites the line.',
    'A dangerous, tense expedition deep into the perilous Skull Cavern. The dim light of a torch reveals swarms of flying serpents and glowing iridium nodes.',
    'A charming, joyous scene of villagers dancing together at the vibrant Flower Festival. Colorful petals blow through the air amidst cheerful, rustic decorations.',
    'A heartwarming moment petting a happy, well-fed cow in a sunlit barn. Dust motes dance in the sunbeams shining through the wooden slats.',
    'Riding a trusty horse briskly through the bustling center of Pelican Town. Villagers wave happily as the horse\'s hooves clop rhythmically on the cobblestone.',
    'The incredibly satisfying process of decorating the fully upgraded farmhouse. Cozy furniture, crackling fireplaces, and rare artifacts fill the welcoming space.',
    'A chaotic, fast-paced battle swinging a galaxy sword against an overwhelming swarm of colorful slimes. Viscous, gelatinous splatters cover the dungeon walls.',
    'The awe-inspiring moment of finally harvesting a massive, magical giant pumpkin. The sheer scale of the crop dwarfs the proud farmer standing beside it.',
    'The magical, serene midnight event watching the glowing Moonlight Jellies migrate. Their soft blue luminescence reflects beautifully on the dark, calm ocean.'
  ],
  'Dark Souls': [
    'A weary, battered undead warrior slowly lighting a bonfire. The sudden burst of comforting, warm orange flame provides the only solace in the oppressive darkness.',
    'A glowing, golden phantom enthusiastically praising the sun. The brilliant rays of sunlight break through the thick, dreary clouds, illuminating the dilapidated ruins.',
    'A terrifying, overwhelming boss fight against the towering Ornstein and the massive Smough. Lightning crackles and massive hammers shatter the grand marble pillars of the cathedral.',
    'A nerve-wracking, slow walk across the razor-thin, pendulum-trapped walkways of Sen\'s Fortress. The sheer drop below promises certain, repeated death.',
    'A flawless, split-second parry executed against a terrifying Black Knight. The spark of the deflected greatsword is immediately followed by a brutal, visceral riposte.',
    'A desperate, frantic moment chugging from an Estus Flask. Golden, healing light spills from the bottle just as a massive enemy winds up a lethal attack.',
    'A perfectly timed dive roll, narrowly dodging a crushing hammer slam from the Asylum Demon. The stone floor cracks and crumbles from the massive impact.',
    'The horrific, shocking moment of attempting to open a chest, only to have it unfold into a terrifying Mimic with jagged teeth and lanky limbs.',
    'A breathtaking, awe-inspiring first view of the magnificent, sun-bathed city of Anor Londo. The towering, pristine cathedrals contrast sharply with the ruin of the world below.',
    'A sorrowful, epic final duel against Gwyn, Lord of Cinder. Plaintive piano music plays as the hollowed god swings his flaming greatsword in a bed of white ash.'
  ]
};

const VARIATIONS = [
  { timeOfDay: 'Midnight', tone: ['Grim', 'Epic'], imageStyle: 'Cinematic 3D', goal: 'High CTR', primaryRatio: '16:9', elements: ['stars', 'fog'] },
  { timeOfDay: 'Golden Hour', tone: ['Epic'], imageStyle: 'Dark Fantasy Art', goal: 'Lore Focus', primaryRatio: '21:9', elements: ['magic aura'] },
  { timeOfDay: 'Overcast', tone: ['Mysterious'], imageStyle: 'Stylized 2D', goal: 'Vibe / Relaxing', primaryRatio: '16:9', elements: ['rain'] },
  { timeOfDay: 'Stormy', tone: ['Action-Packed'], imageStyle: 'Anime Style', goal: 'Hype / Reaction', primaryRatio: '4:5', elements: ['rain', 'blood'] },
  { timeOfDay: 'Neon Night', tone: ['Tactical'], imageStyle: 'Broadcast Realism', goal: 'High CTR', primaryRatio: '1:1', elements: ['fire'] },
];

const GAME_DESCRIPTIONS = {
  'Elden Ring': 'inspired by the dark fantasy, decaying grandeur, and intricate gothic architecture of the Lands Between',
  'Elden Ring Nightreign': 'immersed in an oppressive, eternal night filled with cosmic dread, stellar magic, and lingering shadows',
  'Cyberpunk 2077': 'featuring a high-tech, low-life dystopian aesthetic with neon-drenched brutalist cityscapes',
  'Call of Duty': 'rendered in a hyper-realistic, gritty, modern military tactical style suited for {{goal}}',
  'Ghost of Yotei': 'featuring a breathtaking, wind-swept feudal Japanese aesthetic centered around a towering snow-capped volcano',
  'FC2026': 'capturing the high-octane, photorealistic broadcast quality of a modern global football stadium under floodlights',
  'Assassin Creed': 'blending breathtaking historical authenticity with cinematic parkour action and subtle sci-fi animus undertones',
  'Stardew Valley': 'utilizing a charming, vibrant, and cozy pastoral aesthetic with warm, inviting colors',
  'Dark Souls': 'steeped in a bleak, oppressive, and dying world aesthetic with ash-covered ruins'
};

Object.entries(CORE_SUBJECTS).forEach(([game, subjects]) => {
  const filename = game.toLowerCase().replace(/\s+/g, '-');
  
  const templates = [];
  subjects.forEach((desc, sIdx) => {
    VARIATIONS.forEach((v, vIdx) => {
      templates.push({
        title: `Template ${sIdx * 5 + vIdx + 1}`,
        description: desc,
        timeOfDay: v.timeOfDay,
        tone: v.tone,
        imageStyle: v.imageStyle,
        goal: v.goal,
        primaryRatio: v.primaryRatio,
        additionalElements: v.elements
      });
    });
  });

  const gameConfig = {
    id: filename,
    category: 'Games',
    name: game,
    descriptionTemplate: GAME_DESCRIPTIONS[game],
    templates: templates
  };
  fs.writeFileSync(path.join(subjectsDir, 'games', `${filename}.json`), JSON.stringify(gameConfig, null, 2));
});

// Create some dummy entries for other categories
fs.writeFileSync(path.join(subjectsDir, 'movies', 'interstellar.json'), JSON.stringify({
  id: 'interstellar',
  category: 'Movies',
  name: 'Interstellar',
  descriptionTemplate: 'A visually stunning epic featuring massive black holes, tesseracts, and endless cosmos with Hans Zimmer vibes',
  templates: ["Docking scene", "Miller's planet wave", "Cooper inside the tesseract"]
}, null, 2));

fs.writeFileSync(path.join(subjectsDir, 'software', 'nextjs-app.json'), JSON.stringify({
  id: 'nextjs-app',
  category: 'Software',
  name: 'Next.js App',
  descriptionTemplate: 'A modern React application architecture focusing on server-side rendering and edge computing',
  templates: ['Developer debugging', 'Deployment to Vercel', 'High performance Lighthouse score']
}, null, 2));

console.log('Data structure created successfully!');
