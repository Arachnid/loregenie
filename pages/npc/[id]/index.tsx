import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';
import NPCComponent, { NPC } from '../../../components/NPCComponent';
import db from '../../../utils/db';

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
        <title>Lore Genie</title>
      </Head>
      <h1>Lore Genie</h1>
      <main className={styles.main}>
        <NPCComponent npc={npc} id={id} />
      </main>
    </>
  );
};
