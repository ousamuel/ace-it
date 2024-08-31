import { useState } from "react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [flipped, setFlipped] = useState<boolean>(false);


  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="hover:shadow-zinc-800 relative w-full h-48 rounded-lg shadow-lg cursor-pointer"
      style={{ perspective: "1000px" }}  // Added perspective to the parent
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-600 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black rounded-lg backface-hidden" style={{ backfaceVisibility: "hidden" }}>
          <p className="text-lg font-bold ">{question}</p>
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg backface-hidden"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <p className="text-lg font-bold">{answer}</p>
        </div>
      </div>
    </div>
  );
}
