"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// import { login, nextSignIn } from "@/actions/auth.action";
import { LoginFormValues } from "@/types/form.values";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/types/form.schema";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  //Next-auth implementation
  // const { data: session } = useSession();
  // useEffect(() => {
  //   if (session) {
  //     router.push("/dashboard");
  //   }
  // }, [session, router]);

  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      form.clearErrors();
      setLoading(true);
      console.log("the values is", values);
      form.clearErrors();

      //Better-auth implementation
      const { data, error } = await authClient.signIn.email(
        {
          email: values.username,
          password: values.password,
          callbackURL: "/dashboard",
        },
        {
          onError: (error) => {
            console.error("Error signing in", error);
            toast.error(error.error.message);
          },
          onSuccess: () => {
            router.push("/dashboard");
          },
        }
      );

      //Next-auth implementation
      // await nextSignIn({
      //   username: values.username,
      //   password: values.password,
      // });
      // const regiter = await register(values);
      // router.push("/login");
    } catch (error: any) {
      setLoading(false);
      console.error("Form submission error", error);
      if (error.message === "Password don't match") {
        form.setError("confirmPassword", {
          message: "Passwords don't match",
        });
        form.setError("password", { message: "Password don't match" });
        toast.error(error.message);
        return;
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="email">Username</FormLabel>
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
                        <div className="flex items-center">
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                          >
                            Forgot your password?
                          </Link>
                        </div>
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
                <Button type="submit" className="w-full z-99999">
                  {loading ? "Loading..." : "Login"}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={async () => {
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: "/dashboard",
                      errorCallbackURL: "/error",
                    });
                  }}
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
