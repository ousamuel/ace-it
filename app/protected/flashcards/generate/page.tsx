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
import { v4 as uuidv4 } from 'uuid';

export default function GenerateFlashcards({ searchParams }: { searchParams: Message }) {
    const supabase = createClient();
    const router = useRouter();
    const [setName, setSetName] = useState("");
    const [notes, setNotes] = useState("");
    const [flashcards, setFlashcards] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserFlashcards = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
    
          if (!user) {
            return redirect("/sign-in");
          }
    
          const { data, error } = await supabase
            .from("flashcards")
            .select("*")
            .eq("user_uid", user.id);
    
          if (data) {
            setFlashcards(data);
          } else if (error) {
            console.error("Error fetching flashcards:", error);
          }
        };
    
        fetchUserFlashcards();
      }, [flashcards, supabase]);
    
      const handleSubmit = async () => {
        // Generate a unique set ID
        // const setId = uuidv4();

        const formData = new FormData();
        formData.append("notes", notes);
        formData.append("setName", setName);
        // formData.append("setId", setId);

        

    
        const response = await addFlashcards(formData);
        if (response?.error) {
          console.error(response.error);
        } else {
          router.push("/protected/flashcards/generate");
        }
      };

    return (
        <div className="flex flex-col gap-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                Generate Flashcards
            </h1>
            <h3 className="text-2xl font-semibold tracking-tight">
                Create custom flashcards to enhance your studying!
            </h3>

            <form className="flex flex-col w-full max-w-md p-4 gap-2 mx-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 mt-8">
                    <Label htmlFor="setName">Flashcard Set</Label>
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
                        placeholder="Enter topics or notes you would like to study!"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        required
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500"
                    >
                        Generate Flashcards
                    </button>
                    <FormMessage message={searchParams} />
                </div>
            </form>
            {flashcards.length > 0 && (
                <div>
                    <h4 className="text-xl font-semibold">Your Flashcards</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {flashcards.map((flashcard, i) => (
                            <div key={i} className="p-4 border rounded shadow">
                                <p className="font-bold">{flashcard.question}</p>
                                <p>{flashcard.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
