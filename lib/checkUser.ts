// lib/checkUser.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "../configs/db";
import { users } from "../configs/schema";
import { eq } from "drizzle-orm";

// Define the profile type as a union of specific literals
type ProfileType = "employer" | "worker" | "pending" | null;

interface UserData {
  id: number;
  clerkUserId: string;
  name: string;
  image: string | null;
  profileType: ProfileType;
  needsProfileCompletion: boolean;
}

export const checkUser = async (): Promise<UserData | null> => {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db
      .select({
        id: users.id,
        clerkUserId: users.clerkUserId,
        name: users.name,
        image: users.image,
        profileType: users.profileType,
      })
      .from(users)
      .where(eq(users.clerkUserId, user.id))
      .then((res) => res[0]);

    if (loggedInUser) {
      return {
        ...loggedInUser,
        needsProfileCompletion: loggedInUser.profileType === "pending",
        profileType: loggedInUser.profileType as ProfileType, // Ensure profileType is correctly typed
      };
    }

    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed User";
    const newUser = await db
      .insert(users)
      .values({
        clerkUserId: user.id,
        name,
        image: user.imageUrl,
        profileType: "pending",
      })
      .returning({
        id: users.id,
        clerkUserId: users.clerkUserId,
        name: users.name,
        image: users.image,
        profileType: users.profileType,
      })
      .then((res) => res[0]);

    return {
      ...newUser,
      needsProfileCompletion: true,
      profileType: newUser.profileType as ProfileType,
    };
  } catch (error) {
    console.error("Error in checkUser:", error);
    throw error;
  }
};
