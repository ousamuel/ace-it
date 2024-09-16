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
import { CircleX, MessageCircleWarningIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { getFlashInstruction } from "@/lib/flash-instructions";
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from "sonner";


export default function GenerateFlashcards() {
  const instructionList = getFlashInstruction();
  const supabase = createClient();
  const router = useRouter();
  const [setName, setSetName] = useState("");
  const [notes, setNotes] = useState("");
  const [number, setNumber] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const[flashSets, setFlashSets] = useState<any>([]);
  const [file, setFile] = useState<File | null>(null);

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // const extractTextFromPDF = async (file: File) => {
  //   const arrayBuffer = await file.arrayBuffer();
  //   const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  //   let text = '';
  
  //   for (let i = 1; i <= pdf.numPages; i++) {
  //     const page = await pdf.getPage(i);
  //     const content = await page.getTextContent();
      
  //     const pageText = content.items
  //       .filter(item => item.hasOwnProperty('str'))  // Ensure it's a TextItem
  //       .map((item) => (item as any).str)  // Access the 'str' property safely
  //       .join(' ');
      
  //     text += pageText + '\n'; 
  //   }
  //   return text;
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFile(e.target.files[0]);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldFetch(false);

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
      setShouldFetch(true);
      toast("Generating set...");
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
        // toast("Generated set successfully!");
      } console.error("Error fetching flashcard sets:", error);
    };
    fetchFlashSet();
    setShouldFetch(true);
  }, [supabase]);

  const clearFlashcards = async (set_uid: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("flashcard_set")
        .delete()
        .eq("set_uid", set_uid);

      if (error) {
        console.error("Error deleting set:", error);
        toast.error("Failed to clear set.");
      } else {
        toast("Set deleted!");
        setShouldFetch(true);
      }
    }
  };

  const date = new Date()

  const updatePracticeDate = async (set_uid: string) => {
    const { error } = await supabase
      .from("flashcard_set")
      .update({
        last_practiced: date,
      })
      .eq("set_uid", set_uid);

    if (error) {
      console.log(error);
    }
  };

  const formatDateObj = (date: string) => {
    let month = "";
    let day = "";
    let year = date.substring(0, 4);
    if (parseInt(date.substring(5, 7)) >= 10) {
      month = date.substring(5, 7);
    } else {
      month = date.substring(6, 7);
    }
    if (parseInt(date.substring(8, 10)) >= 10) {
      day = date.substring(8, 10);
    } else {
      day = date.substring(9, 10);
    }
    return `${month}/${day}/${year}`;
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
        <section>
        <h1 className="text-xl font-extrabold tracking-tight lg:text-3xl">
            My Saved Flashcards
          </h1>
          <div className="my-5 bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
              <MessageCircleWarningIcon size="16" strokeWidth={2} />
                As a free subscriber, you are allowed to save up to 5 flashcard sets at a time. You
                currently have {flashSets.length} sets saved.
            </div>
          <Accordion type="multiple" className="flex flex-col gap-4">
                {flashSets.length > 0 ? (
                  flashSets.map((set: any, i: number) => (
                    <Card key={i} className="w-full">
                      <AccordionItem
                        key={i}
                        value={set.set_name + i}
                        className=""
                      >
                        <AccordionTrigger className="p-4">
                          <CardHeader className="p-0 py-4 px-4">
                            <CardTitle className="flex justify-between lg:text-lg">
                            {capitalizeFirstLetter(set.set_name)}
                            </CardTitle>
                          </CardHeader>
                        </AccordionTrigger>
                          <AccordionContent>
                        <section>
                          <Separator/>
                        <div className="px-4 flex justify-between py-2 pb-5">
                          <section className="flex flex-col flex-1 gap-1">
                            <h4>
                              Created on:{" "}
                              {set.created_at
                                ? formatDateObj(set.created_at)
                                : "N/A"}
                            </h4>
                            {/* <h4>
                              Last taken on:{" "}
                              {set.last_practiced
                                ? formatDateObj(set.last_practiced)
                                : "N/A"}
                            </h4> */}
                          </section>
                          <Popover>
                              <PopoverTrigger className="flex h-fit">
                                {" "}
                                <CircleX
                                  className="hover:text-red-500 cursor-pointer"
                                  // onClick={() => {
                                  //   console.log(exam.exam_uid);
                                  // }}
                                />
                              </PopoverTrigger>
                              <PopoverContent
                                onClick={() => clearFlashcards(set.set_uid)}
                                className="w-fit text-red-600 cursor-pointer"
                              >
                                <p>Confirm Delete</p>
                                <p className="text-sm text-muted-foreground">
                                  This action is undoable
                                </p>
                              </PopoverContent>
                            </Popover>

                          </div>
                          {/* <Separator/> */}

                          <Flashcard shouldFetch={shouldFetch} set_uid={set.set_uid} />
                          </section>
                          </AccordionContent>
                        </AccordionItem>
                      </Card>
                ))
              ) : (
                <p className="text-lg text-muted-foreground">
                  No Sets saved yet.
                </p>
              )}
              
              <a href="/verified/home">
                <button
                      // type="submit"
                      className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
                    >
                        Generate More!
                </button>
              </a>
            </Accordion>
        </section>
    </ContentLayout>
  );
}
