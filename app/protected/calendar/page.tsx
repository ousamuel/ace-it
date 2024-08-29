"use client";
import { createClient } from "@/utils/supabase/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage } from "@/components/form-message";
import { addEventAction } from "@/app/actions";
import { Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Import the Textarea component

export default function Calendar({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const [events, setEvents] = useState<any>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

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
          .eq("creator_uid", user.id);

        if (data) {
          setEvents(data); // Set events in the state
        } else if (error) {
          console.error("Error fetching events:", error);
        }
      }
    };
    fetchUserAndEvents();
  }, [supabase, events]);

  const handleDateClick = (info: any) => {
    openDialog();
    const clickedDate = info.dateStr;
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
          <DialogHeader className="border-b pb-2 ">
            <DialogTitle>
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                {selectedDate?.substring(5, 7)}/{selectedDate?.substring(8, 10)}
                /{selectedDate?.substring(0, 4)}
              </h2>
            </DialogTitle>
            <DialogDescription>asdasdasdasd</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {selectedDateEvents.map((event: any) => (
              <div className="flex gap-4">
                <section className="text-4xl flex items-center">•</section>
                <section>
                  <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="leading-7 [&:not(:first-child)]:mt-6">
                    {event.description}
                  </p>
                </section>
              </div>
            ))}
          </div>{" "}
          <DialogFooter>
            <Button onClick={closeDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Calendar</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit calendar</DialogTitle>
            <DialogDescription>
              Add events to your calendar here.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4">
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
                      required
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

            <SubmitButton
              formAction={addEventAction}
              pendingText="Adding Event..."
            >
              Add Event
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
