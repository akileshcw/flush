"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (formData: FormData) => {
  try {
    const username = formData.get("username");
    const password = formData.get("password");
    console.log("the username and password is", username, password);
    const cookieStore = await cookies();
    cookieStore.set("session", "adabdfafjd;jfda;", {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    console.log("cookie session is", cookieStore.get("session"));
  } catch (error) {
  } finally {
    redirect("/dashboard");
  }
};
