import Head from "next/head";
import { Jacquard_12 } from "next/font/google";

const jacquard = Jacquard_12({
  variable: "--font-jacquard",
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <>
      <Head>
        <title>Gibbstry</title>
        <meta name="description" content="Gibbstry landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen items-center justify-center">
        <p className={`${jacquard.className} text-[64px] sm:text-[96px]`}>
          Gibbstry
        </p>
      </main>
    </>
  );
}
