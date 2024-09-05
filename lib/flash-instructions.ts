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
            `In the "Topic of the Flashcards" field, input the subject you’re focusing on. For this example, let’s say you are preparing flashcards on "Photosynthesis." This will guide the AI to generate questions specifically related to this topic.`,
            `Example: Enter "Photosynthesis" as your flashcard topic. This will ensure the AI focuses on questions relevant to photosynthesis processes.`,
          ],
        },
        {
          heading: "Provide Detailed Notes",
          subList: [
            `In the "Notes" section, describe the specific areas of photosynthesis you want the flashcards to cover. Be detailed in your description to help the AI generate targeted questions.`,
            `Example: You could note, "Focus on light-dependent reactions, the Calvin cycle, and the role of chlorophyll." This gives the AI clear direction on the aspects of photosynthesis to emphasize.`,
          ],
        },
        {
          heading: "Specify the Number of Flashcards",
          subList: [
            `In the "Number of Flashcards" field, decide how many flashcards you'd like to generate. The maximum limit is 30 flashcards per set.`,
            `Example: If you're doing a quick review, you might enter "5" for a smaller set of flashcards. For a deeper dive into photosynthesis, you might enter "15."`,
          ],
        },
        {
          heading: "Submit the Form",
          subList: [
            `After filling out the fields, click the "Generate Flashcards" button. The AI will process your topic and notes to create flashcards based on photosynthesis.`,
            `Look for the generated flashcards under the "Saved Flashcards" section. Allow 1-2 minutes for the flashcards to appear, and refresh the page if needed.`,
          ],
        },
        {
          heading: "Additional Tips",
          subList: [
            `Be as specific as possible: For example, specifying "chloroplast structure" or "stages of the Calvin cycle" helps the AI generate more focused and useful flashcards.`,
            `Review your flashcards: Once generated, check that the questions are aligned with what you need to study. If necessary, refine your notes and try generating again.`,
          ],
        },
      ],
    },
  ];
};
