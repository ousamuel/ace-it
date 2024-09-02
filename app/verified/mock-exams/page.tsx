// generate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";
import { addExam } from "@/app/actions"; // Change this to the new addExam function
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function MockExam({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const router = useRouter();
  const [examName, setExamName] = useState("");
  const [notes, setNotes] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [mockQuestions, setMockQuestions] = useState<any[]>([]);
  const [resetQuestions, setResetQuestions] = useState<boolean>(false);
  const handleSubmit = async () => {
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
      console.error(response.error);
    } else {
      setResetQuestions((prev: boolean) => !prev);
      //   router.push("/verified/exams/generate"); // Redirect to the appropriate route for exams
    }
  };

  useEffect(() => {
    const fetchMockExam = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/sign-in");
      }

      const { data, error } = await supabase
        .from("mock_exams")
        .select("*")
        .eq("user_uid", user.id);

      if (data) {
        setMockQuestions(data);
      } else if (error) {
        console.error("Error fetching mock exam questions:", error);
      }
    };
    fetchMockExam();
  }, [supabase, resetQuestions]);

  return (
    <ContentLayout title="Exam Generator">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mock Exams</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="flex flex-col gap-5 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Mock Exams
        </h1>
        <h3 className="text-2xl font-semibold tracking-tight">
          Create custom practice exams to test your knowledge!
        </h3>

        <form
          className="flex flex-col w-full max-w-md p-4 gap-2 mx-auto border border-green-500/50 rounded-lg"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2 mt-8">
            <Label htmlFor="examName">Exam Name</Label>
            <Input
              type="text"
              id="examName"
              name="examName"
              placeholder="E.G. Final Exam"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              required
            />
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 border rounded"
              placeholder="Enter topics or notes you would like to study, and specify the number of questions."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              required
            />
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              type="text"
              id="questionCount"
              name="questionCount"
              placeholder="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
            >
              Generate Exam
            </button>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </section>
      {mockQuestions.map((question: any, i: number) => (
        <section key={i}>
          <h2>{question.question}</h2>
          <RadioGroup defaultValue="comfortable">
            {question.options.map((option: string, i: number) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </section>
      ))}
    </ContentLayout>
  );
}
