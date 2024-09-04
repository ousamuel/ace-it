import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import HeaderAuth from "@/components/header-auth";
export default function PrivacyBody() {
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
          <HeaderAuth />
        </div>
      </nav>
      <div className="p-20">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Privacy Policy Disclaimer
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          At AceIT, your privacy is of the utmost importance to us. This privacy
          policy outlines how we collect, use, and protect your personal
          information when using our services.
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Information We Collect
        </h2>
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            First and Last Name: Provided by users optionally in their account
            details.
          </li>
          <li>
            Email Address: Used for account authentication, communication, and
            to enhance your experience with our services.
          </li>
          <li>
            User-Provided Data: Any additional information or data you provide
            while using our services, including notes, flashcards, mock exams,
            and study preferences.
          </li>
        </ul>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          How We Use Your Information
        </h2>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>Personalizing study materials and recommendations.</li>
          <li>Providing you with access to your saved content.</li>
          <li>
            Delivering updates, features, or support related to your account and
            services.
          </li>
        </ul>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Data Security
        </h2>
        <p>
          We prioritize the security of your personal information and implement
          industry-standard measures to protect your data. However, while we
          take steps to safeguard your information, please note that no method
          of transmission over the Internet is 100% secure.
          <br />
          <br />
          By using AceIT, you consent to the collection and use of your data as
          outlined in this policy. If you have any concerns or questions about
          how we handle your data, please feel free to contact us at aceit.customercare@gmail.com
        </p>
      </div>
    </div>
  );
}
