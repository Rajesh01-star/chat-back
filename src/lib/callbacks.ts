import { PrismaClient } from "../../prisma/generated/prisma";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();
export const signInCallback = async ({
  user,
  account,
}: {
  user: any;
  account: any;
}) => {
  if (account?.providerId === "google") {
    // Check if user exists, create if not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existingUser) {
      try {
        await prisma.user.create({
          data: {
            id: uuidv4(),
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log("New user created:", user.email);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }
  return true;
};
