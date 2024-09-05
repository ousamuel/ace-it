// types.ts
type SubListItem = string;

type ListItem = {
  heading: string;
  subList: SubListItem[];
};

type ListGroup = {
  groupLabel: string;
  items: ListItem[];
};

export const getFlashInstruction = (): ListGroup[] => {
  return [
    {
      groupLabel: "",
      items: [
        {
          heading: "Enter the Topic of the Flashcards",
          subList: [
            `In the "Topic of the Flashcards" field, input the specific subject or topic you want to create an exam for. This could be a broad subject like "Organic Chemistry" or a more focused topic like "Photosynthesis in Plants."`,
            `Example: If you're studying for a Chemistry exam, you might enter "Organic Chemistry."`,
          ],
        },
        {
          heading: "Provide Detailed Notes",
          subList: [
            `In the "Notes" section, describe the key concepts, topics, or areas you'd like the exam questions to cover. Be as specific and comprehensive as possible to ensure the AI generates relevant and focused questions.
`,
            `Example: If you're studying the periodic table, you might note, "Focus on transition metals, their properties, and common reactions involving them."
`,
          ],
        },
        {
          heading: "Specify the Number of Flashcards",
          subList: [
            `Enter the number of flashcards you'd like the set to contain in the "Number of Flashcards" field.
`,
            `Example: If you want a short set, you might enter "5." For a more thorough review, you might enter "10".
`,
          ],
        },
        {
          heading: "Submit the Form",
          subList: [
            `Once you've filled in all the fields, click the "Generate Flashcards" button. The AI will process your notes and generate a custom set with questions tailored to the topics you've provided.
`,
            `Look for your newly generated set in the "Saved Flashcards" tab. Please allow up to 1-2 minutes for the set to be generated and refresh your page.`,
          ],
        },
        {
          heading: "Additional Tips",
          subList: [
            `Be Specific: The more detailed and specific your notes, the better the AI can generate questions that match your study needs.`,
            `Review Generated Questions: After the set is generated, go through the questions to ensure they align with your expectations and the material you've been studying.`,
          ],
        },
      ],
    },
    // You can add more groups and items as needed
  ];
};
