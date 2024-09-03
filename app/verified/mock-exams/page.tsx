// mock-exams/page.tsx
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
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MockExam({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const router = useRouter();
  const [examName, setExamName] = useState("");
  const [notes, setNotes] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [mockQuestions, setMockQuestions] = useState<any[]>([]);
  const [groupedQuestions, setGroupedQuestions] = useState<any[]>([]);
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
        console.log(data);
        setGroupedQuestions(
          data.reduce((acc, question) => {
            const { exam_name } = question;
            if (!acc[exam_name]) {
              acc[exam_name] = [];
            }
            acc[exam_name].push(question);
            return acc;
          }, {})
        );

        setMockQuestions(data);
      } else if (error) {
        console.error("Error fetching mock exam questions:", error);
      }
    };
    fetchMockExam();
  }, [supabase, resetQuestions]);

  const deleteExam = async (exam_name: any) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { error } = await supabase
      .from("mock_exams")
      .delete()
      .eq("exam_name", exam_name)
      .eq("user_uid", user.id);
    if (error) {
      console.error("Error deleting event:", error);
    } else {
      toast("Exam deleted!", {
        // description: `"${event.title}: ${event.description}"`,
      });
      // setIsDialogOpen(false);
      // fetchUserAndEvents();
    }
  };
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
            <BreadcrumbPage>Contents</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mock Exams</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Tabs defaultValue="saved-exams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 my-8">
          <TabsTrigger value="saved-exams">Saved Exams</TabsTrigger>
          <TabsTrigger value="new-exam">Add New Exam</TabsTrigger>
        </TabsList>
        <TabsContent value="saved-exams">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
            My Saved Exams
          </h1>
          {/* <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card> */}
          <div className='flex flex-col gap-4 pt-4'>

          {Object.keys(groupedQuestions).map((topic: any, i: number) => (
            <Card key={i} className="w-full cursor-pointer" >
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {topic.toUpperCase()}
                  <Popover>
                    <PopoverTrigger>delete</PopoverTrigger>
                    <PopoverContent>
                      <Button onClick={() => deleteExam(topic)}>delete</Button>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                {/* <CardDescription>Exam description</CardDescription> */}
              </CardHeader>
              {/* <CardContent></CardContent> */}
            </Card>
          ))}
          </div>
        </TabsContent>
        <TabsContent value="new-exam">
          {/* <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card> */}
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
                <Label htmlFor="examName">Topic of the exam</Label>
                <Input
                  type="text"
                  id="examName"
                  name="examName"
                  placeholder="E.G. Organic Chemistry"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  required
                />
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  className="w-full p-2 border rounded"
                  placeholder="Enter topics or notes you would like to study, and specify the number of questions. Please be specific and extensive when describing what you're looking for."
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
                  maxLength={2}
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
        </TabsContent>
      </Tabs>

      {/* <button onClick={() => console.log(groupedQuestions)}>Saved Exams</button>

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
      ))} */}
    </ContentLayout>
  );
}
