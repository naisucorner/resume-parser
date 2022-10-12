import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

const App = ({ Component, pageProps }) => (
  <div>
    <Component {...pageProps} />

    <ToastContainer />
  </div>
);

export default App;
