// // actions/profiles.ts
// "use server";

// import { db } from "@/configs/db";
// import { auth } from "@clerk/nextjs/server";
// import { users, employers, workers } from "@/configs/schema";
// import { eq, or, ilike, sql } from "drizzle-orm";
// import { InferSelectModel } from "drizzle-orm";

// interface Room {
//   type: string;
//   instructions: string;
//   position?: { x: number; y: number; width: number; height: number };
// }

// interface Coordinates {
//   lat: number;
//   lng: number;
// }

// interface Position {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// interface Reference {
//   name: string;
//   contact: string;
//   testimonial: string;
// }

// interface CreateProfileInput {
//   name: string;
//   location: string;
//   profileType: "employer" | "worker";
//   image?: string;
//   strengths?: string;
//   availability?: string;
//   rooms?: Room[];
//   contactNumber?: string; // New field
//   email?: string; // New field
//   experienceLevel?: "Beginner" | "Intermediate" | "Expert"; // New field
//   preferredWorkTypes?: string[]; // New field
//   references?: Reference[]; // New field
// }

// export type Employer = InferSelectModel<typeof employers> & {
//   clerkUserId: string;
// };

// export type Worker = InferSelectModel<typeof workers> & { clerkUserId: string };

// function parseCoordinates(coordinates: unknown): Coordinates | null {
//   console.log("Parsing coordinates:", JSON.stringify(coordinates, null, 2));
//   if (!coordinates || typeof coordinates !== "object") {
//     console.error("Invalid coordinates:", coordinates);
//     return null;
//   }
//   const coords = coordinates as { lat?: number; lng?: number };
//   if (
//     typeof coords.lat === "number" &&
//     typeof coords.lng === "number" &&
//     !isNaN(coords.lat) &&
//     !isNaN(coords.lng)
//   ) {
//     return { lat: coords.lat, lng: coords.lng };
//   }
//   console.error("Coordinates missing or invalid:", coords);
//   return null;
// }

// function isValidPosition(position: unknown): position is Position {
//   if (!position || typeof position !== "object") {
//     console.log("Position validation:", { position, valid: false });
//     return false;
//   }
//   const pos = position as Record<string, unknown>;
//   const valid =
//     typeof pos.x === "number" &&
//     typeof pos.y === "number" &&
//     typeof pos.width === "number" &&
//     typeof pos.height === "number" &&
//     !isNaN(pos.x) &&
//     !isNaN(pos.y) &&
//     !isNaN(pos.width) &&
//     !isNaN(pos.height);
//   console.log("Position validation:", { position, valid });
//   return valid;
// }

// function isValidReference(reference: unknown): reference is Reference {
//   if (!reference || typeof reference !== "object") return false;
//   const ref = reference as Record<string, unknown>;
//   return (
//     typeof ref.name === "string" &&
//     typeof ref.contact === "string" &&
//     typeof ref.testimonial === "string"
//   );
// }

// export async function createUserProfile(
//   input: CreateProfileInput
// ): Promise<Employer | Worker> {
//   const serializedInput = JSON.parse(JSON.stringify(input));
//   console.log(
//     "Received input in createUserProfile:",
//     JSON.stringify(serializedInput, null, 2)
//   );

//   const { userId: clerkUserId } = await auth();
//   if (!clerkUserId) throw new Error("User is not authenticated");

//   const {
//     name,
//     location,
//     profileType,
//     image,
//     strengths,
//     availability,
//     rooms,
//     contactNumber,
//     email,
//     experienceLevel,
//     preferredWorkTypes,
//     references,
//   } = serializedInput;

//   if (
//     !name?.trim() ||
//     !location?.trim() ||
//     !["employer", "worker"].includes(profileType)
//   ) {
//     throw new Error(
//       "Invalid or missing required fields: name, location, or profileType"
//     );
//   }

//   if (image && typeof image !== "string") {
//     throw new Error("Image must be a string URL or undefined");
//   }

//   if (image && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/.test(image)) {
//     throw new Error("Invalid image URL");
//   }

//   if (contactNumber && !/^\+?\d{7,15}$/.test(contactNumber)) {
//     throw new Error("Invalid contact number format");
//   }

//   if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     throw new Error("Invalid email format");
//   }

//   if (
//     experienceLevel &&
//     !["Beginner", "Intermediate", "Expert"].includes(experienceLevel)
//   ) {
//     throw new Error("Invalid experience level");
//   }

//   if (
//     preferredWorkTypes &&
//     (!Array.isArray(preferredWorkTypes) ||
//       !preferredWorkTypes.every((type) => typeof type === "string"))
//   ) {
//     throw new Error("Preferred work types must be an array of strings");
//   }

