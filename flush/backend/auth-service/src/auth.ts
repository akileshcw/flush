import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { TypeOrmAdapter } from "./config/typeOrmAdapter";

export const auth = betterAuth({
  database: TypeOrmAdapter({}),
  basePath: "/",
  user: {
    additionalFields: {
      roles: {
        type: "string[]",
        required: true,
        defaultValue: "user",
        input: true,
      },
      phoneNumber: {
        type: "string",
        required: true,
        defaultValue: "9876543210",
        input: true,
      },
      username: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: "auth-service",
        definePayload: async ({ user }) => {
          return {
            id: user.id,
            email: user.email,
            groups: user.roles, // Map roles to groups for Kong
          };
        },
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    disabled: false,
    level: "debug",
    log: () => console.log("Debbugger"),
  },
  trustedOrigins: ["localhost:3000"],
});
