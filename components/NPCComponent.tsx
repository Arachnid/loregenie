import styles from '../styles/NPC.module.css';
import { FaLink, FaTwitter } from 'react-icons/fa';
import config from '../config';

export interface NPC {
  Name: string;
  Gender: string;
  Race: string;
  Alignment: string;
  Age: string;
  Profession: string;
  Summary: string;
  Personality: string;
  Background: string;
  "Physical description": string;
  "Speaking style": string;
  Image: string;
}

function NPCComponent({ npc, id } : { npc: NPC, id: string }) {
  const absoluteUrl = `${config.baseUrl}/npc/${id}`;
  return <>
    <div className={styles.npc}>
      <div className={styles.container}>
        <img src={`${npc.Image}`} className={styles.avatar} alt={npc['Physical description']} width="256" height="256" />
        <h1 className={styles.name}>{npc.Name}</h1>
        <p className={styles.italic}>{npc.Gender !== "N/A" && npc.Gender !== "None" ? npc.Gender + " " : ""}{npc.Race}, {npc.Alignment}<br />
        {npc.Age}{/\d/.test(npc.Age) ?  " year old " : " "}{npc.Profession}</p>
        <p>{npc.Personality}</p>
        <hr className={styles.divider} />
        <p>{npc.Background}</p>
        <p>{npc['Physical description']}</p>
        <p>{npc['Speaking style']}</p>
        <hr className={styles.divider} />
        <div className={styles.icons}>
          <a href={absoluteUrl}><FaLink /></a>
          <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`Check out this NPC created with @lore_genie!`) + '&url=' + encodeURIComponent(absoluteUrl)}><FaTwitter /></a>
        </div>
      </div>
    </div>
  </>;
};

export default NPCComponent;
