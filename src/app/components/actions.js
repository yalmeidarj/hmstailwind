"use server";
import db from "../../lib/utils/db";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import {
  location,
  street,
  shiftLogger,
  worker,
  house,
} from "../../../drizzle/schema";
import { Suspense } from "react";

import { currentUser } from "@clerk/nextjs";

export async function addNewShift(data) {
  // const shiftLoggerId = cookies().get("siteId")?.value;

  await db.insert(shiftLogger).values(data);
}

export async function updateHouseDetail(data, houseId) {
  const user = await currentUser();
  const id = houseId;
  await db.update(house).set(data).where(eq(house.id, id));
}

export async function fetchLocations(pageNumber, pageSize) {
  // Use the drizzle-orm to get the data from the database
  const offset = (pageNumber - 1) * pageSize; // Calculate the offset

  const locations = await db
    .select()
    .from(location)
    .limit(pageSize)
    .offset(offset)
    .execute();

  return locations;
}

export async function getShiftLoggerData(locationId) {
  const shiftLoggers = await db.query.shiftLogger.findMany({
    where: (table, { eq }) =>
      eq(table.isActive, true) && eq(table.locationId, locationId),
    with: {
      worker: true,
    },
  });

  const workers = shiftLoggers.map((shiftLogger) => (
    <Suspense fallback={<p className="text-black">Loading</p>}>
      <span className="text-blue-500 text-center mr-2">
        {" "}
        {shiftLogger.worker.name}
      </span>
    </Suspense>
  ));

  return workers;
}

export async function getNumberOfStreets(locationId) {
  // Use drizzle-orm to get the number of streets for each location
  return db
    .select()
    .from(street)
    .where(eq(street.locationId, locationId))
    .execute()
    .then((streets) => streets.length);
}

export async function getNumberOfHouses(locationId) {
  // Use drizzle-orm to get the number of houses for each location
  return db
    .select()
    .from(house)
    .where(eq(house.locationId, locationId))
    .execute()
    .then((houses) => houses.length);
}
