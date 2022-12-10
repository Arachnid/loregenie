import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';
import NPCComponent from '../../../components/NPCComponent';
import { NPC } from "../../../utils/NPC";
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

  if(!npcData.image) {
    // Not finished rendering, use our endpoint that will wait.
    npcData.image = `/api/npc/${id}/image.png`;
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
        <title>{npc.name} - Lore Genie</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@lore_genie" />
        <meta property="og:url" content={`${config.baseUrl}/npc/${id}`} />
        <meta property="og:title" content={npc.name} />
        <meta property="og:description" content={npc.summary || npc.personality} />
        <meta property="og:image" content={npc.image} />
      </Head>

      <main className={styles.main}>
        <NPCComponent npc={npc} id={id} />
      </main>
    </>
  );
};
