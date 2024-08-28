"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
export default function Calendar() {
  const supabase = createClient();
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      // Fetch the user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Ensure user exists before fetching events
      if (user) {
        // Fetch events created by the user
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("creator_uid", user.id);

        if (data) {
          setEvents(data); // Set events in the state
        } else if (error) {
          console.error("Error fetching events:", error);
        }
      }
    };
    fetchUserAndEvents();
  }, [supabase]); // Add supabase to the dependency array

  return (
    <div className="flex flex-col gap-10">
      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
      <section>hello</section>
    </div>
  );
}
