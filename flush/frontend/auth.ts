import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";

//Next-Auth Implementation Imports
// import Google from "next-auth/providers/google";
// import Credential from "next-auth/providers/credentials";
// import NextAuth from "next-auth";
// import { redirect } from "next/navigation";

//Better-Auth Implementation
export const auth = betterAuth({
  baseURL: "http://localhost:8000/auth/api/auth",
  secret: process.env.NEXTAUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  user: {
    additionalFields: {
      roles: {
        type: "string[]",
        required: true,
        defaultValue: ["user"],
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
        definePayload: async ({ user }: any) => {
          return {
            id: user.id,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roles: user.roles,
          };
        },
      },
    }),
  ],
});
//Next-Auth Implementation
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   pages: {
//     signIn: "/login",
//     signOut: "/logout",
//     error: "/error",
//     verifyRequest: "/verify-request",
//     newUser: "/onboarind", // Will disable the new account creation screen
//   },
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     Credential({
//       name: "Email",
//       credentials: {
//         username: { label: "Username", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials, req) {
//         console.log("the credentials in authorize is", credentials);
//         const res = await fetch("http://localhost:8000/auth/login", {
//           method: "POST",
//           body: JSON.stringify({
//             username: credentials?.username,
//             password: credentials?.password,
//             roles: ["doctors", "admin"],
//           }),
//           headers: { "Content-Type": "application/json" },
//         });
//         const user = await res.json();
//         console.log("the user in authorize is", user);
//         return user.user;
//       },
//     }),
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//       async profile(profile) {
//         return profile;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       console.log("the user in callback is", user);
//       if (user) {
//         token.id = user.id;
//         token.roles = user.roles;
//         token.username = user.username;
//         token.lastReferesh = Date.now();
//       }
//       const refreshThreshold = 2 * 24 * 60 * 60 * 1000; // 24 hours in seconds
//       if (Date.now() - (Number(token.lastReferesh) || 0) > refreshThreshold) {
//         token.lastReferesh = Date.now();
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id,
//         roles: token.roles,
//         name: token.username,
//       };
//       console.log("the session is", session);
//       return session;
//     },
//   },
// });
