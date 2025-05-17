import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { jwt, admin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    admin(),
    jwt({
      jwt: {
        definePayload: ({ user }) => {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      },
    }),
  ],
});
