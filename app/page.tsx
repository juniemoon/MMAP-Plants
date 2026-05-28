import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black">
        I got started and edited the page.tsx file 🎉
      </h1>
      <p className="text-lg leading-8 text-zinc-500">
        More instructions: Lookup{" "}
        <a href="https://vercel.com/templates" className="font-medium text-zinc-700">Templates</a>
        {" "}or the{" "}
        <a href="https://nextjs.org/learn" className="font-medium text-zinc-700">Learning</a> center.
      </p>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <a className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-zinc-700 shadow-xs transition-colors hover:bg-[#DDDDDD] md:w-[158px]"
          href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">
          <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={16} height={16} />
          Deploy Now
        </a>
        <a className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-zinc-700 shadow-xs transition-colors hover:bg-[#DDDDDD] md:w-[158px]"
          href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
          Documentation
        </a>
      </div>
    </div>
  );
}