import {
  pgTable,
  pgEnum,
  pgSchema,
  AnyPgColumn,
  varchar,
  timestamp,
  text,
  integer,
  serial,
  foreignKey,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

export const prismaMigrations = pgTable("_prisma_migrations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true, mode: "string" }),
  migrationName: varchar("migration_name", { length: 255 }).notNull(),
  logs: text("logs"),
  rolledBackAt: timestamp("rolled_back_at", {
    withTimezone: true,
    mode: "string",
  }),
  startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  appliedStepsCount: integer("applied_steps_count").notNull(),
});

export const location = pgTable("Location", {
  id: serial("id").primaryKey().notNull(),
  name: text("name"),
  neighborhood: text("neighborhood").default("to be verified").notNull(),
  priorityStatus: integer("priorityStatus").default(1).notNull(),
});

export const street = pgTable("Street", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  locationId: integer("locationId")
    .notNull()
    .references(() => location.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  lastVisited: timestamp("lastVisited", {
    precision: 3,
    mode: "string",
  }).defaultNow(),
  lastVisitedby: text("lastVisitedby"),
});

export const house = pgTable("House", {
  id: serial("id").primaryKey().notNull(),
  streetNumber: text("streetNumber").notNull(),
  lastName: text("lastName"),
  name: text("name"),
  notes: text("notes"),
  phoneOrEmail: text("phoneOrEmail"),
  type: text("type"),
  streetId: integer("streetId")
    .notNull()
    .references(() => street.id, { onDelete: "restrict", onUpdate: "cascade" }),
  locationId: integer("locationId")
    .notNull()
    .references(() => location.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  lastUpdated: timestamp("lastUpdated", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  lastUpdatedBy: text("lastUpdatedBy"),
  statusAttempt: text("statusAttempt"),
  consent: text("consent"),
});

export const worker = pgTable(
  "Worker",
  {
    id: serial("id").primaryKey().notNull(),
    name: text("name").notNull(),
    userName: text("userName").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    providerUserId: varchar("providerUserId", { length: 255 }),
    role: varchar("role", { length: 15 }),
  },
  (table) => {
    return {
      providerUserIdKey: uniqueIndex("Worker_providerUserId_key").on(
        table.providerUserId
      ),
    };
  }
);

export const shiftLogger = pgTable("ShiftLogger", {
  shiftLoggerId: serial("ShiftLoggerId").primaryKey().notNull(),
  workerId: integer("workerId")
    .notNull()
    .references(() => worker.id, { onDelete: "restrict", onUpdate: "cascade" }),
  locationId: integer("locationId")
    .notNull()
    .references(() => location.id, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  startingDate: timestamp("startingDate", { precision: 3, mode: "string" })
    .defaultNow()
    .notNull(),
  finishedDate: timestamp("finishedDate", {
    precision: 3,
    mode: "string",
  }).defaultNow(),
  updatedHouses: integer("updatedHouses"),
  updatedHousesFinal: integer("updatedHousesFinal"),
  pace: integer("pace"),
  paceFinal: integer("paceFinal"),
  userProviderUserId: varchar("userProviderUserId", { length: 255 }),
  isActive: boolean("isActive"),
});
