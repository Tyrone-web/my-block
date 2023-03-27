import Navbar from "../Navbar";
import Footer from "../Footer";

const Layout = ({ children }: any) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
