import styles from '../styles/Header.module.css';
import Link from 'next/link';

function HeaderComponent() {
  return <>
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