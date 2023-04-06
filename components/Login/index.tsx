import { useState, useCallback } from "react";
import styles from "./index.module.scss";
import { Form, Input, Button, Modal, message } from "antd";
import CountDown from "../CountDown";
import request from "service/fetch";

interface IProps {
  isShow: boolean;
  onClose: () => void;
}

export interface ILogin {
    phone: string;
    verifyCode: string;
}

const { useForm } = Form;

const Login = (props: IProps) => {
  const { isShow, onClose } = props;
  const [isShowVerifyCount, setIsShowVerifyCount] = useState(false);
  const [form] = useForm();
  const { getFieldValue } = form;

  const handleGetVerifyCode = () => {
    const phone = getFieldValue("phone");

    if (!phone) {
      message.warning("请输入手机号");
      return;
    }

    // next.js会拦截该请求（api开头）
    request
      .post("/api/user/sendVerifyCode", {
        to: phone,
        templateId: 1,
      })
      .then((res) => {
        console.log(res, "res");
        const { code, msg } = res as any; // any待优化
        if (code === 0) {
          setIsShowVerifyCount(true);

          return;
        }
        message.error(msg || "未知错误");
      });
  };

  const handleOAuthGithub = () => {};

  const onFinish = (values: Record<string, any>) => {
    request.post('/api/user/login', {
        ...values
    }).then((res: Record<string, any>) => {
        if (res.code === 0) {
            onClose();

            return;
        }

        message.error(res.msg || '未知错误');
    });
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
      <Form name="login" onFinish={onFinish} form={form}>
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
            // onClick={handleLogin}
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
