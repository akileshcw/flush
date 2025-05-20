import { betterAuth } from "better-auth";
import { createAuthMiddleware, jwt } from "better-auth/plugins";
import { Channel } from "amqplib";
import { Pool } from "pg";

const auth = (channel: Channel) => {
  return betterAuth({
    database: new Pool({
      host: "auth-db",
      port: 5432,
      user: "auth_user",
      password: "auth_pass",
      database: "auth_db",
    }),
    emailAndPassword: {
      enabled: true,
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
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        console.log("after hook triggered");
        if (
          ctx.path.startsWith("/sign-in") &&
          ctx.path.startsWith("/sign-up")
        ) {
          ctx.context.session = ctx.context.newSession;
          return ctx;
        }
        if (ctx.path.startsWith("/sign-up")) {
          const newSession = ctx.context.newSession;
          if (newSession) {
            channel.publish(
              "auth.events.fanout",
              "",
              Buffer.from(
                JSON.stringify({
                  event: "user.registered",
                  data: newSession.user,
                })
              )
            );
          }
        }
      }),
    },
    plugins: [
      jwt({
        jwt: {
          issuer: "auth-service",
          definePayload: async ({ user }) => {
            return {
              id: user.id,
              email: user.email,
              phoneNumber: user.phoneNumber,
              groups: user.roles,
            };
          },
        },
      }),
    ],
    trustedOrigins: ["http://localhost:3000"],
  });
};

export default auth;
