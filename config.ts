export default {
    prompt: `
You are a fantasy role-playing game NPC character generator. When prompted with a character concept, generate an NPC description.

User: A wise old bard

Name: Isla Ravenbreeze
Race: Half-Elf
Gender: Female
Age: 81
Profession: Bard
Alignment: Neutral Good
Physical description: An elderly female half-elf with long, silver hair and almond-shaped eyes. Her skin is wrinkled and her movements are slow, but her eyes still sparkle with life. She wears a tattered cloak and a simple, silver harp hangs from her belt. 
Personality: Isla is kind and wise, her years of travel and experience giving her a deep understanding of the world around her. She is patient and always willing to listen without judgement. She has a great respect for music and loves to tell stories and share her knowledge with others. She can often be found in taverns, playing her harp and spinning tales for the locals.
Speaking style: Isla speaks in a gentle, soothing voice with a light, melodic lilt. She often speaks in rhyme or meter and her words are often full of metaphor and allegory. Her storytelling is captivating, often leaving her audience spellbound and enthralled.
Background: Isla was born in the elven city of Moonwood to a human father and an elven mother. She was raised in both cultures and developed a deep love for music and storytelling. She left home at the age of 17 and began travelling around the world, collecting stories and learning new songs. She has now mastered many instruments and has been a professional bard for over sixty years, her repertoire of stories and songs extending far and wide.

User: A shady street rat

Name: Pike Riverstone
Race: Halfling
Gender: Male
Age: 23
Profession: Street Rat
Alignment: Chaotic Evil
Physical description: A short, stocky male halfling with a shock of wild, sandy-brown hair. His clothing is tattered and full of pockets, and he has a large, messy scar running down the side of his face. He carries a large leather satchel slung across his back and his hands are always moving, as if he is searching for something.
Personality: Pike is a sly and opportunistic halfling. He takes what he needs without asking and has an innate ability to sniff out a good deal. He has a quick temper and isn't afraid to use force if the situation calls for it. He enjoys gambling and will take any challenge that comes his way. He is streetwise and knows all the back alleys and shortcuts in town, and can usually be found lurking around in the shadows.
Speaking style: Pike speaks with a gruff, gravelly voice and has a tendency to pepper his speech with a variety of colorful slurs. His words come out in short, clipped phrases and he often uses slang terms to convey his meaning. He has a habit of pressing his finger to the side of his nose when speaking, as if he is trying to make sure no one hears him.
Background: Pike grew up on the streets of a large city and quickly learned how to adapt and survive in the harsh environment. He quickly developed a network of contacts and began to use his knowledge and connections to acquire wealth. He has now become a notorious figure in the criminal underworld, known for his quick reflexes and sharp wit. He has been involved in countless shady deals, but always manages to come out on top.

User: A mysterious sea-elf sorcerer

Name: Viorel Nethertide
Race: Sea Elf
Gender: Male
Age: 78
Profession: Sorcerer
Alignment: Lawful Neutral
Physical description: A tall, slim male sea-elf with pale skin and long, silver hair that reaches down to his waist. His eyes are a deep blue and he often wears a hooded cloak that hides his face. His right hand is missing, replaced with a strange, crystalline limb that glitters in the light.
Personality: Viorel is a mysterious figure and speaks rarely, preferring to stay in the shadows and observe. He is stoic and wise and his voice carries a strange, almost hypnotic quality. He has a great understanding of magic and believes in its power to shape the world. He is also deeply committed to his principles and wont be swayed by arguments of convenience.
Speaking style: Viorel speaks slowly and deliberately, choosing his words carefully so as to not reveal too much. His voice usually has a soothing quality and his accent is strange, almost like the sound of the ocean. He often mixes elvish words with the common tongue and speaks in riddles and metaphors.
Background: Viorel was born in a small village on the coast of the Sea of Sorrows. He left home at a young age, driven by a desire to explore the world and learn its secrets. As he travelled, he encountered many teachings and eventually came to master the powers of sorcery. He has now returned to his homeland and serves as a guardian of the sea and protector of those who live there. His age and experience has granted him great wisdom and power, and his mysterious presence can often be felt around the coastal towns.

User: A grumpy homeless old woman

Name: Greta Crowsybrook
Race: Human
Gender: Female
Age: 87
Profession: Homeless Wanderer
Alignment: Neutral Evil
Physical description: A small, frail-looking elderly human female with a haggard appearance and a permanent scowl on her face. Her clothes are ragged and torn, and her long, grey hair is festooned with twigs and leaves.
Personality: Greta is bitter and vengeful, with a deep mistrust of anyone she doesn't know. She is fiercely independent and refuses help or charity, preferring to find her own solutions to her problems. She is cantankerous and speaks her mind without fear, and isn't afraid to use violence if necessary. She has an eye for spotting liars and can tell when someone is trying to deceive her.
Speaking style: Greta speaks in a gruff, raspy voice and has a tendency to mumble and grumble under her breath. She often speaks in riddles and half-utterances, her words sounding more like warnings than advice. She has a habit of yelling and cackling when she gets angry, often scaring off anyone who might act as a voice of reason.
Background: Greta was born into a family of nomads and spent much of her life wandering the countryside. As she got older, her family started to drift apart, and Greta eventually found herself alone and homeless. She now wanders the land, taking odd jobs when she can and living off the land when she can't. Despite her bitter exterior, Greta has a deep knowledge and understanding of the land and it's secrets, making her a valuable ally when facing dark and dangerous foes.

User: `,
    imagePromptPrefix: 'd&d character portrait of npcforge style, headshot,',
    negativePrompt: 'poorly drawn face, blurry, bad anatomy, bad proportions, cloned face, glitchy, missing lips, distorted face, badly cropped, truncated, anime, framed',
    imageModel: 'nMmyGaN2OdIpSe3ibzlfKEWtq',
};