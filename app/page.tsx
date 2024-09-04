import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Head from "next/head";
import GoogleAnalytics from "@/components/analytics";
import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
const images = [
  "aceit-exams.png",
  "aceit-flashcards.png",
  "aceit-calendar.png",
];
export default async function Index() {
  return (
    <div className=" w-full px-4 lg:px-8 from-transparent via-foreground/10 to-transparent">
      {/* bg-gradient-to-r  */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-3xl">
          <div className="flex gap-5 items-center font-semibold">
            <Link href="/" className="flex flex-row gap-1">
              <h1>ACE</h1>
              <h1 className="text-green-500">IT</h1>
            </Link>
          </div>
          <ThemeSwitcher />
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </nav>
      <Hero />
      <section className="bg-accent flex flex-col xl:flex-row p-4 xl:p-6 rounded-sm mb-10">
        <div className="w-full xl:w-1/3 p-3 flex flex-col justify-center xl:pb-14">
          <h3 className=" scroll-m-20 text-2xl font-semibold tracking-tight">
            Why use AceIT?
          </h3>
          <p className="leading-7 ">
            Ace<span className="brand-green">IT</span> is designed to elevate
            your learning experience with a suite of features tailored to help
            you succeed.
            <br />
            <br />
            P.S. Making an account is completely free!
          </p>
          <ul className="my-4 ml-6 list-disc text-green-500 [&>li]:mt-2 [&>li:nth-child(2n)]:ml-4 [&>li:nth-child(2n)]:text-foreground">
            <li>AI Custom Mock Exams</li>
            <li>
              Generate practice exams for your specific needs to put your
              knowledge to the test.
            </li>
            <li>AI Flashcards</li>
            <li>
              Enhance your learning with AI-powered flashcards that
              automatically generate based on what you ask for.
            </li>
            <li>Personal Calendar</li>
            <li>
              Stay organized with a functional calendar that keeps your
              reminders and deadlines together.
            </li>
          </ul>
        </div>
        <div className="w-full xl:w-2/3 mx-auto px-10 flex flex-col justify-center">
          <Carousel>
            <CarouselContent className="">
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 w-full aspect-video mx-auto flex items-center">
                    {/* <Card>
                      <CardContent className="h-[125px] w-full flex aspect-square items-center justify-center p-6">
                        <span className="text-base sm:text-lg font-semibold">
                          Get Started
                        </span>
                      </CardContent>
                    </Card> */}
                    <img src={image} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      {/* <section className="flex flex-col gap-2 md:gap-5 justify-center items-center pt-0">
        <p className="text-2xl">Features</p>

        <div className="flex items-stretch max-w-12xl mx-auto p-4 grid gap-8 grid-cols-1 sm:grid-cols-2 ">
          <Link href="/sign-up">
            <div className="border border-zinc-500 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:shadow-green-500/50 duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-500 mb-4">
                  Custom Flashcards & Practice Exams
                </h3>
                <p>
                  Enhance your learning with AI-powered flashcards and practice
                  exams that adapt to your study needs and help reinforce key
                  concepts.
                </p>
              </div>
              <Carousel className="w-3/5 sm:w-3/4 mx-auto">
                <CarouselContent className="">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1 w-3/4 mx-auto">
                        <Card>
                          <CardContent className="h-[125px] w-full flex aspect-square items-center justify-center p-6">
                            <span className="text-base sm:text-lg font-semibold">
                              Get Started
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Separator className="my-5 w-4/5 mx-auto" />
              <RadioGroup defaultValue="comfortable" className="px-8 pb-6">
                <h4>What's the name of your new favorite study app?</h4>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">A{")"} Choice B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">
                    B{")"} Ace<span className="brand-green">IT</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="compact" id="r3" />
                  <Label htmlFor="r3">A{")"} Choice A</Label>
                </div>
              </RadioGroup>{" "}
            </div>
          </Link>
          <Link href="/sign-up">
            <div className="border border-zinc-500 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:shadow-green-500/50 duration-300">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-500 mb-4">
                  Personal Calendar
                </h3>
                <p>
                  Stay organized with a built-in calendar that keeps your
                  reminders and deadlines together.
                </p>
              </div>
              <Calendar
                mode="single"
                className="rounded-md border flex justify-center"
              />
            </div>
          </Link>
        </div>
      </section>{" "} */}
    </div>
  );
}
{
  /* <Head>
        <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=G-15T6ZRT6DS`}
        />
        <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-15T6ZRT6DS', {
                page_path: window.location.pathname,
              });
            `,
            }}
          />    
      </Head> */
}
{
  /* <ResizablePanelGroup
          direction="horizontal"
          className="w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={50}>
            <div className="flex flex-col h-full items-center justify-center p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-4">
                Personal Calendar
              </h3>
              <Calendar
                mode="single"
                className="rounded-md w-full flex justify-center"
              />

              <p>
                Stay organized with a built-in calendar that keeps your
                reminders and deadlines together.
              </p>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={25}>
                <div className="flex h-full items-center justify-center p-6">
                  <RadioGroup defaultValue="comfortable">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="r1" />
                      <Label htmlFor="r1">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="comfortable" id="r2" />
                      <Label htmlFor="r2">Comfortable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compact" id="r3" />
                      <Label htmlFor="r3">Compact</Label>
                    </div>
                  </RadioGroup>{" "}
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={75}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="font-semibold">Three</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup> */
}
