import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    console.warn("checkUser: No currentUser found from Clerk");
    return null;
  }

  console.log("checkUser: Found Clerk user", user.id);

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Check if user exists by email if not found by clerkUserId (e.g. if account was recreated in Clerk)
    const userByEmail = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (userByEmail) {
      // Update existing user with new clerkUserId to re-sync the account
      const updatedUser = await db.user.update({
        where: { id: userByEmail.id },
        data: { clerkUserId: user.id },
      });
      return updatedUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error("checkUser error:", error.message);
    throw new Error(`Authentication sync failed: ${error.message}`);
  }
};
