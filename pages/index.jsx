import Upload from "../components/upload";
import Head from "next/head";

const Home = () => {
  return (
    <div className="w-full">
      <Head>
        <title>Resume Parser</title>
      </Head>

      <Upload />
    </div>
  );
};

export default Home;
