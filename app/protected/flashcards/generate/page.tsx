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

import {
    Box,
    Stack,
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    CardActionArea,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
  } from "@mui/material";

export default function GenerateFlashcards({ searchParams }: { searchParams: Message }) {
    const supabase = createClient();
    const router = useRouter();
    const [setName, setSetName] = useState("");
    const [notes, setNotes] = useState("");
    const [number, setNumber] = useState("");

    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<boolean[]>([]);

    const handleCardClick = (id: number) => {
        setFlipped((prev) => {
            const newFlipped = [...prev];
            newFlipped[id] = !newFlipped[id];
            return newFlipped;
        });
      };


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
        formData.append("setNumber", number);

        

    
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
                    <Label htmlFor="setName">Flashcard Name</Label>
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
                        placeholder="Enter topics or notes you would like to study and tell us how many flashcards you want"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        required
                    />
                    <Label htmlFor="setName">Number</Label>
                    <Input
                        type="text"
                        id="setNumber"
                        name="setNumber"
                        placeholder="5"
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
                    <FormMessage message={searchParams} />
                </div>
            </form>
            
            {flashcards.map((flashcard, i) => (
               <div
                    key={i}
                    onClick={() => handleCardClick(i)}
                    
                >
                    <div>
                        <Box
                        sx={{
                            borderRadius:"20px",
                            border:"0.5px rgba(34, 197, 94, 0.2) solid",
                            perspective: "1000px",
                            "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            '&:hover':{boxShadow: "0 4px 8px 0 rgba(34, 197, 94, 0.2)"},
                            transform: flipped[i]
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                                borderRadius:"20px",
                            },
                            "& > div > div": {
                            position: "absolute",
                            borderRadius:"20px",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                            },
                            "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                            },
                        }}
                        >
                            <div>
                                <div>
                                    <p className="text-lg font-bold text-white">{flashcard.question}</p>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-white">{flashcard.answer}</p>
                                </div>
                            </div>
                        </Box>
                    </div>
              </div>
            ))}

            {/* {flashcards.map((flashcard, i) => (
                <div
                    key={i}
                    onClick={() => handleCardClick(i)}
                    className="relative w-full h-48 rounded-lg shadow-lg cursor-pointer border hover:shadow-green-500/20 border-green-500/20"
                    style={{ perspective: "1000px" }}
                >
                    <div
                        className={`relative w-full h-full text-center transition-transform duration-500 transform ${
                            flipped[i] ? "rotate-y-180" : ""
                        }`}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <div
                            className="absolute inset-0 flex items-center justify-center rounded-lg"
                            // style={{ backfaceVisibility: "hidden" }}
                        >
                            <p className="text-lg font-bold text-white">{flashcard.question}</p>
                        </div>
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg"
                            style={{
                                transform: "rotateY(180deg)",
                                backfaceVisibility: "hidden",
                            }}
                        >
                            <p className="text-lg font-bold">{flashcard.answer}</p>
                        </div>
                    </div>
                </div>
            ))} */}
        </div>
    );
}
