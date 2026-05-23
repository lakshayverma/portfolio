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
const gamesData = {
  'Elden Ring': {
    desc: 'inspired by the dark fantasy, decaying grandeur, and intricate gothic architecture of the Lands Between',
    templates: ['Bandit dodging Maliketh', 'Malenia Waterfowl Dance', 'Tarnished looking at Erdtree', 'Fighting Radahn in the dunes', 'Casting Comet Azur beam', 'Godrick grafting a dragon head', 'Exploring deep Nokron', 'Ranni the Witch sitting', 'Riding Torrent in Caelid', 'Godskin Duo fight']
  },
  'Elden Ring Nightreign': {
    desc: 'immersed in an oppressive, eternal night filled with cosmic dread, stellar magic, and lingering shadows',
    templates: ['Shadow beast in tall grass', 'Gloam-Eyed Queen with black flame', 'Dark sun eclipse over Erdtree', 'Stealth kill under moonlight', 'Casting starlight magic', 'Godskin ritual in catacombs', 'Moon Presence descending', 'Riding through glowing blue grass', 'Fighting starry knight', 'Exploring obsidian throne room']
  },
  'Cyberpunk 2077': {
    desc: 'featuring a high-tech, low-life dystopian aesthetic with neon-drenched brutalist cityscapes',
    templates: ['Netrunner short-circuiting enemies', 'Slicing bullet with thermal katana', 'Driving retro car on neon highway', 'MaxTac standoff', 'Dune buggy in Badlands', 'Cybernetic arm install', 'Leaping with Mantis Blades', 'Drinking in the Afterlife', 'Firing smart weapon through wall', 'Motorcycle wheelie in rain']
  },
  'Call of Duty': {
    desc: 'rendered in a hyper-realistic, gritty, modern military tactical style suited for {{goal}}',
    templates: ['Sniper scope glinting', 'Sliding in Gulag', 'Firing Ray Gun at zombies', 'Stacking up on a door with NVGs', 'Fighting over a loadout drop', 'Walking away from crashed heli', 'Firing in the final circle gas', 'Throwing a flashbang', 'Planting C4 on a tank', 'Executing a finishing move']
  },
  'Ghost of Yotei': {
    desc: 'featuring a breathtaking, wind-swept feudal Japanese aesthetic centered around a towering snow-capped volcano',
    templates: ['Dual wielding in spider lilies', 'Petting wolf companion in snow', 'Mount Yotei erupting', 'Dropping from pine branch', 'Playing shamisen by campfire', 'Samurai standoff on frozen lake', 'Firing matchlock rifle', 'Riding horse through autumn leaves', 'Deflecting an arrow', 'Meditating at a shrine']
  },
  'FC2026': {
    desc: 'capturing the high-octane, photorealistic broadcast quality of a modern global football stadium under floodlights',
    templates: ['Bicycle kick in mid-air', 'Opening Ultimate Team pack', 'Lifting World Cup trophy', 'Goalkeeper top bin save', 'Muddy slide tackle', 'Manager shouting in locker room', 'Free kick wall standoff', 'Scoring a penalty', 'Celebrating with fans', 'Dribbling past defender']
  },
  'Assassin Creed': {
    desc: 'blending breathtaking historical authenticity with cinematic parkour action and subtle sci-fi animus undertones',
    templates: ['Perched on pagoda roof', 'Smashing door with kanabo', 'Hooded figure with glowing talisman', 'Leap of faith into hay', 'Galleon firing broadside', 'Animus glitching environment', 'Hidden blade drop assassination', 'Blending into a crowd', 'Eagle flying over city', 'Fighting templar captain']
  },
  'Stardew Valley': {
    desc: 'utilizing a charming, vibrant, and cozy pastoral aesthetic with warm, inviting colors',
    templates: ['Watering crops in spring', 'Fishing by the ocean', 'Mining in the skull cavern', 'Dancing at the flower festival', 'Petting a cow', 'Riding horse through town', 'Decorating the farmhouse', 'Fighting slimes', 'Harvesting a giant pumpkin', 'Watching the moonlight jellies']
  },
  'Dark Souls': {
    desc: 'steeped in a bleak, oppressive, and dying world aesthetic with ash-covered ruins',
    templates: ["Lighting a bonfire", "Praising the sun", "Fighting Ornstein and Smough", "Walking through Sen's Fortress", "Parrying a black knight", "Drinking estus flask", "Dodging Asylum Demon", "Opening a mimic chest", "Staring at Anor Londo", "Gwyn lord of cinder battle"]
  }
};

Object.entries(gamesData).forEach(([game, data]) => {
  const filename = game.toLowerCase().replace(/\\s+/g, '-');
  const gameConfig = {
    id: filename,
    category: 'Games',
    name: game,
    descriptionTemplate: data.desc,
    templates: data.templates
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
