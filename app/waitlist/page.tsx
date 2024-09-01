import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { addSuggestionAction } from "../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  if (
    user.email == "gtuyishime02@gmail.com" ||
    user.email == "coinchip167@gmail.com"
  ) {
    return redirect("/verified");
  }

  return (
    <div className="my-20 flex-1 w-full flex flex-col gap-12 text-center items-center px-3">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Thanks for joining our waitlist!
      </h1>
      <h3 className="sm:w-3/5 scroll-m-20 text-2xl font-semibold tracking-tight">
        Our app will soon be out of development and ready to save your grades!
      </h3>
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4">
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label className="text-md text-muted-foreground" htmlFor="suggestion">
            If you have any suggestions or features you would like to see,
            please let us know here!
          </Label>
          <Input
            type="text"
            name="suggestion"
            placeholder="E.G. 'I would like to see an interactive calendar' "
            // minLength={6}
            required
          />
          <SubmitButton
            formAction={addSuggestionAction}
            pendingText="Submitting..."
          >
            Submit
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </div>
  );
}
