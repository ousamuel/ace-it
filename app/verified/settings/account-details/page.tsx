"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
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
import { toast } from "sonner";
import { signInAction, updateAccountAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function AccountDetails() {
  const [updatingAccount, setUpdatingAccount] = useState<boolean>(false);
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  useEffect(() => {
    const getUserData = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return redirect("/sign-in");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_uid", user.id)
        .single();

      if (error) {
        console.warn(error);
      } else {
        setUserData(data);
        setFormData({
          firstName: data["first_name"],
          lastName: data["last_name"],
          email: data["email"],
        });
      }
    };
    getUserData();
  }, []);

  const handleFormValueChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUpdatingAccount(true); // Disable button while updating
    const formDataObject = new FormData();
    formDataObject.append("firstName", formData.firstName);
    formDataObject.append("lastName", formData.lastName);
    formDataObject.append("email", formData.email);

    const response = await updateAccountAction(formDataObject);
    if (response?.success) {
      toast(response.success); // Set success state
    } else {
      toast(response?.error);
    }
    setUpdatingAccount(false); // Re-enable button
  };
  const handleDeleteAccount = async () => {
    setDeletingAccount(true); // Disable button while updating
    const supabase = createClient();
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_uid", userData.user_uid);
    if (error) {
      toast("Error deleting account");
    } else {
      return redirect("/sign-up");
    }
    setDeletingAccount(false); // Disable button while updating
  };
  return (
    <ContentLayout title="Account Details">
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
            <BreadcrumbPage>Account Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="flex-1 flex flex-col gap-2 overflow-y-scroll my-4">
        <div className="py-4 px-1">
          <h1>
            Manage your Ace<span className="brand-green">IT</span> Profile
          </h1>
        </div>
        <Separator />
        <form
          className="flex flex-col w-full p-4 gap-3 [&>input]:mb-4"
          onSubmit={handleSubmit}
        >
          <section className="flex gap-2">
            <div className="flex flex-col flex-1 gap-2">
              <Label htmlFor="firstName" className="p-2">
                First Name
              </Label>
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleFormValueChange}
              />
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <Label htmlFor="lastName" className="p-2">
                Last Name
              </Label>
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleFormValueChange}
              />
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <Label htmlFor="email" className="p-2">
              Email Address
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleFormValueChange}
              required
            />
          </section>
          <section className="flex justify-between">
            <div></div>
            <Button
              disabled={updatingAccount}
              className="my-2"
              // formAction={updateAccountAction}
            >
              {updatingAccount ? "Saving" : "Save"}
            </Button>
          </section>
          <Separator className="my-5" />
        </form>
        {/* <section className="flex p-4">
          <Dialog>
            <DialogTrigger className="text-red-500 bg-accent rounded-lg px-5 py-3">
              {" "}
              Delete Account
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleDeleteAccount} className='bg-red-500 hover:bg-red-600'>Yes I'm sure</Button>
            </DialogContent>
          </Dialog>
        </section> */}
      </main>{" "}
    </ContentLayout>
  );
}

{
  /* <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
  <InfoIcon size="16" strokeWidth={2} />
  Coming soon!
</div> */
}
