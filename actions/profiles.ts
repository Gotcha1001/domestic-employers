"use server";

import { db } from "@/configs/db";
import { auth } from "@clerk/nextjs/server";
import { users, employers, workers } from "@/configs/schema";
import { eq, or, ilike, sql } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

interface Room {
  type: string;
  instructions: string;
  position?: { x: number; y: number; width: number; height: number };
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CreateProfileInput {
  name: string;
  location: string;
  profileType: "employer" | "worker";
  image?: string;
  strengths?: string;
  availability?: string;
  rooms?: Room[];
}

// Remove unused User type since it's never used
export type Employer = InferSelectModel<typeof employers> & {
  clerkUserId: string;
};
export type Worker = InferSelectModel<typeof workers> & { clerkUserId: string };

function parseCoordinates(coordinates: unknown): Coordinates | null {
  console.log("Parsing coordinates:", JSON.stringify(coordinates, null, 2));
  if (!coordinates || typeof coordinates !== "object") {
    console.error("Invalid coordinates:", coordinates);
    return null;
  }
  const coords = coordinates as { lat?: number; lng?: number };
  if (
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng)
  ) {
    return { lat: coords.lat, lng: coords.lng };
  }
  console.error("Coordinates missing or invalid:", coords);
  return null;
}

function isValidPosition(position: unknown): position is Position {
  if (!position || typeof position !== "object") {
    console.log("Position validation:", { position, valid: false });
    return false;
  }

  const pos = position as Record<string, unknown>;
  const valid =
    typeof pos.x === "number" &&
    typeof pos.y === "number" &&
    typeof pos.width === "number" &&
    typeof pos.height === "number" &&
    !isNaN(pos.x) &&
    !isNaN(pos.y) &&
    !isNaN(pos.width) &&
    !isNaN(pos.height);

  console.log("Position validation:", { position, valid });
  return valid;
}

export async function createUserProfile(
  input: CreateProfileInput
): Promise<Employer | Worker> {
  // Force serialization to ensure plain objects
  const serializedInput = JSON.parse(JSON.stringify(input));
  console.log(
    "Received input in createUserProfile:",
    JSON.stringify(serializedInput, null, 2)
  );

  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("User is not authenticated");

  const { name, location, profileType, image, strengths, availability, rooms } =
    serializedInput;

  if (
    !name?.trim() ||
    !location?.trim() ||
    !["employer", "worker"].includes(profileType)
  ) {
    throw new Error(
      "Invalid or missing required fields: name, location, or profileType"
    );
  }

  console.log("Validating image:", { image, type: typeof image });
  if (image && typeof image !== "string") {
    throw new Error("Image must be a string URL or undefined");
  }
  if (image && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/.test(image)) {
    throw new Error("Invalid image URL");
  }

  let address: string;
  let coordinates: Coordinates | null;
  try {
    const locationData = JSON.parse(location);
    console.log("Parsed location data:", JSON.stringify(locationData, null, 2));
    address = locationData.address?.trim();
    coordinates = parseCoordinates(locationData.coordinates);
    if (!address || !coordinates)
      throw new Error("Address and valid coordinates are required");
  } catch (error) {
    console.error("Location parsing error:", error);
    throw new Error(
      "Invalid location format: must include address and valid coordinates"
    );
  }

  if (profileType === "employer" && rooms && rooms.length > 0) {
    console.log("Validating rooms:", JSON.stringify(rooms, null, 2));
    if (
      !rooms.every(
        (room: Room) => room.type && typeof room.instructions === "string"
      )
    ) {
      throw new Error("All rooms must have a type and instructions");
    }
    if (
      rooms.some(
        (room: Room) => room.position && !isValidPosition(room.position)
      )
    ) {
      throw new Error("Invalid position data in rooms");
    }
  }

  const user = await db
    .insert(users)
    .values({
      clerkUserId,
      profileType,
      name: name.trim(),
      image: image || null,
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { profileType, name: name.trim(), image: image || null },
    })
    .returning();

  if (profileType === "employer") {
    if (
      rooms &&
      rooms.length > 0 &&
      !rooms.some((room: Room) => room.instructions.trim())
    ) {
      throw new Error("At least one room must have instructions");
    }

    const employer = await db
      .insert(employers)
      .values({
        userId: user[0].id,
        name: name.trim(),
        image: image || null,
        address,
        coordinates: {
          lat: Number(coordinates.lat),
          lng: Number(coordinates.lng),
        },
        rooms: rooms || null,
      })
      .onConflictDoUpdate({
        target: employers.userId,
        set: {
          name: name.trim(),
          image: image || null,
          address,
          coordinates: {
            lat: Number(coordinates.lat),
            lng: Number(coordinates.lng),
          },
          rooms: rooms || null,
        },
      })
      .returning();

    return { ...employer[0], clerkUserId };
  } else {
    const worker = await db
      .insert(workers)
      .values({
        userId: user[0].id,
        name: name.trim(),
        image: image || null,
        address,
        coordinates: {
          lat: Number(coordinates.lat),
          lng: Number(coordinates.lng),
        },
        strengths: strengths?.trim() || null,
        availability: availability?.trim() || null,
      })
      .onConflictDoUpdate({
        target: workers.userId,
        set: {
          name: name.trim(),
          image: image || null,
          address,
          coordinates: {
            lat: Number(coordinates.lat),
            lng: Number(coordinates.lng),
          },
          strengths: strengths?.trim() || null,
          availability: availability?.trim() || null,
        },
      })
      .returning();

    return { ...worker[0], clerkUserId };
  }
}

