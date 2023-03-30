import { useState, useCallback } from "react";
import { Button } from "antd";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import navConfig from "./config";
import styles from "./index.module.scss";
import Login from "../Login";

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleGotoEditorPage = () => {};
  const handleLogin = () => setIsShowLogin(true);
  const handleClose = useCallback(() => setIsShowLogin(false), []);

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navConfig.map((nav) => (
          <Link key={nav.value} href={nav.value} legacyBehavior>
            <a className={nav.value === pathname ? styles.active : ""}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
        <Login isShow={isShowLogin} onClose={handleClose} />
      </section>
    </div>
  );
};

export default Navbar;
