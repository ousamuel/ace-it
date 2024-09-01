import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

import { Box } from "@mui/material";

export default function Flashcard() {
  const supabase = createClient();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);

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
  }, [flashcards, supabase]);

  const handleCardClick = (id: number) => {
      setFlipped((prev) => {
          const newFlipped = [...prev];
          newFlipped[id] = !newFlipped[id];
          return newFlipped;
      });
    };

  return (
    <div>
      {flashcards.map((flashcard, i) => (
        <div
            key={i}
            onClick={() => handleCardClick(i)}
            className="py-5"
            
        >
            <div>
              <Box
                sx={{
                    borderRadius:"20px",
                    border:"1px rgba(34, 197, 94, 0.5) solid",
                    perspective: "1000px",
                    "& > div": {
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    position: "relative",
                    width: "100%",
                    height: "200px",
                    '&:hover':{boxShadow: "0 4px 8px 0 rgba(34, 197, 94, 0.2)"},
                    transform: flipped[i]
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                        borderRadius:"20px",
                    },
                    "& > div > div": {
                    position: "absolute",
                    borderRadius:"20px",
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
                          <p className="text-lg font-bold">{flashcard.question}</p>
                      </div>
                      <div>
                          <p className="text-lg font-bold">{flashcard.answer}</p>
                      </div>
                  </div>
              </Box>
        </div>
      </div>
          ))}
    </div>
  );
}
