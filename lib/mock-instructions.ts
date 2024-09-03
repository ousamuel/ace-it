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

export const getInstructionList = (): ListGroup[] => {
  return [
    {
      groupLabel: "",
      items: [
        {
          heading: "Enter the Topic of the Exam",
          subList: [
            `In the "Topic of the exam" field, input the specific subject or topic you want to create an exam for. This could be a broad subject like "Organic Chemistry" or a more focused topic like "Photosynthesis in Plants."`,
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
          heading: "Specify the Number of Questions",
          subList: [
            `Enter the number of questions you'd like the mock exam to contain in the "Number of Questions" field. This allows the AI to tailor the exam to your desired length.
`,
            `Example: If you want a short quiz, you might enter "5." For a more thorough review, you might enter "10".
`,
          ],
        },
        {
          heading: "Submit the Form",
          subList: [
            `Once you've filled in all the fields, click the "Generate Exam" button. The AI will process your notes and generate a custom exam with questions tailored to the topics you've provided.
`,
            `Look for your newly generated exam in the "Saved Exams" tab. Please allow up to 1-2 minutes for the exam to be generated and refresh your page.`,
          ],
        },
        {
          heading: "Additional Tips",
          subList: [
            `Be Specific: The more detailed and specific your notes, the better the AI can generate questions that match your study needs.`,
            `Review Generated Questions: After the exam is generated, go through the questions to ensure they align with your expectations and the material you've been studying.`,
          ],
        },
      ],
    },
    // You can add more groups and items as needed
  ];
};
