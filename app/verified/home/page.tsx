"use client";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { submitUserTicketAction } from "../../actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const handleSubmit = async (formData: FormData) => {
    const result = await submitUserTicketAction(formData);
    if (result.error) {
      toast.error("Error submitting ticket. Please try again.");
    } else if (result.success) {
      setIsSheetOpen(false);
      toast.success("Ticket submitted successfully!");
    }
  };
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
          AI-Powered Flashcards and Mock Exams
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Enhance your learning with flashcards that adapt to your study needs.
          AceIT's AI identifies key concepts for reinforcement, ensuring you
          focus on what matters most.
        </p>

        <h2 className="text-green-500 mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Functional Calendar
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Stay prepared with practice exams that simulate real test conditions.
          Keep track of all your assignments and exam dates with the built-in
          calendar, making sure you're always on top of your schedule.
        </p>

        <div className="flex py-5">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger>
              {" "}
              <p className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer">
                Contact Us
              </p>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Contact Form</SheetTitle>
                <SheetDescription>
                  If you encounter any issues or want to reach out to the team,
                  please don’t hesitate to contact us by submitting a ticket
                  here. Your input is crucial to improving our app and providing
                  the best experience possible!
                </SheetDescription>
              </SheetHeader>
              <form
                className="flex flex-col w-full py-4 gap-2 [&>input]:mb-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  handleSubmit(formData);
                }}
              >
                <div className="flex flex-col gap-2 [&>label]:mt-3  text-foreground text-sm">
                  <Label htmlFor="type">
                    Select one <span className="text-red-500">*</span>
                  </Label>
                  <select name="type" required className="border rounded p-2">
                    <option value="account">Account</option>
                    <option value="feedback/suggestions">
                      Feedback & Suggestions
                    </option>
                    <option value="billing/subscription">
                      Billing/Subscription
                    </option>
                    {/* <option value="personal">Personal</option> */}
                    <option value="other">Other</option>
                  </select>
                  <Label htmlFor="subject">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="subject"
                    className="bg-"
                    placeholder="Maximum of 50 characters"
                    maxLength={50}
                    required
                  />{" "}
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    className="w-full p-2 border rounded"
                    placeholder="Maximum of 300 characters"
                    rows={4}
                    maxLength={300}
                    required
                  />
                  <SubmitButton className="my-4" pendingText="Submitting...">
                    Submit
                  </SubmitButton>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </ContentLayout>
  );
}
