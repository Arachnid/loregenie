import styles from '../styles/Home.module.css';

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

function NPCComponent({ npc } : { npc: NPC }) {
  return (
    <div className={styles.response}>
      <img src={`${npc.Image}`} className={styles.avatar} alt={npc['Physical description']} width="256" height="256" />
      <div className={styles.container}>
        <h1 className={styles.name}>{npc.Name}</h1>
        <p>{npc.Gender} {npc.Race} {npc.Alignment}</p>
        <p>{npc.Age} year old {npc.Profession}</p>
        <p>{npc.Personality}</p>
        <hr className={styles.divider} />
        <p>{npc.Background}</p>
        <p>{npc['Physical description']}</p>
        <p>{npc['Speaking style']}</p>
      </div>
    </div>
  );
};

export default NPCComponent;
