import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import navConfig from "./config";
import styles from "./index.module.scss";

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navConfig.map((nav) => (
          <Link key={nav.value} href={nav.value}>
            <a className={nav.value === pathname ? styles.active : ""}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Navbar;
