import styles from '../styles/Header.module.css';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';

function HeaderComponent() {
  return <>
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-D8EPPREN3N" strategy='afterInteractive'/>
    <Script id="google-analytics" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-D8EPPREN3N');
      `}
    </Script>
    <header className={styles.header}>
        <h1>
            <Link href="/">
                Lore Genie
            </Link>
        </h1>
    </header>
  </>;
};

export default HeaderComponent;