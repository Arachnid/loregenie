export default {
    prompt: `
You are a fantasy role-playing game NPC character generator. When prompted with a character concept, generate an NPC description in the following format:

name: <NPC's first and last name(s) (if any)>
race: <NPC's race>
gender: <NPC's gender, or 'None' if not applicable>
age: <NPC's age in years. Should be appropriate to the NPC's race.>
profession: <NPC's profession>
alignment: <NPC's alignment>
summary: <A 1-sentence summary of the NPC.>
appearance: <A paragraph describing the NPC's appearance. Do not include the NPC's name in the description.>
headshot: <A series of comma-separated descriptors of a character portrait of the NPC. Start with the NPC's race, gender (or 'genderless' if not applicable), and age group (infant, child, young, middle-aged, elderly, ancient) and include short physical descriptions of everything you would see in a portrait of the NPC.>
personality: <A paragraph describing the NPC's personality in detail.>
ideals: <A sentence describing the standard the NPC holds themselves to, written in first-person.>
bonds: <A sentence describing the NPC's connection to people, places, or items, written in first-person.>
flaws: <A sentence describing the NPC's weaknesses, written in first person.>
diction: <A paragraph describing how the NPC speaks. Include accent, pitch and intonation, vocabulary, favorite phrases etc.>
background: <A paragraph describing the NPC's history and background.>

`,
    samples: [
        "an enchanted talking tree",
        "a mischievous imp disguised as a child",
        "a ghostly pirate captain seeking redemption",
        "a shape-shifting werewolf noble",
        "a cursed mermaid seeking revenge",
        "a haunted puppet master with deadly puppets",
        "a vengeful banshee trapped in mirror",
        "a powerful genie bound to a cursed lamp",
        "an ancient dragon disguised as a human",
        "a time-traveling wizard seeking lost artifacts",
        "a wealthy merchant with hidden motives",
        "a skilled blacksmith with a troubled past",
        "a street-smart orphan turned pickpocket",
        "an arrogant noble with a secret addiction",
        "a street performer with a hidden talent",
        "a sly tavern owner with a hidden stash",
        "a mysterious beggar with magical abilities",
        "a charismatic con artist with a heart of gold",
        "a gruff town guard with a soft spot for animals",
        "a kind-hearted healer with a tragic past",
        "a wandering bard with a tragic past",
        "a tired traveling merchant with exotic wares",
        "a weary adventurer seeking treasure",
        "a wild-eyed prophet with cryptic messages",
        "a gruff mercenary seeking new recruits",
        "a suspicious wanderer with a hidden stash",
        "a robust farmer with a bounty of fresh produce",
        "a disgraced knight seeking redemption",
        "an eccentric hermit with ancient knowledge",
        "a fearsome bounty hunter with a wanted poster",
        "a bewitched forest spirit seeking freedom",
        "a cursed princess seeking a true love's kiss",
        "an enchanted talking animal seeking its true form",
        "a long-lost relative seeking help reclaiming their inheritance",
        "a powerful wizard seeking a powerful artifact",
        "a ghostly captain seeking a lost treasure",
        "an ancient dragon seeking a worthy successor",
        "a haunted mansion seeking a hero to banish its ghosts",
        "a cursed village seeking a hero to lift its curse",
        "a beautiful mermaid seeking a human to break her curse",
        "a wise old hermit who is actually a powerful wizard",
        "a bumbling town guard who is secretly a master swordsman",
        "a wealthy merchant who is actually a notorious thief",
        "a street performer who is actually a powerful sorcerer",
        "a gruff old farmer who is actually a wise seer",
        "an arrogant noble who is actually a kind-hearted orphan",
        "a disgraced knight who is actually a skilled healer",
        "a fearsome mercenary who is secretly a soft-hearted poet",
        "a skilled blacksmith who is secretly a master alchemist",
        "an eccentric hermit who is actually a former king in hiding",
        "a talking sword with a chip on its blade",
        "a shape-shifting glob of sentient slime",
        "a one-eyed, cyborg dwarf",
        "a fire-breathing, vegetarian dragon",
        "a telepathic, pacifist orc",
        "a zombie plague doctor",
        "an undead, opera-singing pirate",
        "a time-traveling, space-faring gnome",
        "a sentient, carnivorous plant",
        "a living golem made of candy",
    ],
    loadingMessages: [
        "Simulating life story...",
        "Generating backstory...",
        "Crafting personality traits...",
        "Determining motivations...",
        "Calculating daily routine...",
        "Programming interactions...",
        "Simulating emotions...",
        "Generating goals and aspirations...",
        "Crafting appearance...",
        "Loading catchphrases...",
        "Simulating first love...",
        "Generating an epic battle...",
        "Crafting the perfect heist...",
        "Determining the outcome of a high-stakes game of chance...",
        "Calculating reaction to the discovery of a long-lost relative...",
        "Programming response to a major betrayal...",
        "Simulating a life-changing decision...",
        "Generating a triumphant moment...",
        "Crafting a heartwarming reunion...",
        "Loading a devastating loss...",
    ],
    deleteCategories: [
        'hate',
        'hate/threatening',
        'sexual/minors',
        'violence/graphic',
    ],
    imagePromptPrefix: 'd&d character portrait, headshot, centered',
    imagePromptSuffix: 'various colors, fantastic, in the style of kerem beyit, Kieran Yanner',
    negativeImagePrompt: 'truncated, poorly drawn, badly framed, cgi, photograph, photo, runes',
    imageGenerationHost: 'https://grpc.stability.ai:443',
    imageSize: 512,
    imageModel: 'stable-diffusion-512-v2-0',
    imageSteps: 30,
    imageCfgScale: 7,
    model: 'text-davinci-003',
    baseUrl: 'https://loregenie.com',
    gcsBucket: 'static.loregenie.com',
    imageRetries: 3,
};