"use server";

import { signIn, signOut } from "@/auth";
import { RegisterFormValues } from "@/types/form.values";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const nextSignIn = async (credentials: {
  username: string;
  password: string;
}) => {
  console.log("the credentials is", credentials);
  await signIn("credentials", credentials);
};

export const register = async (values: RegisterFormValues) => {
  console.log("the values received are", values);
  const registerRawData = await fetch(
    `${process.env.BACKEND_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify({
        username: values.username,
        password: values.confirmPassword,
        roles: ["doctors", "admin"],
      }),
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    }
  );
  const registeredUserData = await registerRawData.json();
  console.log(registeredUserData);
  return registeredUserData;
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

export const signOutExpress = async () => {
  (await cookies()).delete("session");
  redirect("/login");
};

export const nextSignOut = async () => {
  await signOut({ redirect: true, redirectTo: "/login" });
  redirect("/login");
};
