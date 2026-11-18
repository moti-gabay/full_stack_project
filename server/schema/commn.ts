import mongoose from "mongoose";
import { z } from "zod";




export const objectId = z.string().refine(mongoose.isValidObjectId, "Invalid id");

export const idParams = z.object({ id: objectId })