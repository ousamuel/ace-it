// actions.ts
"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const addFlashcards = async (formData: FormData) => {
  const supabase = createClient();
  const question = formData.get("question")?.toString();
  const answer = formData.get("answer")?.toString();
  const notes = formData.get("notes")?.toString();
  const setName = formData.get("setName")?.toString();
  const number = formData.get("setNumber")?.toString();




  if (!notes) {
    return { error: "Notes are required to generate flashcards" };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be logged in to add flashcards"
    );
  }

  // Call the AI API to generate flashcards
  const origin = headers().get("origin");
  const apiUrl = `${origin}/api/generate`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      notes: notes,
      flashcardNumber: number,
    }),
  });
  
  if (!response.ok) {
    return { error: "Failed to generate flashcards" };
  }

  const flashcards = await response.json();

  // Save flashcards to Supabase
  const { error:flashcardsError } = await supabase.from("flashcards").insert(
    flashcards.map((card: any) => ({
      question: card.front,
      answer: card.back,
      user_uid: user.id,
      set_name: setName
      // setId: setId
    }))
  );

  // Save set to Supabase
  const { error:setError } = await supabase.from("flashcard_set").insert({
      notes,
      set_name: setName,
      user_uid: user.id
      }
  );
  
  
  if (flashcardsError) {
    return encodedRedirect(
      "error",
      "/protected/flashcards/generate",
      flashcardsError.message
    );
  }

  if (setError) {
    return encodedRedirect(
      "error",
      "/verified/flashcards/generate",
      error.message
    );
  }

  return encodedRedirect(
    "success",
    "/verified/flashcards/generate",
    "Flashcards generated and saved successfully!"
  );
};

export const addSuggestionAction = async (formData: FormData) => {
  const suggestion = formData.get("suggestion")?.toString();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/waitlist",
      "You must be logged in to submit a suggestion"
    );
  }
  const { error } = await supabase.from("suggestions").insert([
    {
      suggestion,
      email: user.email,
      user_uid: user.id,
    },
  ]);

  if (error) {
    // console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/waitlist", error.message);
  }

  return encodedRedirect("success", "/waitlist", "Suggestion submitted!");
};
export const addEventAction = async (formData: FormData) => {
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const date = formData.get("date")?.toString();
  const time = formData.get("time")?.toString();
  const type = formData.get("type")?.toString();
  const supabase = createClient();
  // Basic validation
  if (!title || !description || !date || !time || !type) {
    return { error: "All fields are required" };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/login",
      "You must be logged in to add an event"
    );
  }

  const { error } = await supabase.from("events").insert([
    {
      title,
      description,
      date,
      time,
      type,
      user_uid: user.id,
    },
  ]);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/verified/calendar", error.message);
  }

  return encodedRedirect(
    "success",
    "/verified/calendar",
    "Event added successfully"
  );
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }
  if (confirmPassword != password) {
    return encodedRedirect("error", "/sign-up", "Passwords are not matching");
  }
  // added custom password confirmation to ensure no typos

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    // return encodedRedirect(
    //   "success",
    //   "/sign-up",
    //   "Thanks for signing up! Please check your email for a verification link.",
    // );

    // return redirect("/verified");
    // changed this line to redirect b/c no need for verification
    // too hassling to do email verification b/c supabase only allows for 4 every hour
    // if app were to scale large enough + paid service, then I can add custom aws SMTP and renable email verification for safety
    return redirect("/waitlist");
    // change back to /verified once site is actually ready and no more waitlist
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // return redirect("/verified");
  return redirect("/waitlist");
  // change back to /verified once site is actually ready and no more waitlist
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/verified/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/verified/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/verified/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = createClient();
  await supabase.auth.signOut();
  return redirect("/");
};


