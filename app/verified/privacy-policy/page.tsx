const PrivacyBody = () => {
  return (
    <div className="p-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Privacy Policy Disclaimer
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        At AceIT, your privacy is of the utmost importance to us. This privacy
        policy outlines how we collect, use, and protect your personal
        information when using our services.
      </p>
      <Separator />

      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Information We Collect
      </h2>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          First and Last Name: Provided by users optionally in their account
          details.
        </li>
        <li>
          Email Address: Used for account authentication, communication, and to
          enhance your experience with our services.
        </li>
        <li>
          User-Provided Data: Any additional information or data you provide
          while using our services, including notes, flashcards, mock exams, and
          study preferences.
        </li>
      </ul>
      <Separator />
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
      <Separator />
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Data Security
      </h2>
      <p>
        We prioritize the security of your personal information and implement
        industry-standard measures to protect your data. However, while we take
        steps to safeguard your information, please note that no method of
        transmission over the Internet is 100% secure.
        <br />
        <br />
        By using AceIT, you consent to the collection and use of your data as
        outlined in this policy. If you have any concerns or questions about how
        we handle your data, please feel free to contact us.
      </p>
    </div>
  );
};

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

export default async function PrivacyPolicy() {
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
            <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PrivacyBody />
    </ContentLayout>
  );
}
