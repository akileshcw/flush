"use client";
import type React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { RegisterFormValues } from "@/types/form.values";
import { registerFormSchema } from "@/types/form.schema";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

//Better-auth Implementation imports
import { authClient } from "@/lib/auth-client";
import { phoneNumber } from "better-auth/plugins";

//Next-auth Implementation imports
// import { signIn } from "@/auth";
// import { nextSignIn, register } from "@/actions/auth.action";
// import { useSession } from "next-auth/react";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  //Next-auth implementation
  // const { data: session } = useSession();
  // useEffect(() => {
  //   if (session) {
  //     router.push("/dashboard");
  //   }
  // }, [session, router]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      form.clearErrors();
      if (values.confirmPassword !== values.password)
        throw new Error("Password don't match");

      //Better-auth implementation
      const { data, error } = await authClient.signUp.email(
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        {
          onError: (error) => {
            setLoading(false);
            console.error("Error signing up", error);
            throw new Error(error.error.message);
          },
          onSuccess: (data) => {
            setLoading(false);
            console.log("User signed up successfully", data);
            toast.success("User registered successfully");
            router.push("/dashboard");
          },
          onRequest: (ctx) => {
            console.log("Request to sign up", ctx);
            setLoading(true);
          },
          body: {
            roles: ["user"],
            phoneNumber: values.phoneNumber,
          },
        }
      );
      //Next-auth implementation
      // await nextSignIn({
      //   username: values.username,
      //   password: values.password,
      // });

      // router.push("/login");
    } catch (error: any) {
      console.error("Form submission error", error);
      if (error.message === "Password don't match") {
        form.setError("confirmPassword", {
          message: "Passwords don't match",
        });
        form.setError("password", { message: "Password don't match" });
        toast.error("Failed to submit the form. Please try again.");
        return;
      }
      toast.error(error.message);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Flush</span>
              </Link>
              <h1 className="text-xl font-bold">Create your account</h1>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Email</FormLabel>
                      <Input
                        type="text"
                        placeholder="a@example.com"
                        required
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                      <PhoneInput
                        placeholder="Enter Your Mobile Number"
                        required
                        className="p-2"
                        defaultCountry="IN"
                        countryOptionsOrder={["IN", "US"]}
                        countries={["US", "IN"]}
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input
                        type="text"
                        placeholder="johnDoe"
                        required
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        {...field}
                        onBlur={(e) => {
                          form.clearErrors("confirmPassword");
                          const value = e.target.value;
                          if (value !== form.getValues("password"))
                            form.setError("confirmPassword", {
                              message: "Passwords don't match",
                            });
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Loading..." : "Sign Up"}
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  await authClient.signIn.social({ provider: "apple" });
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    fill="currentColor"
                  />
                </svg>
                Continue with Apple
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () =>
                  await authClient.signIn.social({ provider: "google" })
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking sign up, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
