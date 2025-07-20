// import {
//   pgTable,
//   serial,
//   text,
//   varchar,
//   jsonb,
//   timestamp,
//   unique,
//   index,
// } from "drizzle-orm/pg-core";

// export const users = pgTable(
//   "users",
//   {
//     id: serial("id").primaryKey(),
//     clerkUserId: varchar("clerk_user_id", { length: 255 }).notNull().unique(),
//     profileType: varchar("profile_type", { length: 50 })
//       .notNull()
//       .$type<"employer" | "worker" | "pending">(),
//     name: varchar("name", { length: 255 }).notNull(),
//     image: text("image"),
//   },
//   (table) => ({
//     clerkUserIdIdx: index("users_clerk_user_id_idx").on(table.clerkUserId),
//   })
// );

// export const employers = pgTable(
//   "employers",
//   {
//     id: serial("id").primaryKey(),
//     userId: serial("user_id")
//       .references(() => users.id)
//       .notNull(),
//     name: varchar("name", { length: 255 }).notNull(),
//     address: text("address").notNull(),
//     coordinates: jsonb("coordinates"),
//     houseLayout: text("house_layout"),
//     instructions: jsonb("instructions"),
//     createdAt: timestamp("created_at").defaultNow(),
//   },
//   (table) => ({
//     userIdUnique: unique("employers_user_id_unique").on(table.userId),
//     addressIdx: index("employers_address_idx").on(table.address),
//   })
// );

// export const workers = pgTable(
//   "workers",
//   {
//     id: serial("id").primaryKey(),
//     userId: serial("user_id")
//       .references(() => users.id)
//       .notNull(),
//     name: varchar("name", { length: 255 }).notNull(),
//     image: text("image"),
//     address: text("address").notNull(),
//     coordinates: jsonb("coordinates"),
//     strengths: text("strengths"),
//     availability: text("availability"),
//     createdAt: timestamp("created_at").defaultNow(),
//   },
//   (table) => ({
//     userIdUnique: unique("workers_user_id_unique").on(table.userId),
//     addressIdx: index("workers_address_idx").on(table.address),
//   })
// );

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
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("employers_user_id_unique").on(table.userId),
    addressIdx: index("employers_address_idx").on(table.address),
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
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    userIdUnique: unique("workers_user_id_unique").on(table.userId),
    addressIdx: index("workers_address_idx").on(table.address),
  })
);
