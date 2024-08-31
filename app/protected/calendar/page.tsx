"use client";
import { createClient } from "@/utils/supabase/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/components/form-message";
export default function Calendar({ searchParams }: { searchParams: Message }) {
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [isAllDay, setIsAllDay] = useState<any>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    allDay: false,
    timeStart: "",
    timeEnd: "",
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
    // console.log(info.dateStr);
    setFormData({
      title: "",
      description: "",
      date: "",
      allDay: false,
      timeStart: "",
      timeEnd: "",
      type: "exam",
    }); //reset form
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
    console.log(filteredEvents);
    setSelectedDateEvents(sortByTime(filteredEvents));
  };
  const sortByTime = (arr: any) => {
    return arr.sort((a: any, b: any) => {
      const timeToSeconds = (time: string) => {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds;
      };
      return timeToSeconds(a.time_start) - timeToSeconds(b.time_start);
    });
  };
  const handleFormValueChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAllDayChange = (checked: any) => {
    setIsAllDay(checked);
    setFormData((prevData) => ({
      ...prevData,
      allDay: checked,
      timeStart: "",
      timeEnd: "",
    }));
  };
  const addEventAction = async (e: any) => {
    e.preventDefault();
    const { title, description, date, allDay, timeStart, timeEnd, type } =
      formData;

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
        all_day: allDay,
        time_start: timeStart ? timeStart : null,
        time_end: timeEnd ? timeEnd : null,
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
        {
          title,
          description,
          date,
          all_day: allDay,
          time_start: timeStart ? timeStart : null,
          time_end: timeEnd ? timeEnd : null,
          type,
          user_uid: user.id,
        },
      ]);
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        allDay: false,
        timeStart: "",
        timeEnd: "",
        type: "exam",
      });
    }
  };

  const convertTimeTo12HourFormat = (timeString: string) => {
    // Split the input time string into its components
    const [hours, minutes, seconds] = timeString.split(":");
    // Convert hours to a number
    let hour = parseInt(hours);
    // Determine AM or PM suffix
    const ampm = hour >= 12 ? "PM" : "AM";
    // Convert 24-hour time to 12-hour format
    hour = hour % 12 || 12; // Convert "0" to "12" for midnight
    // Return the formatted time string
    return `${hour}:${minutes} ${ampm}`;
  };
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <div className="flex flex-col gap-10">
      <FullCalendar
        height="auto"
        plugins={[dayGridPlugin, interactionPlugin]}
        // plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        selectable={true}
        // headerToolbar={{
        //   left: "prev,next today",
        //   center: "title",
        //   right: "dayGridMonth,timeGridWeek,timeGridDay",
        // }}
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

          <div className="px-2 max-h-[60vh] overflow-auto flex flex-col gap-4 ">
            {!isAddingEvent && (
              <>
                {selectedDateEvents.length > 0 ? (
                  <div>
                    <section id="all-day-events">
                      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        All Day Events
                      </h4>
                      <div className="flex gap-x-8 flex-col sm:flex-row gap-2">
                        {selectedDateEvents
                          .filter((event: any) => event.all_day)
                          .map((event: any, i: number) => (
                            <div
                              key={i}
                              className={`flex gap-4 border p-2 rounded-sm`}
                            >
                              {/* <section className="text-xl flex items-center">
                                -
                              </section> */}
                              <section>
                                <h3 className="flex gap-3 scroll-m-20 text-2xl font-semibold tracking-tight">
                                  <p>{capitalizeFirstLetter(event.title)}</p>
                                  <span className="flex text-center items-center relative rounded bg-muted px-[0.4rem] py-[0.1rem] font-mono text-sm font-semibold">
                                    {event.type.toUpperCase()}{" "}
                                  </span>
                                </h3>
                                <p className="leading-7 [&:not(:first-child)]:mt-1">
                                  {event.description}
                                </p>
                              </section>
                            </div>
                          ))}
                      </div>
                    </section>
                    <section
                      id="timed-events"
                      className="border-t-2 border-gray-500 pt-2 mt-2 gap-y-2"
                    >
                      {selectedDateEvents
                        .filter((event: any) => !event.all_day)
                        .map((event: any, i: number) => (
                          <div
                            key={i}
                            className={`flex flex-col gap-2 ${i > 0 && `border-t mt-2 pt-2`}`}
                          >
                            <section className="text-md flex items-center gap-2">
                              <p className="whitespace-nowrap">
                                {convertTimeTo12HourFormat(event.time_start)}
                              </p>
                              <p>-</p>
                              <p className="whitespace-nowrap">
                                {convertTimeTo12HourFormat(event.time_end)}
                              </p>
                            </section>
                            <section>
                              <h3 className="flex gap-3 scroll-m-20 text-2xl font-semibold tracking-tight">
                                <p>{capitalizeFirstLetter(event.title)}</p>
                                <span className="flex text-center items-center relative rounded bg-muted px-[0.4rem] py-[0.1rem] font-mono text-sm font-semibold">
                                  {event.type.toUpperCase()}{" "}
                                </span>
                              </h3>
                              <p className="leading-7 [&:not(:first-child)]:mt-1">
                                {event.description}
                              </p>
                            </section>
                          </div>
                        ))}
                    </section>
                  </div>
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
                        <Label
                          htmlFor="time"
                          className={isAllDay && "text-gray-400"}
                        >
                          Time Start
                        </Label>
                        <Input
                          disabled={isAllDay}
                          type="time"
                          name="timeStart"
                          value={formData.timeStart}
                          onChange={handleFormValueChange}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label
                          htmlFor="time"
                          className={isAllDay && "text-gray-400"}
                        >
                          Time End
                        </Label>
                        <Input
                          disabled={isAllDay}
                          type="time"
                          name="timeEnd"
                          value={formData.timeEnd}
                          onChange={handleFormValueChange}
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        <Label htmlFor="allDay">All Day</Label>
                        <Checkbox
                          id="allDay"
                          checked={isAllDay}
                          className="h-10 w-10"
                          onCheckedChange={(checked) =>
                            handleAllDayChange(checked)
                          }
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
                  Save
                </SubmitButton>
              </form>
            )}
          </div>

          <DialogFooter className="border-t pt-2">
            {!isAddingEvent && selectedDateEvents.length > 0 && (
              <Button className="w-full" onClick={() => setIsAddingEvent(true)}>
                Add Event
              </Button>
            )}
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
