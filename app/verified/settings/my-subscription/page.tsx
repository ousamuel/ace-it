import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const AccordionDemo = () => {
  return (
    <Accordion
      type="multiple"
      className="w-full p-4 bg-background rounded-md mt-4"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <section className="w-full flex justify-between px-4">
            <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
              Free Membership
            </h4>
            <p className="text-sm px-4 py-1 bg-green-500 rounded-full">
              Active
            </p>
          </section>
        </AccordionTrigger>
        <AccordionContent className="px-4">
          <h4>Access to all features with storage limitations:</h4>
          <ul className="mb-1 ml-6 list-disc [&>li]:mt-2">
            <li>
              Maximum of 3 practice exams with up to 10 questions per exam
            </li>
            <li>Maximum of 30 flashcards</li>
            <li>Maximum of 20 calendar events</li>
          </ul>{" "}
          <p className="text-sm text-muted-foreground my-2">
            Members can delete previous data to add new exams/flashcards/events.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <section className="w-full flex justify-between px-4">
            <h4 className="scroll-m-20 text-lg font-semibold tracking-tight px-2">
              Tier 1
            </h4>
          </section>
        </AccordionTrigger>
        <AccordionContent>
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Coming soon!
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default async function MySubscription() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/sign-in");
  }
  return (
    <ContentLayout title="My Subscription">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>My Subcription</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="flex-1 flex flex-col gap-2 overflow-y-scroll my-4">
        <div className="py-4 px-1">
          <h1>Manage your Subscription</h1>
        </div>
        <Separator className="" />
        <AccordionDemo />
      </section>
    </ContentLayout>
  );
}
