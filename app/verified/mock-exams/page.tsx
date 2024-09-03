// mock-exams/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
import { getInstructionList } from "@/lib/mock-instructions";
export default function MockExam() {
  const instructionList = getInstructionList();
  const supabase = createClient();
  const [examName, setExamName] = useState("");
  const [notes, setNotes] = useState("");
  const [questionCount, setQuestionCount] = useState("");

  const [exams, setExams] = useState<any[]>([]);
  const [examNameNonform, setExamNameNonform] = useState<string>("");
  const [examQuestions, setExamQuestions] = useState<any[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [numberCorrect, setNumberCorrect] = useState<number>(0);
  const [previousScore, setPreviousScore] = useState<string>("");
  const [isGenerateDisabled, setIsGenerateDisabled] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string;
  }>({});
  // Function to handle option selection
  const handleOptionChange = (questionIndex: number, option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };
  const handleSubmit = async (e: any) => {
    setIsGenerateDisabled(true);
    toast("Submitting request...");
    e.preventDefault();
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
      // console.error(response.error);
    } else {
      toast("Generating exam questions soon!", {
        description: `Please wait 1-2 minutes to see your new exam in your "Saved Exams" Tab. You may have to refresh the page.`,
      });
      setIsGenerateDisabled(false);
    }
  };
  // setTimeout(() => {
  //   setIsGenerateDisabled(false);
  // }, 3000);
  const getExamQuestions = async (examUID: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("mock_exam_questions")
      .select("*")
      .eq("user_uid", user?.id)
      .eq("exam_uid", examUID);
    if (data) {
      // console.log(data);
      setExamQuestions(data);
    } else if (error) {
      console.error(
        "Error fetching mock exam questions for specified set:",
        error
      );
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
        .eq("user_uid", user?.id);

      if (data) {
        // console.log(data);
        setExams(data);
      } else if (error) {
        console.error("Error fetching mock exam sets:", error);
      }
    };

    fetchMockExam();
  }, [supabase]);

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
  const handleCheckAnswers = async (examUID: string) => {
    const date = new Date();
    setShowAnswers(true);
    let correctCount = 0;

    const updateExamScoreAndDate = async (previousScore: string) => {
      // console.log(previousScore);
      const { error } = await supabase
        .from("mock_exams")
        .update({
          last_taken: date,
          previous_score: previousScore,
        })
        .eq("exam_uid", examUID);

      if (error) {
        console.log(error);
      }
    };
    try {
      examQuestions?.forEach((question, i) => {
        if (selectedOptions[i] == question.answer) {
          correctCount++;
        }
      });
      setNumberCorrect(correctCount);
      setPreviousScore(`${correctCount}/${examQuestions?.length}`);
    } catch (error) {
      console.error(error);
    } finally {
      await updateExamScoreAndDate(`${correctCount}/${examQuestions?.length}`);
    }
  };
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      <Tabs defaultValue="new-exam" className="w-full">
        <TabsList className="grid w-full grid-cols-2 my-8">
          <TabsTrigger value="new-exam">Add New Exam</TabsTrigger>
          <TabsTrigger value="saved-exams">Saved Exams</TabsTrigger>
        </TabsList>
        <TabsContent value="saved-exams">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-3xl">
            My Saved Exams
          </h1>
          <div className="flex flex-col gap-4 pt-4">
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  setSelectedOptions({});
                  setExamQuestions([]);
                  setShowAnswers(false);
                  setNumberCorrect(0);
                }
                setIsDialogOpen(open);
              }}
            >
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {capitalizeFirstLetter(examNameNonform)}
                  </DialogTitle>
                  <DialogDescription asChild className="text-foreground">
                    <ol
                      className="max-h-[65vh] md:max-h-[75vh] overflow-y-scroll 
                                  list-decimal flex flex-col gap-4 pl-5"
                    >
                      {examQuestions && examQuestions.length > 0 ? (
                        examQuestions.map((question: any, i: number) => (
                          <li key={i}>
                            <h2
                              className={`font-semibold pl-2 mb-2 text-left ${showAnswers ? "text-muted-foreground" : ""}`}
                            >
                              {question.question}
                            </h2>
                            <RadioGroup
                              value={selectedOptions[i]}
                              onValueChange={(value) =>
                                handleOptionChange(i, value)
                              }
                            >
                              {question.options.length == 4 ? (
                                question.options.map(
                                  (option: string, j: number) => (
                                    <div
                                      key={j}
                                      className="flex items-center space-x-2 pl-2 w-full"
                                    >
                                      <RadioGroupItem
                                        value={option}
                                        disabled={showAnswers}
                                        id={`question-${i}-option-${j}`}
                                      />
                                      <Label
                                        htmlFor={`question-${i}-option-${j}`}
                                        className={`${
                                          showAnswers &&
                                          selectedOptions[i] === option
                                            ? option == question.answer
                                              ? "text-green-500"
                                              : "text-red-500"
                                            : ""
                                        } py-1`}
                                      >
                                        {option}
                                      </Label>
                                    </div>
                                  )
                                )
                              ) : showAnswers ? (
                                <Popover>
                                  <PopoverTrigger className="text-left pl-2 w-fit">
                                    Click for example
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    {question.answer}
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p className="text-sm text-muted-foreground pl-2">
                                  A short answer example will be provided after
                                  submission
                                </p>
                              )}
                            </RadioGroup>
                          </li>
                        ))
                      ) : (
                        <div className="flex flex-col gap-4 p-4">
                          <Skeleton className="h-6 w-full rounded-lg" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                          </div>
                          <Skeleton className="h-6 w-full rounded-lg" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                          </div>
                        </div>
                      )}
                    </ol>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between">
                  {examQuestions && (
                    <Button
                      disabled={showAnswers}
                      onClick={() => {
                        // console.log(examQuestions)
                        handleCheckAnswers(examQuestions[0].exam_uid);
                      }}
                    >
                      Submit
                    </Button>
                  )}
                  {showAnswers
                    ? numberCorrect > 0
                      ? `${numberCorrect}/${examQuestions?.length} correct`
                      : `0/${examQuestions?.length} correct`
                    : null}
                  <Button
                    onClick={() => {
                      setIsDialogOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Accordion type="multiple" className="flex flex-col gap-4">
              {exams.length > 0 ? (
                exams.map((exam: any, i: number) => (
                  <Card key={i} className="w-full">
                    <AccordionItem
                      key={i}
                      value={exam.exam_name + i}
                      className=""
                    >
                      <AccordionTrigger className="p-4">
                        <CardHeader className="p-0 py-4 px-4">
                          <CardTitle className="flex justify-between lg:text-lg">
                            {capitalizeFirstLetter(exam.exam_name)}
                          </CardTitle>
                        </CardHeader>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 border-t">
                        <div className="px-4 flex justify-between">
                          <section className="flex flex-col flex-1 gap-1">
                            <Button
                              className="w-fit flex px-4 h-8"
                              onClick={() => {
                                setIsDialogOpen(true);
                                setExamNameNonform(exam.exam_name);
                                getExamQuestions(exam.exam_uid);
                              }}
                            >
                              Start Exam
                            </Button>
                          </section>
                          {exam.created_on && (
                            <section className="flex flex-col flex-1 gap-1">
                              <h4>
                                Created on:{" "}
                                {parseInt(exam.created_on.substring(5, 7)) >= 10
                                  ? exam.created_on.substring(5, 7)
                                  : exam.created_on.substring(6, 7)}
                                /
                                {parseInt(exam.created_on.substring(8, 10)) >=
                                10
                                  ? exam.created_on.substring(8, 10)
                                  : exam.created_on.substring(9, 10)}
                                /{exam.created_on?.substring(0, 4)}
                              </h4>

                              <h4>
                                Last taken on:{" "}
                                {exam.last_taken ? exam.last_taken : "N/A"}
                              </h4>
                              <h4 className={exam.previous_score ? "" : ""}>
                                {" "}
                                Previous score:{" "}
                                {exam.previous_score
                                  ? exam.previous_score
                                  : "N/A"}
                              </h4>
                            </section>
                          )}

                          <section></section>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                ))
              ) : (
                <p className="text-lg text-muted-foreground">
                  No exams saved yet.
                </p>
              )}
            </Accordion>
          </div>
        </TabsContent>
        <TabsContent value="new-exam">
          <section className="flex flex-col gap-2 md:gap-6 text-center">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
                Mock Exams
              </h1>
              <h3 className="sm:text-base font-semibold tracking-tight text-muted-foreground">
                Create custom practice exams to test your knowledge!
              </h3>
            </div>
            <Separator />

            <div className="flex flex-col-reverse md:flex-row gap-2 gap-x-6 px-4">
              <article className="flex flex-col flex-1">
                <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
                  How to Use the Mock Exam Generator
                </h2>
                <div className="px-2 list-decimal text-left">
                  {instructionList.map((group, groupIndex) => (
                    <Accordion
                      key={groupIndex}
                      type="multiple"
                      className="w-full"
                    >
                      {group.items.map((item: any, itemIndex: number) => (
                        <AccordionItem key={itemIndex} value={`${itemIndex}`}>
                          <AccordionTrigger>
                            <h4 className="scroll-m-20 text-md font-semibold tracking-tight">
                              {item.heading}
                            </h4>
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="md:text-base list-disc pl-4 flex flex-col space-y-2">
                              {item.subList.map(
                                (subItem: string, subItemIndex: number) => (
                                  <li key={subItemIndex}>{subItem}</li>
                                )
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ))}
                </div>
              </article>{" "}
              <Separator className="flex md:hidden " />
              <form
                className="flex flex-col flex-1 gap-2 rounded-lg"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="examName" className="text-lg">
                    Topic of the exam
                  </Label>
                  <Input
                    type="text"
                    id="examName"
                    name="examName"
                    placeholder="E.G. Organic Chemistry"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    required
                  />
                  <Label htmlFor="notes" className="text-lg">
                    Notes
                  </Label>
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
                  <Label htmlFor="questionCount" className="text-lg">
                    Number of Questions
                  </Label>
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
                  <Button
                    type="submit"
                    className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
                    disabled={isGenerateDisabled}
                  >
                    Generate Exam
                  </Button>
                  {/* <FormMessage message={searchParams} /> */}
                </div>
              </form>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
