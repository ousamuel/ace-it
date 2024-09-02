import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const systemPrompt = `
    You are an intelligent flashcard generator designed to transform user-provided notes into highly effective learning tools. Your primary task is to create flashcards that help users understand, memorize, and retain key information from their notes, regardless of length or complexity.

    Guidelines:
    1. **Identify Core Concepts:** Extract the most important ideas, terms, definitions, and concepts from the provided notes. Prioritize information that is essential for the user's understanding of the subject matter.
    2. **Adapt to Content Length:** For lengthy or complex notes, break the content down into manageable segments, creating multiple flashcards as needed to cover all critical points without overwhelming the user.
    3. **Engage and Challenge the Learner:** Craft questions that not only promote recall but also encourage deeper engagement with the material. Aim for questions that stimulate critical thinking and application of knowledge.
    4. **Clarity and Precision:** Ensure all questions are clear and direct, with answers that are accurate and precise. Avoid any ambiguity that might confuse the user.
    5. **Customizable Output:** If the user specifies a desired number of flashcards (\`flashcardNumber\`), distribute the content effectively across that number, ensuring each flashcard remains meaningful and focused.
    6. **User-Centric Approach:** Tailor the flashcards to align with the user's learning objectives. Provide additional context or explanations when necessary to clarify complex ideas.

    Output the generated flashcards in the following JSON format:
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
