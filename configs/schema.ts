import {
  pgTable,
  serial,
  text,
  varchar,
  jsonb,
  timestamp,
  unique,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
    profileType: varchar("profile_type", { length: 50 })
      .notNull()
      .$type<"employer" | "worker" | "pending">(),
    name: varchar("name", { length: 255 }).notNull(),
    image: text("image"),
  },
  (table) => ({
    clerkUserIdIdx: index("users_clerk_user_id_idx").on(table.clerkUserId),
  })
);

export const employers = pgTable(
  "employers",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .references(() => users.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    image: text("image"),
    address: text("address").notNull(),
    coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
    rooms: jsonb("rooms").$type<
      {
        type: string;
        instructions: string;
        position?: { x: number; y: number; width: number; height: number };
      }[]
    >(),
    contactNumber: varchar("contact_number", { length: 20 }),
    email: varchar("email", { length: 255 }),
    preferredSchedule: text("preferred_schedule"),
    additionalNotes: text("additional_notes"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("employers_user_id_unique").on(table.userId),
    addressIdx: index("employers_address_idx").on(table.address),
    preferredScheduleIdx: index("employers_preferred_schedule_idx").on(
      table.preferredSchedule
    ),
    additionalNotesIdx: index("employers_additional_notes_idx").on(
      table.additionalNotes
    ),
  })
);

export const workers = pgTable(
  "workers",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .references(() => users.id)
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    image: text("image"),
    address: text("address").notNull(),
    coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
    strengths: text("strengths"),
    availability: text("availability"),
    contactNumber: varchar("contact_number", { length: 20 }),
    email: varchar("email", { length: 255 }),
    experienceLevel: varchar("experience_level", { length: 50 }).$type<
      "Beginner" | "Intermediate" | "Expert"
    >(),
    preferredWorkTypes: jsonb("preferred_work_types").$type<string[]>(),
    references:
      jsonb("references").$type<
        { name: string; contact: string; testimonial: string }[]
      >(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("workers_user_id_unique").on(table.userId),
    addressIdx: index("workers_address_idx").on(table.address),
  })
);
