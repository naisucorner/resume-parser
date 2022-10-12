import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const App = ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />

    <ToastContainer />
  </>
);

export default App;
