import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { addSuggestionAction } from "../../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import Link from "next/link";
export default async function Home({
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

  return (
    <ContentLayout title="Home">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-6 px-2">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ace<span className="text-green-500">IT</span>: Your Ultimate Study
          Companion
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          AceIT is designed to elevate your learning experience with a suite of
          features tailored to help you succeed.
        </p>

        <h2 className="text-green-500 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          AI-Powered Flashcards
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Enhance your learning with flashcards that adapt to your study needs.
          AceIT's AI identifies key concepts for reinforcement, ensuring you
          focus on what matters most.
        </p>

        <h2 className="text-green-500 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Practice Exams & Calendar
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Stay prepared with practice exams that simulate real test conditions.
          Keep track of all your assignments and exam dates with the built-in
          calendar, making sure you're always on top of your schedule.
        </p>

        <h2 className="text-green-500 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Chatbot Interactions & Quizzing
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Make learning interactive and fun with AceIT's chatbot. Engage in
          quick quizzes or ask for clarifications on tough topics – all through
          a seamless conversational interface.
        </p>

        <div className="flex py-5">
          <Dialog>
            <DialogTrigger>
              <button className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer">
                Leave a Suggestion!
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                  <form className="flex flex-col w-full p-4 gap-2 [&>input]:mb-4">
                  <DialogTitle>Leave a Suggestion!</DialogTitle>
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
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ContentLayout>
  );
}
