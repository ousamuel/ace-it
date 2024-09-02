import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";

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
      }
    };

    fetchUserFlashcards();
  }, [supabase]);

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
    return <Typography>Loading flashcards...</Typography>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="text-center">
      <Typography variant="h5" gutterBottom>
        Use the left and right arrows to navigate through the flashcards. Click on the card or use the "Flip" button to view the answer.
      </Typography>
      <div className="flex justify-center items-center gap-4">
        <Button variant="contained" onClick={handlePrev}>
          &lt; Prev
        </Button>
        <div onClick={handleCardClick}>
          <Box
            sx={{
              borderRadius: "20px",
              border: "1px rgba(34, 197, 94, 0.5) solid",
              perspective: "1000px",
              width: "300px",
              height: "200px",
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
            <div>
              <div>
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
        <Button variant="contained" onClick={handleNext}>
          Next &gt;
        </Button>
      </div>
      <Button variant="outlined" onClick={handleCardClick} className="mt-4">
        Flip
      </Button>
      <Typography variant="caption" display="block" className="mt-2">
        {currentIndex + 1}/{flashcards.length}
      </Typography>
    </div>
  );
}