//   if (
//     references &&
//     (!Array.isArray(references) || !references.every(isValidReference))
//   ) {
//     throw new Error("References must be an array of valid reference objects");
//   }

//   let address: string;
//   let coordinates: Coordinates | null;
//   try {
//     const locationData = JSON.parse(location);
//     console.log("Parsed location data:", JSON.stringify(locationData, null, 2));
//     address = locationData.address?.trim();
//     coordinates = parseCoordinates(locationData.coordinates);
//     if (!address || !coordinates)
//       throw new Error("Address and valid coordinates are required");
//   } catch (error) {
//     console.error("Location parsing error:", error);
//     throw new Error(
//       "Invalid location format: must include address and valid coordinates"
//     );
//   }

//   if (profileType === "employer" && rooms && rooms.length > 0) {
//     console.log("Validating rooms:", JSON.stringify(rooms, null, 2));
//     if (
//       !rooms.every(
//         (room: Room) => room.type && typeof room.instructions === "string"
//       )
//     ) {
//       throw new Error("All rooms must have a type and instructions");
//     }
//     if (
//       rooms.some(
//         (room: Room) => room.position && !isValidPosition(room.position)
//       )
//     ) {
//       throw new Error("Invalid position data in rooms");
//     }
//   }

//   const user = await db
//     .insert(users)
//     .values({
//       clerkUserId,
//       profileType,
//       name: name.trim(),
//       image: image || null,
//     })
//     .onConflictDoUpdate({
//       target: users.clerkUserId,
//       set: { profileType, name: name.trim(), image: image || null },
//     })
//     .returning();

//   if (profileType === "employer") {
//     if (
//       rooms &&
//       rooms.length > 0 &&
//       !rooms.some((room: Room) => room.instructions.trim())
//     ) {
//       throw new Error("At least one room must have instructions");
//     }
//     const employer = await db
//       .insert(employers)
//       .values({
//         userId: user[0].id,
//         name: name.trim(),
//         image: image || null,
//         address,
//         coordinates: {
//           lat: Number(coordinates.lat),
//           lng: Number(coordinates.lng),
//         },
//         rooms: rooms || null,
//       })
//       .onConflictDoUpdate({
//         target: employers.userId,
//         set: {
//           name: name.trim(),
//           image: image || null,
//           address,
//           coordinates: {
//             lat: Number(coordinates.lat),
//             lng: Number(coordinates.lng),
//           },
//           rooms: rooms || null,
//         },
//       })
//       .returning();
//     return { ...employer[0], clerkUserId };
//   } else {
//     const worker = await db
//       .insert(workers)
//       .values({
//         userId: user[0].id,
//         name: name.trim(),
//         image: image || null,
//         address,
//         coordinates: {
//           lat: Number(coordinates.lat),
//           lng: Number(coordinates.lng),
//         },
//         strengths: strengths?.trim() || null,
//         availability: availability?.trim() || null,
//         contactNumber: contactNumber?.trim() || null,
//         email: email?.trim() || null,
//         experienceLevel: experienceLevel || null,
//         preferredWorkTypes: preferredWorkTypes || null,
//         references: references || null,
//       })
//       .onConflictDoUpdate({
//         target: workers.userId,
//         set: {
//           name: name.trim(),
//           image: image || null,
//           address,
//           coordinates: {
//             lat: Number(coordinates.lat),
//             lng: Number(coordinates.lng),
//           },
//           strengths: strengths?.trim() || null,
//           availability: availability?.trim() || null,
//           contactNumber: contactNumber?.trim() || null,
//           email: email?.trim() || null,
//           experienceLevel: experienceLevel || null,
//           preferredWorkTypes: preferredWorkTypes || null,
//           references: references || null,
//         },
//       })
//       .returning();
//     return { ...worker[0], clerkUserId };
//   }
// }

// export async function getEmployerByClerkId(
//   clerkUserId: string
// ): Promise<Employer | null> {
//   const result = await db
//     .select({
//       id: employers.id,
//       userId: employers.userId,
//       name: employers.name,
//       image: employers.image,
//       address: employers.address,
//       coordinates: employers.coordinates,
//       rooms: employers.rooms,
//       createdAt: employers.createdAt,
//       clerkUserId: users.clerkUserId,
//     })
//     .from(employers)
//     .innerJoin(users, eq(users.id, employers.userId))
//     .where(eq(users.clerkUserId, clerkUserId))
//     .limit(1);
//   return result.length > 0 ? result[0] : null;
// }

