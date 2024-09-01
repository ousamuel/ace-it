import DeployButton from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import GoogleAnalytics from "@/components/analytics";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AceIt",
  description: "The fastest way to study",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
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
      <body className="bg-background text-foreground">
        <Analytics />
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            {/* <div className="flex-1 w-full flex flex-col gap-5 items-center"> */}
            <div className="flex justify-center w-full grow px-4 lg:px-8">
              {children}
            </div>
            {/* </div> */}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