export async function getEmployerByClerkId(
  clerkUserId: string
): Promise<Employer | null> {
  const result = await db
    .select({
      id: employers.id,
      userId: employers.userId,
      name: employers.name,
      image: employers.image,
      address: employers.address,
      coordinates: employers.coordinates,
      rooms: employers.rooms,
      createdAt: employers.createdAt,
      clerkUserId: users.clerkUserId,
    })
    .from(employers)
    .innerJoin(users, eq(users.id, employers.userId))
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getWorkerByClerkId(
  clerkUserId: string
): Promise<Worker | null> {
  const result = await db
    .select({
      id: workers.id,
      userId: workers.userId,
      name: workers.name,
      image: workers.image,
      address: workers.address,
      coordinates: workers.coordinates,
      strengths: workers.strengths,
      availability: workers.availability,
      createdAt: workers.createdAt,
      clerkUserId: users.clerkUserId,
    })
    .from(workers)
    .innerJoin(users, eq(users.id, workers.userId))
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllEmployers(
  searchQuery: string = "",
  page: number = 1,
  pageSize: number = 9
): Promise<{ profiles: Employer[]; totalPages: number; currentPage: number }> {
  const offset = (page - 1) * pageSize;
  const whereClause = searchQuery
    ? or(
        ilike(employers.name, `%${searchQuery}%`),
        ilike(employers.address, `%${searchQuery}%`)
      )
    : undefined;

  const [profiles, countResult] = await Promise.all([
    db
      .select({
        id: employers.id,
        userId: employers.userId,
        name: employers.name,
        image: employers.image,
        address: employers.address,
        coordinates: employers.coordinates,
        rooms: employers.rooms,
        createdAt: employers.createdAt,
        clerkUserId: users.clerkUserId,
      })
      .from(employers)
      .innerJoin(users, eq(users.id, employers.userId))
      .where(whereClause)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(employers)
      .where(whereClause),
  ]);

  const totalRecords = countResult[0]?.count || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    profiles,
    totalPages: totalPages > 0 ? totalPages : 1,
    currentPage: page,
  };
}

export async function getAllWorkers(
  searchQuery: string = "",
  page: number = 1,
  pageSize: number = 9
): Promise<{ profiles: Worker[]; totalPages: number; currentPage: number }> {
  const offset = (page - 1) * pageSize;
  const whereClause = searchQuery
    ? or(
        ilike(workers.name, `%${searchQuery}%`),
        ilike(workers.address, `%${searchQuery}%`),
        ilike(workers.strengths, `%${searchQuery}%`)
      )
    : undefined;

  const [profiles, countResult] = await Promise.all([
    db
      .select({
        id: workers.id,
        userId: workers.userId,
        name: workers.name,
        image: workers.image,
        address: workers.address,
        coordinates: workers.coordinates,
        strengths: workers.strengths,
        availability: workers.availability,
        createdAt: workers.createdAt,
        clerkUserId: users.clerkUserId,
      })
      .from(workers)
      .innerJoin(users, eq(users.id, workers.userId))
      .where(whereClause)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(workers)
      .where(whereClause),
  ]);

  const totalRecords = countResult[0]?.count || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    profiles,
    totalPages: totalPages > 0 ? totalPages : 1,
    currentPage: page,
  };
}
