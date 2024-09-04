import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center py-[10vh] md:py-[20vh] font-bold">
      <div className="!leading-tight mx-auto text-center">
        <div className="flex flex-col gap-2 p">
          <h1 className="text-3xl lg:text-4xl">
            Keep your studies on track and <span>Ace</span>
            <span className="brand-green">IT</span>
          </h1>
          <h1 className="text-2xl lg:text-3xltext-green-500">
            Take the stress away from your studying
          </h1>
        </div>
      </div>
      <button
        className={`
        p-2 px-3 bg-green-500 text-base lg:text-lg text-white
        border border-zinc-200 shadow-lg rounded-lg hover:bg-green-500 
        hover:text-white hover:text-2xl 
        hover:shadow-xl hover:shadow-green-500/50 
        transition-all duration-300 ease-in-out transform`}
      >
        <Link href="/sign-up">Try it Now</Link>
      </button>
      {/* <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" /> */}
    </div>
  );
}
