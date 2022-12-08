import styles from '../styles/Home.module.css';
import { FaLink, FaTwitter } from 'react-icons/fa';
import config from '../config';

export interface NPC {
  Name: string;
  Gender: string;
  Race: string;
  Alignment: string;
  Age: string;
  Profession: string;
  Personality: string;
  Background: string;
  "Physical description": string;
  "Speaking style": string;
  Image: string;
}

function NPCComponent({ npc, id } : { npc: NPC, id: string }) {
  const absoluteUrl = `${config.baseUrl}/npc/${id}`;
  return <>
    <div className={styles.response}>
      <img src={`${npc.Image}`} className={styles.avatar} alt={npc['Physical description']} width="256" height="256" />
      <div className={styles.container}>
        <h1 className={styles.name}>{npc.Name}</h1>
        <p>{npc.Gender} {npc.Race}, {npc.Alignment}</p>
        <p>{npc.Age} year old {npc.Profession}</p>
        <p>{npc.Personality}</p>
        <hr className={styles.divider} />
        <p>{npc.Background}</p>
        <p>{npc['Physical description']}</p>
        <p>{npc['Speaking style']}</p>
      </div>
    </div>
    <div>
      <a href={absoluteUrl}><FaLink /></a>
      <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`Check out this NPC created with @loregenie!`) + '&url=' + encodeURIComponent(absoluteUrl)}><FaTwitter /></a>
    </div>
  </>;
};

export default NPCComponent;
