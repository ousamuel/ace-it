// generate/fladhcards.tsx
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FlashcardProps {
  shouldFetch: boolean;
  set_uid: string; // Include set_uid in the props
}

export default function Flashcard({
  shouldFetch,
  set_uid,
}: FlashcardProps) {
  const supabase = createClient();

  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (shouldFetch) {
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
        .eq("set_uid", set_uid);

      setLoading(false);

      if (data) {
        setFlashcards(data);
      } else if (error) {
        console.error("Error fetching flashcards:", error);
      } else {
        toast("Flashcards generated!");
      }
    };

    fetchUserFlashcards();
    // }
  }, [supabase, shouldFetch]);

  const deleteFlashcard = async (flashcard: any) => {
    // see how many cards are left in the specific set
    const { data, error: lastCardError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("set_uid", flashcard.set_uid);
    if (lastCardError) {
      return;
    } else if (data.length <= 1) {
      // if card is last one in the set, delete the entire set, not just the last card
      const { error: deleteSetError } = await supabase
        .from("flashcard_set")
        .delete()
        .eq("set_uid", flashcard.set_uid);
      if (deleteSetError) {
        // console.log("Error deleting set:", deleteSetError);
        return;
      } else{
        // rerender flashcards with all flashcards that are NOT part of the deleted set
        setFlashcards((prevFlashcards) =>
          prevFlashcards.filter((card) => card.set_uid !== flashcard.set_uid)
        );
        // Reset the currentIndex if it is out of bounds after deletion
        setCurrentIndex((prevIndex) =>
          prevIndex >= flashcards.length - 1 ? 0 : prevIndex
        );
      }
    } else {
      const { error: deleteSingleFlashcardError } = await supabase
        .from("flashcards")
        .delete()
        .eq("id", flashcard.id);

      if (deleteSingleFlashcardError) {
        console.error("Error deleting flashcard:", deleteSingleFlashcardError);
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

  if (loading) {
    return <p className="text-zinc-500">Flashcards loading...</p>;
  }
  if (flashcards.length === 0) {
    return <p className="text-zinc-500">No flashcards yet...</p>;
  }

  let currentCard = flashcards[currentIndex];

  return (
    <div className="text-center">
      <p className="text-md pb-5 text-zinc-500">
        Use the left and right arrows to navigate through the flashcards. Click
        on the card or use the "Flip" button to view the answer.
      </p>
      <div className="flex flex-row justify-center items-center gap-2 py-2">
        <p className="text-md">
          {currentIndex + 1}/{flashcards.length}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img
              className="dark:invert dark:filter py-1"
              width={20}
              src="/options.svg"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              id="delete-card"
              className="text-red-500 hover:bg-red-200/20"
              onClick={() => {
                deleteFlashcard(currentCard);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div onClick={handleCardClick}>
          <Box
            sx={{
              borderRadius: "20px",
              border: "1px rgba(34, 197, 94, 0.5) solid",
              perspective: "1000px",
              width: { xs: "300px", lg: "500px", xl: "800px" },
              height: { xs: "200px", lg: "300px", xl: "500px" },
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
            <div className="relative flex flex-col gap-1 justify-center">
              <div className="">
                <p>
                  {currentCard.question}
                </p>
              </div>
              <div className="bg-green-500/10">
               <p>
                  {currentCard.answer}
                </p>
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
