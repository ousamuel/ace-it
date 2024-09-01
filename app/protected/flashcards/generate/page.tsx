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
import Flashcard from "./Flashcard";

export default function GenerateFlashcards({ searchParams }: { searchParams: Message }) {
    const supabase = createClient();
    const router = useRouter();
    const [setName, setSetName] = useState("");
    const [notes, setNotes] = useState("");
    const [number, setNumber] = useState("");

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
            <h3 className="text-2xl font-semibold tracking-tight">
                My Flashcards
            </h3>
            <Flashcard/>

        </div>
    );
}
