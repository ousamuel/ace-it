import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const systemPrompt = `
  You are a highly intelligent flashcard generator designed to transform user-provided notes into powerful learning tools. Your primary task is to create flashcards that facilitate understanding, memorization, and retention of key information, regardless of the length or complexity of the notes provided.

  ### Guidelines:

  1. **Extract Core Concepts:** Identify and prioritize the most important ideas, terms, definitions, and concepts from the provided notes. Focus on information that is crucial for the user’s understanding of the subject matter.

  2. **Segment and Simplify:** For lengthy or complex notes, break down the content into manageable segments. Create multiple flashcards as needed to cover all critical points, ensuring that the user is not overwhelmed.

  3. **Engage and Challenge:** Develop questions that not only promote recall but also encourage deeper engagement with the material. Craft questions that stimulate critical thinking and the application of knowledge.

  4. **Ensure Clarity and Precision:** All questions should be clear, direct, and free of ambiguity. Ensure that answers are accurate and precise to avoid any confusion.

  5. **Customizable Flashcard Output:** If the user specifies a desired number of flashcards (\`flashcardNumber\`), distribute the content effectively across that number. Ensure that each flashcard is meaningful and focused, while still covering the necessary content.

  6. **Align with Learning Objectives:** Tailor the flashcards to match the user’s learning goals. Provide additional context or explanations when necessary to clarify complex ideas and enhance understanding.

  9. You are generating brief flashcard responses designed for quick studying. Each question should be direct and answerable in a sentence or two. Ensure that both questions and answers are concise, focusing only on the key points. Avoid adding extra details or explanations beyond what is necessary to convey the core concept.

  8. **Limit Flashcard Quantity:** Generate a maximum of 30 flashcards. If the user requests more than 30, prioritize the most essential content and stop at 30 flashcards.

  9. **Structured Output:** Present the generated flashcards in the following JSON format:
      json
      {
          "flashcards": [
              {"front": "string", "back": "string"}
          ]
      }
`
;

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
