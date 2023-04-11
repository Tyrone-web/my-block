import { useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Button, Dropdown, MenuProps, message } from "antd";
// import { LoginOutlined, HomeOutlined } from "@ant-design/icons";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import request from "service/fetch";
import navConfig from "./config";
import styles from "./index.module.scss";
import { useStore } from "store/index";
import Login from "../Login";

const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar, nickname } = store.user.userInfo;

  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleGotoEditorPage = () => {
    if (userId) {
      push("/editor/new");
    } else {
      message.warning("请先登录");
    }
  };
  const handleGoToPersonalPage = () => {
    push(`/user/${userId}`);
  };
  const handleLogin = () => setIsShowLogin(true);
  const handleClose = useCallback(() => setIsShowLogin(false), []);

  const handleLogout = () => {
    request.post("/api/user/logout").then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={handleGoToPersonalPage}>个人主页</span>,
    },
    {
      key: "2",
      label: <span onClick={handleLogout}>退出系统</span>,
    },
  ];

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
        {userId ? (
          <Dropdown menu={{ items }} placement="bottomLeft">
            <span>
              <Avatar src={avatar} size={32} /> {nickname}
            </span>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
        <Login isShow={isShowLogin} onClose={handleClose} />
      </section>
    </div>
  );
};

export default observer(Navbar);