// export async function getWorkerByClerkId(
//   clerkUserId: string
// ): Promise<Worker | null> {
//   const result = await db
//     .select({
//       id: workers.id,
//       userId: workers.userId,
//       name: workers.name,
//       image: workers.image,
//       address: workers.address,
//       coordinates: workers.coordinates,
//       strengths: workers.strengths,
//       availability: workers.availability,
//       contactNumber: workers.contactNumber,
//       email: workers.email,
//       experienceLevel: workers.experienceLevel,
//       preferredWorkTypes: workers.preferredWorkTypes,
//       references: workers.references,
//       createdAt: workers.createdAt,
//       clerkUserId: users.clerkUserId,
//     })
//     .from(workers)
//     .innerJoin(users, eq(users.id, workers.userId))
//     .where(eq(users.clerkUserId, clerkUserId))
//     .limit(1);
//   return result.length > 0 ? result[0] : null;
// }

// export async function getAllEmployers(
//   searchQuery: string = "",
//   page: number = 1,
//   pageSize: number = 9
// ): Promise<{ profiles: Employer[]; totalPages: number; currentPage: number }> {
//   const offset = (page - 1) * pageSize;
//   const whereClause = searchQuery
//     ? or(
//         ilike(employers.name, `%${searchQuery}%`),
//         ilike(employers.address, `%${searchQuery}%`)
//       )
//     : undefined;

//   const [profiles, countResult] = await Promise.all([
//     db
//       .select({
//         id: employers.id,
//         userId: employers.userId,
//         name: employers.name,
//         image: employers.image,
//         address: employers.address,
//         coordinates: employers.coordinates,
//         rooms: employers.rooms,
//         createdAt: employers.createdAt,
//         clerkUserId: users.clerkUserId,
//       })
//       .from(employers)
//       .innerJoin(users, eq(users.id, employers.userId))
//       .where(whereClause)
//       .limit(pageSize)
//       .offset(offset),
//     db
//       .select({ count: sql<number>`count(*)` })
//       .from(employers)
//       .where(whereClause),
//   ]);

//   const totalRecords = countResult[0]?.count || 0;
//   const totalPages = Math.ceil(totalRecords / pageSize);

//   return {
//     profiles,
//     totalPages: totalPages > 0 ? totalPages : 1,
//     currentPage: page,
//   };
// }

// // actions/profiles.ts (updated getAllWorkers)
// export async function getAllWorkers(
//   searchQuery: string = "",
//   page: number = 1,
//   pageSize: number = 9
// ): Promise<{ profiles: Worker[]; totalPages: number; currentPage: number }> {
//   const offset = (page - 1) * pageSize;

//   const whereClause = searchQuery
//     ? or(
//         ilike(workers.name, `%${searchQuery}%`),
//         ilike(workers.address, `%${searchQuery}%`),
//         ilike(workers.strengths, `%${searchQuery}%`),
//         ilike(workers.experienceLevel, `%${searchQuery}%`),
//         sql`${workers.preferredWorkTypes} @> ARRAY[${searchQuery}]::varchar[]`
//       )
//     : undefined;

//   const [profiles, countResult] = await Promise.all([
//     db
//       .select({
//         id: workers.id,
//         userId: workers.userId,
//         name: workers.name,
//         image: workers.image,
//         address: workers.address,
//         coordinates: workers.coordinates,
//         strengths: workers.strengths,
//         availability: workers.availability,
//         contactNumber: workers.contactNumber,
//         email: workers.email,
//         experienceLevel: workers.experienceLevel,
//         preferredWorkTypes: workers.preferredWorkTypes,
//         references: workers.references,
//         createdAt: workers.createdAt,
//         clerkUserId: users.clerkUserId,
//       })
//       .from(workers)
//       .innerJoin(users, eq(users.id, workers.userId))
//       .where(whereClause)
//       .limit(pageSize)
//       .offset(offset),
//     db
//       .select({ count: sql<number>`count(*)` })
//       .from(workers)
//       .where(whereClause),
//   ]);

//   const totalRecords = countResult[0]?.count || 0;
//   const totalPages = Math.ceil(totalRecords / pageSize);

//   return {
//     profiles,
//     totalPages: totalPages > 0 ? totalPages : 1,
//     currentPage: page,
//   };
// }

// actions/profiles.ts
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

interface Reference {
  name: string;
  contact: string;
  testimonial: string;
}

interface CreateProfileInput {
  name: string;
  location: string;
  profileType: "employer" | "worker";
  image?: string;
  strengths?: string;
  availability?: string;
  rooms?: Room[];
  contactNumber?: string;
  email?: string;
  preferredSchedule?: string;
  additionalNotes?: string;
  experienceLevel?: "Beginner" | "Intermediate" | "Expert";
  preferredWorkTypes?: string[];
  references?: Reference[];
}

