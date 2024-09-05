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
              className="flex flex-col w-full max-w-md p-4 gap-2 mx-auto border border-green-500/50 rounded-lg"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-2 mt-8 ">
                <Label htmlFor="setName">Flashcard Set Name</Label>
                <Input
                  type="text"
                  id="setName"
                  name="setName"
                  placeholder="E.G. English Exam"
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                  required
                />
                <Label htmlFor="notes">Notes</Label>
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
                <Label htmlFor="setName">Number of Flashcards</Label>
                <Input
                  type="text"
                  id="setNumber"
                  name="setNumber"
                  placeholder="1-30 flashcards"
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
              </div>
            </form>
          </div>
          </section>
      </TabsContent>
      <TabsContent value="saved-flashcards">
        <h3 className="text-2xl font-semibold tracking-tight">My Flashcards</h3>
        <Flashcard_v2 shouldFetch={shouldFetch} />
      </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
