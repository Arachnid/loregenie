import styles from '../styles/NPC.module.css';
import { FaLink, FaTwitter } from 'react-icons/fa';
import Image from 'next/image'
import config from '../config';
import { NPC } from '../utils/NPC';

function NPCComponent({ npc, id } : { npc: NPC, id: string }) {
  const absoluteUrl = `${config.baseUrl}/npc/${id}`;
  return <>
    <div className={styles.npc}>
      <div className={styles.container}>
        <Image
          src={`${npc.image}`}
          className={styles.avatar}
          alt={npc.appearance}
          width="256"
          height="256"
        />

        <h1 className={styles.name}>{npc.name}</h1>

        <p className={styles.info}>{npc.gender !== "N/A" && npc.gender !== "None" ? npc.gender + " " : ""}{npc.race}, {npc.alignment}<br />
        {npc.age}{/\d/.test(npc.age) ?  " year old " : " "}{npc.profession}</p>

        <p>{npc.personality}</p>

        <hr />

        {npc.ideals && <i>{npc.ideals}<br /></i>}
        {npc.bonds && <i>{npc.bonds}<br /></i>}
        {npc.flaws && <i>{npc.flaws}<br /></i>}

        <h2>Background</h2>
        <p>{npc.background}</p>
        <h2>Appearance</h2>
        <p>{npc.appearance}</p>
        <h2>Speaking Style</h2>
        <p>{npc.diction}</p>
        
        <hr />

        <div className={styles.icons}>
          <a href={absoluteUrl}><FaLink /></a>
          <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`Check out this NPC created with @lore_genie!`) + '&url=' + encodeURIComponent(absoluteUrl)}><FaTwitter /></a>
        </div>
      </div>
    </div>
  </>;
};

export default NPCComponent;
