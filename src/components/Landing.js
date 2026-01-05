import { Jacquard_12 } from "next/font/google";

const jacquard = Jacquard_12({
    variable: "--font-jacquard",
    subsets: ["latin"],
    weight: "400",
});

export default function Landing({ onClick }) {
    return (
        <main className="flex h-screen w-screen items-center justify-center">
            <p
                onClick={onClick}
                className={`${jacquard.className} text-[64px] sm:text-[96px] cursor-auto`}
            >
                Gibbstry
            </p>
        </main>
    );
}