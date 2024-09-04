import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function Settings() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  } else {
    return redirect("/verified/settings/account-details");
  }
}
