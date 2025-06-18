import { betterAuth } from "better-auth";
import { PrismaClient } from "../../prisma/generated/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
const prisma = new PrismaClient();
import "dotenv/config";
import { sendEmail } from "./transporter";
import { signInCallback } from "./callbacks";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail(email, url);
      },
    }),
  ],
  trustedOrigins: ["http://localhost:3000"],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile"],
    },
  },
  callbacks: {
    signIn: signInCallback,
  },
});
