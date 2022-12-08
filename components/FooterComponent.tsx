import styles from '../styles/Footer.module.css';

function FooterComponent() {
  return <>
    <footer className={styles.footer}>
        <p>
            <a href='https://twitter.com/lore_genie' target='_blank' rel="noreferrer">@lore_genie</a><br />
            All AI-generated content is Copyright Lore Genie and licensed <a href="https://creativecommons.org/licenses/by/2.0/">CC-BY</a>.
            Note that we may use content you generate with Lore Genie to train and improve future versions of the system.
        </p>
    </footer>
  </>;
};

export default FooterComponent;