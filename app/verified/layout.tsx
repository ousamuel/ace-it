import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-3xl">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href="/" className="flex flex-row gap-1">
                      <h1>ACE</h1>
                      <h1 className="text-green-500">IT</h1>
                    </Link>
                  </div>
                  {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                </div>
              </nav> */

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
  // const approvedEmails = ;
  // if (
  //   ![
  //     "gtuyishime02@gmail.com",
  //     "coinchip167@gmail.com",
  //     "angela.wu808@gmail.com",
  //   ].includes(user.email || "")
  // ) {
  //   return redirect("/waitlist");
  // }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
