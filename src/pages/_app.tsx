import "@/styles/globals.css";
import Layout from "@/PublicComponents/Layout";
import { StoreProvider } from "store/index";
import { NextPage } from "next";
import { render } from "react-dom";

interface IProps {
  initialValue: Record<string, any>;
  Component: NextPage;
  pageProps: any;
}

function App({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    }

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  };
  return (
    <StoreProvider initialValue={initialValue}>{renderLayout()}</StoreProvider>
  );
}

App.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req.cookies || {};

  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};

export default App;
