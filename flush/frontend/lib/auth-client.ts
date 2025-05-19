import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { jwt } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000/auth/api/auth",
  basePath: "/",
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => {
          return {
            id: user.id,
            email: user.email,
            groups: user.roles,
          };
        },
      },
      jwks: {
        keyPairConfig: {
          alg: "ES256",
        },
      },
    }),
  ],
  // plugins: [adminClient()],
});