export type Employer = InferSelectModel<typeof employers> & {
  clerkUserId: string;
  contactNumber?: string | null;
  email?: string | null;
  preferredSchedule?: string | null;
  additionalNotes?: string | null;
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

function isValidReference(reference: unknown): reference is Reference {
  if (!reference || typeof reference !== "object") return false;
  const ref = reference as Record<string, unknown>;
  return (
    typeof ref.name === "string" &&
    typeof ref.contact === "string" &&
    typeof ref.testimonial === "string"
  );
}

export async function createUserProfile(
  input: CreateProfileInput
): Promise<Employer | Worker> {
  const serializedInput = JSON.parse(JSON.stringify(input));
  console.log(
    "Received input in createUserProfile:",
    JSON.stringify(serializedInput, null, 2)
  );
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) throw new Error("User is not authenticated");

  const {
    name,
    location,
    profileType,
    image,
    strengths,
    availability,
    rooms,
    contactNumber,
    email,
    preferredSchedule,
    additionalNotes,
    experienceLevel,
    preferredWorkTypes,
    references,
  } = serializedInput;

  if (
    !name?.trim() ||
    !location?.trim() ||
    !["employer", "worker"].includes(profileType)
  ) {
    throw new Error(
      "Invalid or missing required fields: name, location, or profileType"
    );
  }

  if (image && typeof image !== "string") {
    throw new Error("Image must be a string URL or undefined");
  }

  if (image && !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp)$/.test(image)) {
    throw new Error("Invalid image URL");
  }

  if (contactNumber && !/^\+?\d{7,15}$/.test(contactNumber)) {
    throw new Error("Invalid contact number format");
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format");
  }

  if (preferredSchedule && preferredSchedule.length > 500) {
    throw new Error("Preferred schedule must be less than 500 characters.");
  }

  if (additionalNotes && additionalNotes.length > 1000) {
    throw new Error("Additional notes must be less than 1000 characters.");
  }

  if (
    experienceLevel &&
    !["Beginner", "Intermediate", "Expert"].includes(experienceLevel)
  ) {
    throw new Error("Invalid experience level");
  }

  if (
    preferredWorkTypes &&
    (!Array.isArray(preferredWorkTypes) ||
      !preferredWorkTypes.every((type) => typeof type === "string"))
  ) {
    throw new Error("Preferred work types must be an array of strings");
  }

  if (
    references &&
    (!Array.isArray(references) || !references.every(isValidReference))
  ) {
    throw new Error("References must be an array of valid reference objects");
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
        contactNumber: contactNumber?.trim() || null,
        email: email?.trim() || null,
        preferredSchedule: preferredSchedule?.trim() || null,
        additionalNotes: additionalNotes?.trim() || null,
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
          contactNumber: contactNumber?.trim() || null,
          email: email?.trim() || null,
          preferredSchedule: preferredSchedule?.trim() || null,
          additionalNotes: additionalNotes?.trim() || null,
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
        contactNumber: contactNumber?.trim() || null,
        email: email?.trim() || null,
        experienceLevel: experienceLevel || null,
        preferredWorkTypes: preferredWorkTypes || null,
        references: references || null,
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
          contactNumber: contactNumber?.trim() || null,
          email: email?.trim() || null,
          experienceLevel: experienceLevel || null,
          preferredWorkTypes: preferredWorkTypes || null,
          references: references || null,
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
      contactNumber: employers.contactNumber,
      email: employers.email,
      preferredSchedule: employers.preferredSchedule,
      additionalNotes: employers.additionalNotes,
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
      contactNumber: workers.contactNumber,
      email: workers.email,
      experienceLevel: workers.experienceLevel,
      preferredWorkTypes: workers.preferredWorkTypes,
      references: workers.references,
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
        ilike(employers.address, `%${searchQuery}%`),
        ilike(employers.preferredSchedule, `%${searchQuery}%`),
        ilike(employers.additionalNotes, `%${searchQuery}%`)
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
        contactNumber: employers.contactNumber,
        email: employers.email,
        preferredSchedule: employers.preferredSchedule,
        additionalNotes: employers.additionalNotes,
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
        ilike(workers.strengths, `%${searchQuery}%`),
        ilike(workers.experienceLevel, `%${searchQuery}%`),
        sql`${workers.preferredWorkTypes} @> ARRAY[${searchQuery}]::varchar[]`
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
        contactNumber: workers.contactNumber,
        email: workers.email,
        experienceLevel: workers.experienceLevel,
        preferredWorkTypes: workers.preferredWorkTypes,
        references: workers.references,
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
