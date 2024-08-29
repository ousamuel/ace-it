import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Head from "next/head";
import GoogleAnalytics from "@/components/analytics";

export default async function Index() {
  return (
    <>
      <Head>
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
      </Head>
      <Hero />
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      <div className="flex flex-col gap-5 justify-center items-center pt-0">
        <p className="text-4xl">Features</p>
        <div className="max-w-7xl mx-auto p-4 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1: Thinking AI Flashcard */}
          <div className="border border-zinc-500 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:shadow-green-500/50 duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-4">AI Flashcards</h3>
              <p>
                Enhance your learning with AI-powered flashcards that adapt to your study needs and help reinforce key concepts.
              </p>
            </div>
          </div>

          {/* Card 2: Practice Exam & Calendar */}
          <div className="border border-zinc-500 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:shadow-green-500/50 duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-4">Practice Exam & Calendar</h3>
              <p>
                Prepare for exams with practice tests and stay organized with a built-in calendar that tracks assignments and exam dates.
              </p>
            </div>
          </div>

          {/* Card 3: Chatbot Convos Quizzing & Clarifications */}
          <div className="border border-zinc-500 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-110 hover:shadow-green-500/50 duration-300">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-green-500 mb-4">Chatbot Convos & Quizzing</h3>
              <p>
                Interact with the chatbot for quick quizzes and get clarifications on tricky topics, making learning more interactive and fun.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
