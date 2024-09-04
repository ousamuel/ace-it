import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function VerifiedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
   redirect('/verified/home')
  );
}
