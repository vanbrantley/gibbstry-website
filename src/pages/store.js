import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Store() {
    const products = [
        {
            name: "Black G Tee",
            img: "/white-on-black.png",
            link: "/",
            // link: "https://shop.domainname.com/products/tee-one",
        },
        {
            name: "White G Tee",
            img: "/black-on-white3.png",
            link: "/",
            // link: "https://shop.domainname.com/products/tee-two",
        },
        {
            name: "G Vertebrae",
            img: "/vertebrae.png",
            link: "/",
            // link: "https://shop.domainname.com/products/tee-three",
        },
    ];

    return (
        <>
            <Head>
                {/* <title>Gibbstry — Store</title> */}
                <meta name="description" content="Name clothing previews" />
            </Head>

            <div className="h-screen w-screen overflow-hidden bg-white">

                {/* Top Navbar */}
                <nav className="fixed top-0 left-0 z-10 flex h-16 w-full items-center px-6">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo-512x512.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                            priority
                        />
                    </Link>
                </nav>


                {/* Scrollable Product Area */}
                <main className="absolute top-16 bottom-16 left-0 right-0 overflow-y-scroll px-6">
                    <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 pt-0 pb-12">
                        {products.map((product) => (
                            <a
                                key={product.name}
                                href={product.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex justify-center"
                            >
                                <div className="relative w-full max-w-[420px] aspect-[3/4] p-2 transition-transform hover:scale-[1.02]">
                                    <Image
                                        src={product.img}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                </main>

                {/* Bottom Footer */}
                <footer className="fixed bottom-0 left-0 z-10 flex h-16 w-full items-center px-6">
                    <a
                        href="https://instagram.com/gibbstry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                    >
                        <Image
                            src="/pixel-instagram.png"
                            alt="Instagram"
                            width={28}
                            height={28}
                        />
                        {/* <Image
                            src="/pixel-instagram.png"
                            alt="Instagram"
                            width={24}
                            height={24}
                            className="opacity-80 hover:opacity-100 transition-opacity"
                        /> */}
                    </a>
                </footer>
            </div>
        </>
    );
}
