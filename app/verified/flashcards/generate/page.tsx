// generate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";
import { addFlashcards } from "@/app/actions";
import { redirect } from "next/navigation";
import { Message } from "@/components/form-message";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MessageCircleWarningIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Box } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Flashcard from "./Flashcard";
import Flashcard_v2 from "./Flashcard_v2";
import { getInstructionList } from "@/lib/mock-instructions";
import { getFlashInstruction } from "@/lib/flash-instructions";


export default function GenerateFlashcards() {
  const instructionList = getFlashInstruction();
  const supabase = createClient();
  const router = useRouter();
  const [setName, setSetName] = useState("");
  const [notes, setNotes] = useState("");
  const [number, setNumber] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const[flashSets, setFlashSets] = useState<any>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(false);

    const formData = new FormData();
    formData.append("notes", notes);
    formData.append("setName", setName);
    formData.append("setNumber", number);

    const response = await addFlashcards(formData);
    if (response?.error) {
      console.error(response.error);
    } else {
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    const fetchFlashSet = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return redirect("/sign-in");
      }
      const { data, error } = await supabase
        .from("flashcard_set")
        .select("*")
        .eq("user_uid", user?.id);
      if (data) {
        setFlashSets(data);
      } console.error("Error fetching flashcard sets:", error);
    };
    fetchFlashSet();
  }, [supabase]);

  return (
    <ContentLayout title="Flashcards">
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
            <BreadcrumbPage>Flashcards</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Tabs defaultValue="new-exam" className="w-full">
        <TabsList className="grid w-full grid-cols-2 my-8">
          <TabsTrigger value="new-flashcards">Add New Flashcards</TabsTrigger>
          <TabsTrigger value="saved-flashcards">Saved Flashcards</TabsTrigger>
        </TabsList>
        <TabsContent value="new-flashcards">
        <section className="flex flex-col gap-2 md:gap-6 text-center">          
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl">
                Flashcards
              </h1>
              <h3 className="sm:text-base font-semibold tracking-tight text-muted-foreground">
                Create custom flashcards to enhance your studying!
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
              className="flex flex-col flex-1 gap-2"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="setName" className="text-lg">Flashcard Set Name</Label>
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
                <Label htmlFor="setName" className="text-lg">Number of Flashcards</Label>
                <Input
                  type="text"
                  id="setNumber"
                  name="setNumber"
                  placeholder="e.g. Choose from 1-30"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
                >
                  Generate Flashcards
                </button>
                <p className="text-sm text-muted-foreground">
                    Please note that while our AI strives for accuracy, it may
                    occasionally produce incorrect information, so always verify
                    critical details.
                  </p>
              </div>
            </form>
          </div>
          </section>
      </TabsContent>
      <TabsContent value="saved-flashcards">
        <section>
        <h1 className="text-xl font-extrabold tracking-tight lg:text-3xl">
            My Saved Flashcards
          </h1>
          <div className="my-5 bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
              <MessageCircleWarningIcon size="16" strokeWidth={2} />
                Currently, you can create only one set of flashcards. 
                We're working on allowing multiple sets, and this feature will be available soon!
            </div>
          {/* <Accordion type="multiple" className="flex flex-col gap-4">
                {flashSets.length > 0 ? (
                  flashSets.map((exam: any, i: number) => (
                    
                    <Card key={i} className="w-full">
                      <AccordionItem
                        key={i}
                        value={exam.exam_name + i}
                        className=""
                      >
                        <AccordionTrigger className="p-4">
                          <CardHeader className="p-0 py-4 px-4">
                            <CardTitle className="flex justify-between lg:text-lg text-white">
                              {flashSets.set_name} Soon
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                          <AccordionContent>
                            Soon
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                ))
              ) : (
                <p className="text-lg text-muted-foreground">
                  No Sets saved yet.
                </p>
              )}
            </Accordion> */}
            <Flashcard_v2 shouldFetch={shouldFetch} />
        </section>

      </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
