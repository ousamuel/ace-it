// generate/fladhcards_v2.tsx
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "sonner";

export default function Flashcard_v2() {
  const supabase = createClient();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

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
      } else {
        toast('Flashcards generated!')
      }
    };

    fetchUserFlashcards();
  }, [supabase]);

  const deleteFlashcard = async (flashcard: any) => {
    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("id", flashcard.id);

    if (error) {
      console.error("Error deleting flashcard:", error);
    } else {
      toast("Flashcard deleted!", {
        description: `"${flashcard.question}: ${flashcard.answer}"`,
      });
      // Remove the deleted flashcard from the state
      setFlashcards((prevFlashcards) =>
        prevFlashcards.filter((card) => card.id !== flashcard.id)
      );
      // Reset the currentIndex if it is out of bounds after deletion
      setCurrentIndex((prevIndex) => 
        prevIndex >= flashcards.length - 1 ? 0 : prevIndex
      );
    }
  };

  const clearFlashcards = async (flashcard: any) =>{
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
    const { error } = await supabase
      .from("flashcards")
      .delete()
      .eq("user_uid", user.id);

      if (error) {
        console.error("Error deleting flashcards:", error);
        toast.error("Failed to clear flashcards.");
      } else {
        setFlashcards([]);
        setCurrentIndex(0);
        toast("All flashcards cleared!");
      }
    }
};

  const handleNext = () => {
    setFlipped(false); // Reset flip state when moving to the next card
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false); // Reset flip state when moving to the previous card
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleCardClick = () => {
    setFlipped((prev) => !prev);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      handleNext();
    } else if (event.key === "ArrowLeft") {
      handlePrev();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [flashcards]);

  if (flashcards.length === 0) {
    return <p>Loading flashcards...</p>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="text-center">
      <p className="text-md pb-5 text-zinc-500">
        Use the left and right arrows to navigate through the flashcards. Click on the card or use the "Flip" button to view the answer.
      </p>
      <div className="flex flex-row justify-center items-center gap-2 py-2">
        <p className="text-md">
            {currentIndex + 1}/{flashcards.length}
        </p>
        <button
          onClick={() => deleteFlashcard(currentCard)}
          className="cursor-pointer text-red-500 rounded hover:bg-red-200/20 p-1 px-2"
        >
          Delete
        </button>
        <button
          onClick={() => clearFlashcards(currentCard)}
          className="cursor-pointer text-red-500 rounded hover:bg-red-200/20 p-1 px-2"
        >
          clear
        </button>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div onClick={handleCardClick}>
          <Box
            sx={{
              borderRadius: "20px",
              border: "1px rgba(34, 197, 94, 0.5) solid",
              perspective: "1000px",
              width: {xs:"300px",lg:"500px", xl:"800px"},
              height: {xs:"200px",lg:"300px", xl:"500px"},
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              "& > div": {
                transition: "transform 0.6s",
                transformStyle: "preserve-3d",
                position: "relative",
                width: "100%",
                height: "100%",
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                borderRadius: "20px",
              },
              "& > div > div": {
                position: "absolute",
                borderRadius: "20px",
                width: "100%",
                height: "60%",
                backfaceVisibility: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // padding: 2,
                boxSizing: "border-box",
              },
              "& > div > div:nth-of-type(2)": {
                transform: "rotateY(180deg)",
              },
            }}
          >
            <div className="relative flex flex-col gap-1 justify-center">
              <div className="">
                <Typography variant="h6" component="p">
                  {currentCard.question}
                </Typography>
              </div>
              <div>
                <Typography variant="h6" component="p">
                  {currentCard.answer}
                </Typography>
              </div>
            </div>
          </Box>
        </div>

      </div>
      <div className="flex justify-center items-center gap-4 py-5">
          <button
              onClick={handlePrev}
              className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
            >
                &lt;
          </button>
          <div className="flex flex-col gap-1">
            <button
                onClick={handleCardClick}
                  className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
              >
                Flip
            </button>
          </div>
            <button
                onClick={handleNext}
                  className="px-4 py-2 font-bold text-white bg-green-700 rounded hover:bg-green-500 cursor-pointer"
              >
                &gt;
              </button>
          
        </div>
    </div>
  );
}
