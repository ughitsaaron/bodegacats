"use server";

import { sql } from "../db";
import { v4 as uuidv4 } from "uuid";
import type { CatsId } from "../types/public/Cats";
import type { PhotosId } from "../types/public/Photos";
import { revalidatePath } from "next/cache";

type CreateCatParams = {
  lat: number;
  lng: number;
  creatorId: string;
  photoFile: File;
};

export async function createCat({
  lat,
  lng,
  creatorId,
  photoFile,
}: CreateCatParams) {
  try {
    // Start a transaction
    const result = await sql.begin(async (sql) => {
      // Create the cat record
      const catId = uuidv4() as CatsId;
      await sql`
        INSERT INTO cats (id, lat, lng, creator_id)
        VALUES (${catId}, ${lat}, ${lng}, ${creatorId})
      `;

      // TODO: Upload photo to storage and get URI
      // For now, we'll just use a placeholder
      const photoUri = "https://placekitten.com/400/300";

      // Create the photo record
      const photoId = uuidv4() as PhotosId;
      await sql`
        INSERT INTO photos (id, uri, cat_id)
        VALUES (${photoId}, ${photoUri}, ${catId})
      `;

      return { catId, photoId };
    });

    // Revalidate the map page to show the new cat
    revalidatePath("/");

    return { success: true, ...result };
  } catch (error) {
    console.error("Error creating cat:", error);
    return { success: false, error: "Failed to create cat" };
  }
}
