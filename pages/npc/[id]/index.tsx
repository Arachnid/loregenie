import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';
import NPCComponent, { NPC } from '../../../components/NPCComponent';
import db from '../../../utils/db';
import config from '../../../config';

export const getServerSideProps: GetServerSideProps<{ id: string, npc: NPC }> = async (context) => {
  const id = context.query.id as string;
  const npcDoc = await db.doc(`npcs/${id}`).get();
  const npcData = npcDoc.data() as NPC;
  if(!npcData) {
    return {
      notFound: true,
    }
  };

  if(!npcData.Image) {
    // Not finished rendering, use our endpoint that will wait.
    npcData.Image = `/api/npc/${id}/image.png`;
  }

  return {
    props: {
      id: id,
      npc: npcData,
    }
  };
}

export default function NPCPage({ id, npc }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{npc.Name} - Lore Genie</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@lore_genie" />
        <meta property="og:url" content={`${config.baseUrl}/npc/${id}`} />
        <meta property="og:title" content={npc.Name} />
        <meta property="og:description" content={npc.Summary || npc.Personality} />
        <meta property="og:image" content={npc.Image} />
      </Head>
      <h1>Lore Genie</h1>
      <main className={styles.main}>
        <NPCComponent npc={npc} id={id} />
      </main>
    </>
  );
};
