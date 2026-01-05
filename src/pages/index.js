import Head from "next/head";
import { useRouter } from "next/router";
import Landing from "@/components/Landing";

export default function Home() {

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Gibbstry</title>
        <meta name="description" content="Gibbstry landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing onClick={() => router.push("/store")} />
    </>
  );
}
