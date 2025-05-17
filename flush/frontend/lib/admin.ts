import { authClient } from "./auth-client";

const newUser = await authClient.admin.createUser({
  name: "Test user",
  email: "c.akilesh95@gmail.com",
  password: "1234567890",
  role: ["admin", "user"],
});
