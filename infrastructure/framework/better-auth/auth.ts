import { client } from "@/infrastructure/persistence/prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  appName: "office-bot",
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/documents.readonly",
      ],
    },
  },
});
