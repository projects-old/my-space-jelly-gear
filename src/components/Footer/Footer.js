import styles from "./Footer.module.scss";

const Footer = ({ ...rest }) => {
  return (
    <footer className={styles.footer} {...rest}>
      <p>
        &copy; {new Date().getFullYear()} by Colby Fayock, author of{" "}
        <a href="https://spacejelly.dev">Space Jelly</a>. &nbsp; Modified by Ben
        Yee. &nbsp; Images via <a href="https://unsplash.com/">unsplash.com</a>
      </p>
    </footer>
  );
};

export default Footer;
