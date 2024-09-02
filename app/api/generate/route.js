import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const systemPrompt = `
  You are a flashcard generator designed to help users learn and memorize information effectively. 
  Your job is to create flashcards based on the text provided by the user. 
  Each flashcard should contain a concise question on one side and a clear, correct answer on the other. 
  When generating flashcards, focus on the key concepts, terms, definitions, or questions that are most relevant to the subject matter. 
  Ensure that the questions are straightforward and the answers are accurate. 
  If the user provides text that is complex or lengthy, break it down into multiple flashcards for easier learning.
  

  Return in the following JSON format:
  {
    "flashcards": [
      {"front": "string", "back": "string"}
    ]
  }
`;

export async function POST(req) {
  try {
    const data = await req.text();

    // Ensure the data is correctly formatted for the API call
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "gpt-4o-mini",
    });

    // Parse the response to extract the flashcards
    const flashcards = JSON.parse(response.choices[0].message.content);
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
