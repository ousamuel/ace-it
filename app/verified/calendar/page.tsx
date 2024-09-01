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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/components/form-message";
export default function Calendar({ searchParams }: { searchParams: Message }) {
  // deliverables
  // multiple date selection
  // recurring events
  const supabase = createClient();
  const [events, setEvents] = useState<any[]>([]);
  const [pinnedEvents, setPinnedEvents] = useState<any[]>([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [eventID, setEventID] = useState<string>("");
  const [isAllDay, setIsAllDay] = useState<any>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [pinnedOpen, setPinnedOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    allDay: false,
    timeStart: "",
    timeEnd: "",
    type: "exam",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserAndEvents = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("user_uid", user.id);

        if (error) {
          throw new Error("Error fetching events");
        }

        setEvents(data);
        setPinnedEvents(sortByTime(data.filter((e: any) => e.pinned)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUserAndEvents();
  }, [supabase]);
  // In your component's return statement

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: selectedDate,
      allDay: false,
      timeStart: "",
      timeEnd: "",
      type: "exam",
    });
    setIsAllDay(false);
  };
  const handleDateClick = (info: any) => {
    resetForm();
    setIsDialogOpen(true);
    const clickedDate = info.dateStr;
    setFormData((prevData) => ({
      ...prevData,
      date: clickedDate,
    }));
    setSelectedDate(clickedDate);
    // console.log(events);
    const filteredEvents = events.filter(
      (event: any) => event.date === clickedDate
    );
    setSelectedDateEvents(sortByTime(filteredEvents));
  };
  const deleteEventAction = async (event: any) => {
    const { error } = await supabase.from("events").delete().eq("id", event.id);
    if (error) {
      console.error("Error deleting event:", error);
    } else {
      toast("Event deleted!", {
        description: `"${event.title}: ${event.description}"`,
      });
      setIsDialogOpen(false);
      fetchUserAndEvents();
    }
  };
  const pinEventAction = async (prevState: boolean, event_id: number) => {
    const { error } = await supabase
      .from("events")
      .update({
        pinned: !prevState,
      })
      .eq("id", event_id);

    if (error) {
      console.error("Error updating event:", error);
    } else {
      fetchUserAndEvents();
    }
  };
  const editEventAction = async (e: any) => {
    e.preventDefault();
    const { title, description, date, allDay, timeStart, timeEnd, type } =
      formData;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return; // Handle user not logged in case
    }

    const { error } = await supabase
      .from("events")
      .update({
        title,
        description,
        date,
        all_day: allDay,
        time_start: timeStart ? timeStart : null,
        time_end: timeEnd ? timeEnd : null,
        type,
      })
      .eq("id", eventID);

    if (error) {
      console.error("Error updating event:", error);
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === eventID
            ? {
                ...ev,
                title,
                description,
                date,
                all_day: allDay,
                time_start: timeStart,
                time_end: timeEnd,
                type,
              }
            : ev
        )
      );
      setIsDialogOpen(false); // Close dialog after saving
      setIsEditingEvent(false); // Reset editing state
    }
  };
  const addEventAction = async (e: any) => {
    e.preventDefault();
    const { title, description, date, allDay, timeStart, timeEnd, type } =
      formData;
    if (!title || !description) {
      toast("Missing fields:", {
        description: `${!title && "Title"} ${!description && "Description"}`,
      });
      return;
    }
    if (!allDay && (!timeStart || !timeEnd)) {
      toast("Please enter start & end time or choose all day", {
        description: `${!timeStart ? "Currently missing start time" : "Currently missing end time"}`,
      });
      return;
    }
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
        pinned: pinnedOpen,
        time_start: allDay ? null : timeStart, // Only pass times if not all-day
        time_end: allDay ? null : timeEnd,
        type,
        user_uid: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding event:", error);
    } else {
      toast(
        `Event added for ${
          selectedDate?.substring(5, 7) /
          selectedDate?.substring(8, 10) /
          selectedDate?.substring(0, 4)
        }`,
        {
          description: `${title} ${!allDay && `from ${convertTimeTo12HourFormat(timeStart)} to ${convertTimeTo12HourFormat(timeEnd)}`}`,
        }
      );
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
      setIsAddingEvent(false);
      setIsDialogOpen(false);
    }
  };
  const sortByTime = (arr: any) => {
    return arr.sort((a: any, b: any) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // First, compare by date
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;

      // If dates are equal, compare by time
      const timeToSeconds = (time: string | null) => {
        if (!time) return 0;
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + (seconds || 0);
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

  const EventSection = ({ event, i }: { event: any; i: number }) => {
    return (
      <div className={`flex flex-col gap-1 ${i > 0 && `border-t mt-2 pt-2`}`}>
        <section className="text-md flex justify-between">
          <div className="flex gap-4">
            {pinnedOpen && (
              <p className="whitespace-nowrap flex items-center">
                {event.date?.substring(5, 7)}/{event.date?.substring(8, 10)}/
                {event.date?.substring(0, 4)}
              </p>
            )}
            {event.all_day ? (
              <div className="flex gap-4">
                <Badge>{event.type.toUpperCase()} </Badge>
              </div>
            ) : (
              <div className="flex gap-2">
                <Badge>{event.type.toUpperCase()} </Badge>
                <p className="whitespace-nowrap flex items-center">
                  {convertTimeTo12HourFormat(event.time_start)}
                </p>
                <p className="whitespace-nowrap flex items-center">-</p>
                <p className="whitespace-nowrap flex items-center">
                  {convertTimeTo12HourFormat(event.time_end)}
                </p>
              </div>
            )}
          </div>

          <div className="flex">
            {event.pinned && (
              <img
                className="dark:invert dark:filter"
                width={30}
                src="/pinned.svg"
              />
            )}
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
                  onClick={() => {
                    setIsEditingEvent(true);
                    setPinnedOpen(false);
                    setIsAddingEvent(false); // Disable add event mode
                    setIsDialogOpen(true); // Open the dialog for editing
                    setEventID(event.id);
                    setFormData({
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      allDay: event.all_day,
                      timeStart: event.time_start,
                      timeEnd: event.time_end,
                      type: event.type,
                    });
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    toast(`
                      "${event.title}" ${event.pinned ? "un" : ""}pinned`);
                    pinEventAction(event.pinned, event.id);
                  }}
                >
                  {event.pinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>{" "}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  id="delete-event"
                  className="text-red-500 hover:bg-red-800"
                  onClick={() => {
                    deleteEventAction(event);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
        <section className="">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight flex gap-3">
            <p>{capitalizeFirstLetter(event.title)}</p>
          </h4>
          <p className="leading-7 [&:not(:first-child)]:mt-1">
            {event.description}
          </p>
        </section>
      </div>
    );
  };
  return (
    <ContentLayout title="Calendar">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Calendar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-2 w-full">
        <h2
          className=" border-b pb-2 text-3xl  
      text-center font-semibold tracking-tight first:mt-0"
        >
          My Calendar
        </h2>{" "}
        <Button
          className="mb-2"
          onClick={() => {
            setIsDialogOpen(true);
            setPinnedOpen(true);
          }}
        >
          View All Pinned Events
        </Button>
        {isLoading ? (
          <div className="space-y-10">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
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
            //   right: "dayGridMonth,timeGridWeek,timeGridDay, timeGridYear",
            // }}
            dateClick={handleDateClick}
          />
        )}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddingEvent(false);
              setIsEditingEvent(false);
              setPinnedOpen(false);
              setSelectedDate("");
              resetForm();
            }
            setIsDialogOpen(open);
          }}
        >
          <DialogContent>
            <DialogHeader className="border-b pb-2">
              <DialogTitle>
                <p className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
                  {/* {!pinnedOpen } */}
                  {/* {selectedDate?.substring(5, 7)}/{selectedDate?.substring(8, 10)}
                /{selectedDate?.substring(0, 4)} */}
                  {selectedDate
                    ? `${selectedDate?.substring(5, 7)} /
                    ${selectedDate?.substring(8, 10)} /
                    ${selectedDate?.substring(0, 4)}`
                    : "Pinned Events"}
                </p>
              </DialogTitle>
              <DialogDescription>
                {isAddingEvent
                  ? "Add a new event for this date."
                  : isEditingEvent && `Currently editing`}
              </DialogDescription>
            </DialogHeader>

            <div className="px-2 max-h-[60h] overflow-auto flex flex-col gap-4 ">
              {!isAddingEvent && !isEditingEvent && !pinnedOpen && (
                <>
                  {selectedDateEvents.length > 0 ? (
                    <div>
                      {selectedDateEvents.filter((event: any) => event.all_day)
                        .length > 0 && (
                        <section id="all-day-events">
                          <h4 className="scroll-m-20 text-xl text-center font-semibold tracking-tight">
                            All Day Events
                          </h4>
                          {selectedDateEvents
                            .filter((event: any) => event.all_day)
                            .map((event: any, i: number) => (
                              <EventSection event={event} i={i} key={i} />
                            ))}
                        </section>
                      )}
                      {selectedDateEvents.filter((event: any) => !event.all_day)
                        .length > 0 && (
                        <section
                          id="timed-events"
                          className={`${
                            selectedDateEvents.filter(
                              (event: any) => event.all_day
                            ).length > 0 &&
                            "border-t-2 border-gray-500 pt-5 mt-5"
                          } gap-y-2`}
                        >
                          {selectedDateEvents
                            .filter((event: any) => !event.all_day)
                            .map((event: any, i: number) => (
                              <EventSection event={event} i={i} key={i} />
                            ))}
                        </section>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <p>No events for this date. You can add one below.</p>
                      <Button
                        className=""
                        onClick={() => {
                          setIsAddingEvent(true);
                          resetForm();
                        }}
                      >
                        Add Event
                      </Button>
                    </div>
                  )}
                </>
              )}

              {(isAddingEvent || isEditingEvent) && (
                <form
                  onSubmit={isAddingEvent ? addEventAction : editEventAction}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <section className="flex flex-1 flex-col gap-4">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        type="text"
                        name="title"
                        placeholder="E.G. English Exam"
                        value={formData.title}
                        onChange={handleFormValueChange}
                      />

                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        name="description"
                        placeholder="Details about the event"
                        className="resize-none"
                        value={formData.description}
                        onChange={handleFormValueChange}
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
                      <section className="flex gap-4">
                        {pinnedOpen && (
                          <div className="flex flex-col gap-4">
                            <Label
                              htmlFor="date"
                              className={isAllDay && "text-gray-400"}
                            >
                              Date Start
                            </Label>
                            <Input
                              type="date"
                              name="date"
                              value={formData.timeStart}
                              onChange={handleFormValueChange}
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-4">
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
                        </div>
                      </section>
                    </section>
                  </div>

                  <SubmitButton type="submit" pendingText="Saving Event...">
                    Save
                  </SubmitButton>
                </form>
              )}
              {pinnedOpen &&
                pinnedEvents.map((event: any, i: number) => (
                  <EventSection event={event} i={i} key={i} />
                ))}
            </div>

            <DialogFooter className="border-t pt-2">
              {!isAddingEvent &&
                !isEditingEvent &&
                selectedDateEvents.length > 0 && (
                  <Button
                    className=""
                    onClick={() => {
                      setIsAddingEvent(true);
                      setPinnedOpen(false);
                      resetForm();
                    }}
                  >
                    Add New Event
                  </Button>
                )}
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsAddingEvent(false);
                  setIsEditingEvent(false);
                  setPinnedOpen(false);
                  setSelectedDate("");
                  resetForm();
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
