import { useState, useCallback } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button, Modal } from "antd";
import CountDown from "../CountDown";

interface IProps {
  isShow: boolean;
  onClose: () => void;
}
const Login = (props: IProps) => {
  const { isShow, onClose } = props;
  const [isShowVerifyCount, setIsShowVerifyCount] = useState(false);

  const handleGetVerifyCode = () => setIsShowVerifyCount(true);

  const handleLogin = () => {};

  const handleOAuthGithub = () => {};

  const onFinish = (value) => {
    console.log("value", value);
  };

  const handleOnEnd = useCallback(() => setIsShowVerifyCount(false), []);

  return (
    <Modal
      className={styles.loginArea}
      title={<span className={styles.title}>验证码登录</span>}
      onCancel={onClose}
      open={isShow}
      footer={null}
      width={350}
      maskClosable={false}
    >
      <Form name="login" onFinish={onFinish}>
        <Form.Item name="phone">
          <Input addonBefore="+86" />
        </Form.Item>
        <Form.Item name="verify">
          <Input
            addonAfter={
              <div
                className={styles.verifyCodeBtn}
                onClick={handleGetVerifyCode}
              >
                {isShowVerifyCount ? (
                  <CountDown time={10} onEnd={handleOnEnd} />
                ) : (
                  <span>获取验证码</span>
                )}
              </div>
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            className={styles.fullWidth}
            onClick={handleLogin}
            type="primary"
            htmlType="submit"
          >
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Button className={styles.fullWidth} onClick={handleOAuthGithub}>
            使用 Github 登录
          </Button>
        </Form.Item>
        <div className={styles.privacy}>
          <span>注册登录即表示同意 </span>
          <a href="https://moco.imooc.com/privacy.html" target="_blank">
            隐私政策
          </a>
        </div>
      </Form>
    </Modal>
  );
};

export default Login;
