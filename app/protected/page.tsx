import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export default async function ProtectedRedirect() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/verified");
  } else {
    return redirect("/");
  }
}
