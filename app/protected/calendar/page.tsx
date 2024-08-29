"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";
import { addEventAction } from "@/app/actions";
import { Message } from "@/components/form-message";
export default function Calendar({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const [events, setEvents] = useState<any>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "exam",
  });

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
  }, [supabase, events]); // Add supabase to the dependency array
  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    console.log(clickedDate);
    setSelectedDate(clickedDate);
    const filteredEvents = events.filter(
      (event: any) => event.date === clickedDate
    );
    setSelectedDateEvents(filteredEvents);
  };
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        dateClick={handleDateClick}
      />
      <section className="flex flex-col gap-4">
        <form className="flex flex-col gap-4">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            name="title"
            placeholder="E.G. English Exam"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            name="description"
            placeholder="Details about the event"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <Label htmlFor="type">Type</Label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="border rounded p-2"
          >
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>

          <SubmitButton
            formAction={addEventAction}
            pendingText="Adding Event..."
          >
            Add Event
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </section>
    </div>
  );
}
