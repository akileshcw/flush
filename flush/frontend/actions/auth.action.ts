"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const register = async (values: any) => {
  return values;
};

export const login = async (formData: FormData) => {
  const username = formData.get("username");
  const password = formData.get("password");
  const cookieStore = await cookies();
  const data = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    body: JSON.stringify({ username: username, password: password }),
    redirect: "follow",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { token } = await data.json();
  console.log("token is", token);
  if (token) {
    cookieStore.set("session", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }
  redirect("/dashboard");
};

export const signOut = async () => {
  (await cookies()).delete("session");
  redirect("/login");
};
