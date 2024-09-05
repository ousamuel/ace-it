import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";

export default async function Waitlist({
  searchParams,
}: {
  searchParams: Message;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  else {
    return redirect("/verified");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 text-center items-center px-3">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 ">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-3xl">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex flex-row gap-1">
              <h1>ACE</h1>
              <h1 className="text-green-500">IT</h1>
            </Link>
          </div>
          <HeaderAuth />
        </div>
      </nav>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-4">
        Thanks for joining our priotity list!
      </h1>
      <h3 className="sm:w-3/5 scroll-m-20 text-2xl font-semibold tracking-tight">
        Our app will soon be out of development and ready to save your grades!
      </h3>
      <button
        className={`
        p-2 px-3 bg-green-500 text-2xl lg:text-2xl text-white
        border border-zinc-200 shadow-lg rounded-2xl hover:bg-green-500 
        hover:text-white hover:text-3xl 
        hover:shadow-xl hover:shadow-green-500/50 
        transition-all duration-300 ease-in-out transform`}
      >
        <Link href="/verified/flashcards/generate">Try it Now</Link>
      </button>
    </div>
  );
}
