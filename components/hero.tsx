import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col gap-8 items-center py-[150px] pb-[150px]">
      <p className="text-5xl lg:text-6xl !leading-tight mx-auto text-center">
        <div className="flex flex-col gap-2 p">
          <h1>The fastest way to ACE your classes{" "}</h1>
          <h1 className="text-green-500">Take the stress away from your studying</h1>
        </div>
      </p>
      <button className={`
        p-2 bg-green-500 text-2xl lg:text-2xl text-white
        border border-zinc-200 shadow-lg rounded-2xl hover:bg-green-500 
        hover:text-white hover:text-4xl 
        hover:shadow-xl hover:shadow-green-500/50 
        transition-all duration-300 ease-in-out transform`}><Link href="/sign-up">
          Join the Waitlist</Link></button>
      {/* <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" /> */}
    </div>
  );
}
