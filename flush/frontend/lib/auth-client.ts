import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000/auth",
  basePath: "/",
  plugins: [adminClient()],
});
