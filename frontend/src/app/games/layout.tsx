import Link from "next/link"
import Image from "next/image"
import Logo from '@/assets/img/logo.png'


export default function GameLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className={`h-screen game-bg`} >
      <div className="md:px-custom p-custom-sm text-gray-500">
        <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-2xl font-bold md:text-3xl"
            aria-label="logo"
          >
            <Image
              className=""
              data-aos="zoom-in"
              src={Logo}
              alt="greedy image"
              width={70}
              height={50}
              loading="lazy"
            />
            GreedyPig
          </Link>
        {children}
      </div>
    </section>
)}