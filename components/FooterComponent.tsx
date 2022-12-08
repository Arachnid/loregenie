import styles from '../styles/Footer.module.css';

function FooterComponent() {
  return <>
    <footer className={styles.footer}>
        <p>
            <a href='https://twitter.com/lore_genie' target='_blank' rel="noreferrer">@lore_genie</a><br />
            Footer here
        </p>
    </footer>
  </>;
};

export default FooterComponent;