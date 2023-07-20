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
