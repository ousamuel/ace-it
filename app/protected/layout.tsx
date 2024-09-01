import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  if (
    user.email != "gtuyishime02@gmail.com" &&
    user.email != "coinchip167@gmail.com"
  ) {
    return redirect("/waitlist");
  }

  return <div className="flex justify-center w-full">{children}</div>;
}
