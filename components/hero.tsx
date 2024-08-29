import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center py-[10vh] md:py-[20vh]">
      <div className="!leading-tight mx-auto text-center">
        <div className="flex flex-col gap-2 p">
          <h1 className="text-4xl lg:text-5xl">
            The fastest way to ACE your classes{" "}
          </h1>
          <h1 className="text-2xl lg:text-3xltext-green-500">
            Take the stress away from your studying
          </h1>
        </div>
      </div>
      <button
        className={`
        p-2 px-3 bg-green-500 text-2xl lg:text-2xl text-white
        border border-zinc-200 shadow-lg rounded-2xl hover:bg-green-500 
        hover:text-white hover:text-3xl 
        hover:shadow-xl hover:shadow-green-500/50 
        transition-all duration-300 ease-in-out transform`}
      >
        <Link href="/sign-up">Join the Waitlist</Link>
      </button>
      {/* <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" /> */}
    </div>
  );
}
