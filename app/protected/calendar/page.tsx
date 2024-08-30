"use client";
import { createClient } from "@/utils/supabase/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Calendar({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "exam",
  });

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("user_uid", user.id);

        if (data) {
          setEvents(data);
        } else if (error) {
          console.error("Error fetching events:", error);
        }
      }
    };
    fetchUserAndEvents();
  }, [supabase]);

  const handleDateClick = (info: any) => {
    setIsDialogOpen(true);
    setIsAddingEvent(false); // Start by showing existing events
    const clickedDate = info.dateStr;
    setFormData((prevData) => ({
      ...prevData,
      date: clickedDate,
    }));
    setSelectedDate(clickedDate);
    const filteredEvents = events.filter(
      (event: any) => event.date === clickedDate
    );
    setSelectedDateEvents(filteredEvents);
  };

  const handleFormValueChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addEventAction = async (e: any) => {
    e.preventDefault();
    const { title, description, date, time, type } = formData;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return; // Handle user not logged in case
    }

    const { error } = await supabase.from("events").insert([
      {
        title,
        description,
        date,
        time,
        type,
        user_uid: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding event:", error);
    } else {
      // Update the events list and close the dialog
      setEvents((prevEvents) => [
        ...prevEvents,
        { title, description, date, time, type, user_uid: user.id },
      ]);
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        type: "exam",
      });
    }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="border-b pb-2">
            <DialogTitle>
              <p className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                {selectedDate?.substring(5, 7)}/{selectedDate?.substring(8, 10)}
                /{selectedDate?.substring(0, 4)}
              </p>
            </DialogTitle>
            <DialogDescription>
              {isAddingEvent ? "Add a new event for this date." : null}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-auto">
            {!isAddingEvent && (
              <>
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event: any, i: number) => (
                    //                 title: "",
                    // description: "",
                    // date: "",
                    // time: "",
                    // type: "exam",
                    <div key={i} className="flex gap-4">
                      <section className="text-4xl flex items-center">
                        •
                      </section>
                      <section>
                        <h3 className="flex gap-3 scroll-m-20 text-2xl font-semibold tracking-tight">
                          <p>{event.title}</p>
                          <span className="flex text-center items-center relative rounded bg-muted px-[0.4rem] py-[0.1rem] font-mono text-sm font-semibold">
                            {event.type.toUpperCase()}{" "}
                          </span>
                        </h3>
                        <p className="leading-7 [&:not(:first-child)]:mt-1">
                          {event.description}
                        </p>
                      </section>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-4">
                    <p>No events for this date. You can add one below.</p>
                    <Button
                      className="w-full"
                      onClick={() => setIsAddingEvent(true)}
                    >
                      Add Event
                    </Button>
                  </div>
                )}
              </>
            )}

            {isAddingEvent && (
              <form onSubmit={addEventAction} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <section className="flex flex-1 flex-col gap-4">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      type="text"
                      name="title"
                      placeholder="E.G. English Exam"
                      value={formData.title}
                      onChange={handleFormValueChange}
                      required
                    />

                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      name="description"
                      placeholder="Details about the event"
                      className="resize-none"
                      value={formData.description}
                      onChange={handleFormValueChange}
                      required
                    />
                  </section>

                  <section className="flex flex-1 flex-col gap-4 md:max-w-md">
                    <section className="flex gap-4">
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleFormValueChange}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleFormValueChange}
                        />
                      </div>
                    </section>

                    <Label htmlFor="type">Type</Label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleFormValueChange}
                      required
                      className="border rounded p-2"
                    >
                      <option value="exam">Exam</option>
                      <option value="assignment">Assignment</option>
                      <option value="personal">Personal</option>
                      <option value="other">Other</option>
                    </select>
                  </section>
                </div>

                <SubmitButton type="submit" pendingText="Adding Event...">
                  Add Event
                </SubmitButton>
              </form>
            )}
          </div>

          <DialogFooter className="border-t pt-2">
            {selectedDateEvents.length > 0 && (
              <Button onClick={() => setIsAddingEvent(true)}>Add Event</Button>
            )}
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
