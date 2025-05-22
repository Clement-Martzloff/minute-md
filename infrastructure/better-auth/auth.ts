import { PrismaClient } from "@/infrastructure/prisma/generated/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
// import { OAuth2Client } from "google-auth-library";
// import { google } from "googleapis";

const client = new PrismaClient();

export const auth = betterAuth({
  appName: "office-bot",
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  plugins: [nextCookies()],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        "https://www.googleapis.com/auth/drive.metadata.readonly",
        "https://www.googleapis.com/auth/drive.file",
      ],
    },
  },
});

// const oauth2Client = new OAuth2Client(
//   "VOTRE_CLIENT_ID",
//   "VOTRE_CLIENT_SECRET",
//   "http://localhost:3000/callback"
// );

// const token = await auth.api.getAccessToken({ body: { providerId: "google" } });
// const refreshToken = await auth.api.oauth2Client.setCredentials({
//   access_token: token.accessToken,
//   expiry_date: token.accessTokenExpiresAt,
// });

// const drive = google.drive({ version: "v3", auth: oauth2Client });
