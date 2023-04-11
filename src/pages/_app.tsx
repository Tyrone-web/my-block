import "@/styles/globals.css";
import Layout from "@/PublicComponents/Layout";
import { StoreProvider } from "store/index";
import { NextPage } from "next";

interface IProps {
  initialValue: Record<string, any>;
  Component: NextPage;
  pageProps: any;
}

function App({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
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
