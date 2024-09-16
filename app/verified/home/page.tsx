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
import { addFlashcards } from "@/app/actions";
import { addExam } from "@/app/actions";


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

  const [setName, setSetName] = useState("");
  const [notes, setNotes] = useState("");
  const [number, setNumber] = useState("");
  const handleSubmitFlash = async (e: React.FormEvent) => {
      e.preventDefault();
  
      // let text = '';
      // if (file && file.type == 'application/pdf') {
      //   text = await extractTextFromPDF(file);
      // }
      
      const formData = new FormData();
      formData.append("notes", notes);
      formData.append("setName", setName);
      formData.append("setNumber", number);
      // if (text) {
      //   formData.append("text", text);
      // }
  
      const response = await addFlashcards(formData);
      if (response?.error) {
        console.error(response.error);
      } else {
        toast("Generating set...");
      }
  
  };

  const supabase = createClient();
  const [examName, setExamName] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [isGenerateDisabled, setIsGenerateDisabled] = useState<boolean>(false);

  const handleSubmitExam = async (e: any) => {
    e.preventDefault();
    if (parseInt(questionCount) > 10) {
      toast("You can request a max of 10 questions per exam.");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return redirect("/sign-in");
    }
    const { data } = await supabase
      .from("mock_exams")
      .select("exam_name")
      .eq("user_uid", user.id);
    if (data && data.length >= 3) {
      toast("You can only save up to 3 exams at a time", {
        description: "Delete an existing exam to generate a new one",
      });
      return;
    } else {
      setIsGenerateDisabled(true);
      toast("Submitting request...");
      const formData = new FormData();
      formData.append(
        "notes",
        notes +
          "Please include 4 options for each question, with one option being the correct answer"
      );
      formData.append("examName", examName);
      formData.append("questionCount", questionCount);

      const response = await addExam(formData); // Use addExam function here
      if (response?.error) {
        toast("Failed to generated exam:", { description: response.error });
      } else {
        toast("Generating exam questions soon!", {
          description: `Please check your "Saved Exams". You may have to wait/refresh the page.`,
        });
        setIsGenerateDisabled(false);
      }
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
        <form
              className="flex flex-col flex-1 gap-2"
              onSubmit={handleSubmitFlash}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="setName" className="text-lg">Exam or Set Name</Label>
                <Input
                  type="text"
                  id="setName"
                  name="setName"
                  placeholder="e.g. AP Lang"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  required
                />
                <Label htmlFor="notes" className="text-lg">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  className="w-full p-2 border rounded"
                  placeholder="Enter any topics or notes you would like to study."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  required
                />
                {/* <Label htmlFor="file" className="text-lg">Upload PDF</Label>
                  <Input
                    type="file"
                    id="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  /> */}
                <Label htmlFor="setName" className="text-lg">Number of Flashcards or Questions</Label>
                <Input
                  type="text"
                  id="setNumber"
                  name="setNumber"
                  placeholder="e.g. Choose from 1-30"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
                
                <div className="flex flex-row gap-2">
                <button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
                  >
                    Generate Flashcards
                  </button>
                  <button
                    // type="submit"
                    className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
                  >
                    Generate Exam (still in works)
                  </button>
                </div>
                  
                <p className="text-sm text-muted-foreground">
                    Please note that while our AI strives for accuracy, it may
                    occasionally produce incorrect information, so always verify
                    critical details.
                  </p>
              </div>
            </form>

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
