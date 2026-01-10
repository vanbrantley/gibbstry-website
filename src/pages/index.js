import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Landing from "@/components/Landing";
import LoadingCube from "@/components/LoadingCube";
import TestCube from "@/components/TestCube";

export default function Home() {

  const [step, setStep] = useState("brand"); // "brand" | "cube"
  const router = useRouter();

  const handleLandingClick = () => {
    setStep("cube");
  };

  const handleCubeClick = () => {
    router.push("/shop");
  };

  return (
    <>
      <Head>
        <title>Gibbstry</title>
        <meta name="description" content="Gibbstry landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {step === "brand" && <Landing onClick={handleLandingClick} />}
      {step === "cube" && <LoadingCube onClick={handleCubeClick} />}

      {/* <TestCube /> */}

    </>
  );
}
